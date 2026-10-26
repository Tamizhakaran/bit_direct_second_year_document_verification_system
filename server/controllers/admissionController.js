const Admission = require('../models/Admission');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// Generate unique DNY Application Number: BIT-DNY-2026-XXXX
const generateApplicationNumber = async () => {
  const count = await Admission.countDocuments();
  const nextNum = String(count + 1).padStart(4, '0');
  return `BIT-DNY-2026-${nextNum}`;
};

// @desc    Submit or save admission application
// @route   POST /api/admissions
// @access  Private (Student)
const submitApplication = async (req, res, next) => {
  try {
    const { preferredDepartment, secondaryDepartment, academicDetails } = req.body;

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found. Please complete profile first.' });
    }

    let admission = await Admission.findOne({ studentId: student._id });

    if (admission && admission.status !== 'Draft' && admission.status !== 'Correction Required') {
      return res.status(400).json({
        message: `Application has already been submitted (Current status: ${admission.status}). Editing is restricted unless requested by verifier.`
      });
    }

    if (!preferredDepartment) {
      return res.status(400).json({ message: 'Preferred Department is required' });
    }

    if (!academicDetails || !academicDetails.diplomaCollege || !academicDetails.diplomaBranch || !academicDetails.percentageCGPA) {
      return res.status(400).json({ message: 'All diploma academic fields are required' });
    }

    if (!admission) {
      const applicationNumber = await generateApplicationNumber();
      admission = new Admission({
        studentId: student._id,
        userId: req.user._id,
        applicationNumber,
        preferredDepartment,
        secondaryDepartment: secondaryDepartment || '',
        academicDetails,
        status: 'Submitted',
        submittedAt: new Date()
      });
    } else {
      admission.preferredDepartment = preferredDepartment;
      admission.secondaryDepartment = secondaryDepartment || '';
      admission.academicDetails = academicDetails;
      admission.status = 'Submitted';
      admission.submittedAt = new Date();
    }

    await admission.save();

    // Also update student's academicDetails record
    student.academicDetails = academicDetails;
    await student.save();

    // Notification
    await Notification.create({
      userId: req.user._id,
      title: 'Application Submitted',
      message: `Your Direct Second Year application (${admission.applicationNumber}) for ${preferredDepartment} has been submitted successfully! Please upload all required documents.`,
      type: 'info'
    });

    // Audit Log
    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'student',
      action: 'SUBMIT_APPLICATION',
      description: `Application ${admission.applicationNumber} submitted for department ${preferredDepartment}`
    });

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully',
      admission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my admission application
// @route   GET /api/admissions/my-application
// @access  Private (Student)
const getMyApplication = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.json({ success: true, admission: null });
    }

    const admission = await Admission.findOne({ studentId: student._id })
      .populate('studentId')
      .populate('verifiedBy', 'name email');

    res.json({
      success: true,
      admission
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getMyApplication
};
