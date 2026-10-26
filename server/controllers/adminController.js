const Admission = require('../models/Admission');
const Student = require('../models/Student');
const Document = require('../models/Document');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// @desc    Get all applications with filters
// @route   GET /api/admin/applications
// @access  Private (Admin, SuperAdmin)
const getApplications = async (req, res, next) => {
  try {
    const { department, status, search } = req.query;
    let query = {};

    // Filter by department if admin has assigned department or filter passed
    if (req.user.role === 'admin' && req.user.department) {
      query.preferredDepartment = req.user.department;
    } else if (department && department !== 'All') {
      query.preferredDepartment = department;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let applications = await Admission.find(query)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email mobileNumber registerNumber' }
      })
      .sort({ createdAt: -1 });

    // Client search filter (by student name, application number, register number)
    if (search) {
      const searchLower = search.toLowerCase();
      applications = applications.filter(app => {
        const studentName = app.studentId?.userId?.name?.toLowerCase() || '';
        const regNo = app.academicDetails?.registerNumber?.toLowerCase() || '';
        const appNo = app.applicationNumber?.toLowerCase() || '';
        return studentName.includes(searchLower) || regNo.includes(searchLower) || appNo.includes(searchLower);
      });
    }

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application details with documents
// @route   GET /api/admin/applications/:id
// @access  Private (Admin, SuperAdmin)
const getApplicationById = async (req, res, next) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email mobileNumber registerNumber' }
      })
      .populate('verifiedBy', 'name email');

    if (!admission) {
      return res.status(404).json({ message: 'Admission application not found' });
    }

    const documents = await Document.find({ studentId: admission.studentId._id });

    res.json({
      success: true,
      admission,
      documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify single document
// @route   PUT /api/admin/documents/:id/verify
// @access  Private (Admin, SuperAdmin)
const verifyDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.status = 'Verified';
    document.remarks = req.body.remarks || 'Document verified & validated.';
    document.verifiedAt = new Date();
    document.verifiedBy = req.user._id;

    await document.save();

    // Create Notification for Student
    await Notification.create({
      userId: document.userId,
      title: 'Document Verified',
      message: `Your document "${document.documentType}" has been verified successfully.`,
      type: 'success'
    });

    // Audit log
    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'VERIFY_DOCUMENT',
      description: `Verified document ${document.documentType} for student ID: ${document.studentId}`
    });

    res.json({
      success: true,
      message: `Document '${document.documentType}' verified successfully`,
      document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject single document with remarks
// @route   PUT /api/admin/documents/:id/reject
// @access  Private (Admin, SuperAdmin)
const rejectDocument = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    if (!remarks || remarks.trim() === '') {
      return res.status(400).json({ message: 'Verification rejection requires mandatory remarks explaining the reason' });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.status = 'Rejected';
    document.remarks = remarks.trim();
    document.verifiedAt = new Date();
    document.verifiedBy = req.user._id;

    await document.save();

    // Auto update application status to Correction Required if not already rejected
    const admission = await Admission.findOne({ studentId: document.studentId });
    if (admission && admission.status !== 'Rejected') {
      admission.status = 'Correction Required';
      admission.adminRemarks = `Document (${document.documentType}) rejected: ${remarks}`;
      await admission.save();
    }

    // Create Notification for Student
    await Notification.create({
      userId: document.userId,
      title: 'Document Action Required',
      message: `Your uploaded "${document.documentType}" was rejected. Reason: ${remarks}. Please re-upload a valid document.`,
      type: 'danger'
    });

    // Audit log
    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'REJECT_DOCUMENT',
      description: `Rejected document ${document.documentType}. Reason: ${remarks}`
    });

    res.json({
      success: true,
      message: `Document '${document.documentType}' marked as Rejected`,
      document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/admin/applications/:id/status
// @access  Private (Admin, SuperAdmin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;
    const allowedStatuses = ['Submitted', 'Under Verification', 'Correction Required', 'Approved', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` });
    }

    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Application not found' });
    }

    admission.status = status;
    if (adminRemarks !== undefined) {
      admission.adminRemarks = adminRemarks;
    }
    admission.verifiedBy = req.user._id;
    admission.verifiedAt = new Date();

    await admission.save();

    // Send Notification to Student
    let notificationTitle = 'Application Status Updated';
    let notificationType = 'info';

    if (status === 'Approved') {
      notificationTitle = '🎉 Admission Approved!';
      notificationType = 'success';
    } else if (status === 'Rejected') {
      notificationTitle = 'Application Status: Rejected';
      notificationType = 'danger';
    } else if (status === 'Correction Required') {
      notificationTitle = 'Action Required: Application Correction';
      notificationType = 'warning';
    }

    await Notification.create({
      userId: admission.userId,
      title: notificationTitle,
      message: `Your Direct Second Year Admission Application status has been updated to "${status}". Remarks: ${admission.adminRemarks || 'N/A'}`,
      type: notificationType
    });

    // Audit Log
    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE_APPLICATION_STATUS',
      description: `Updated application ${admission.applicationNumber} status to ${status}`
    });

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      admission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin statistics summary
// @route   GET /api/admin/stats
// @access  Private (Admin, SuperAdmin)
const getAdminStats = async (req, res, next) => {
  try {
    let deptFilter = {};
    if (req.user.role === 'admin' && req.user.department) {
      deptFilter.preferredDepartment = req.user.department;
    }

    const totalApplications = await Admission.countDocuments(deptFilter);
    const submitted = await Admission.countDocuments({ ...deptFilter, status: 'Submitted' });
    const underVerification = await Admission.countDocuments({ ...deptFilter, status: 'Under Verification' });
    const correctionRequired = await Admission.countDocuments({ ...deptFilter, status: 'Correction Required' });
    const approved = await Admission.countDocuments({ ...deptFilter, status: 'Approved' });
    const rejected = await Admission.countDocuments({ ...deptFilter, status: 'Rejected' });

    const pending = submitted + underVerification;

    res.json({
      success: true,
      stats: {
        totalApplications,
        pending,
        submitted,
        underVerification,
        correctionRequired,
        approved,
        rejected
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  verifyDocument,
  rejectDocument,
  updateApplicationStatus,
  getAdminStats
};
