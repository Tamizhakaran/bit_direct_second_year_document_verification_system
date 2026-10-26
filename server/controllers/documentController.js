const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const Student = require('../models/Student');
const Notification = require('../models/Notification');

// @desc    Upload or replace a document
// @route   POST /api/documents/upload
// @access  Private (Student)
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { documentType } = req.body;
    if (!documentType) {
      // Remove uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Document type is required' });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const relativePath = `/uploads/${req.file.filename}`;

    // Check if document of this type already exists for student
    let existingDoc = await Document.findOne({ studentId: student._id, documentType });

    if (existingDoc) {
      // Delete old file if exists
      const oldFilePath = path.join(__dirname, '..', existingDoc.filePath);
      if (fs.existsSync(oldFilePath)) {
        try { fs.unlinkSync(oldFilePath); } catch (err) { console.error('Error removing old file:', err); }
      }

      existingDoc.fileName = req.file.originalname;
      existingDoc.filePath = relativePath;
      existingDoc.fileSize = req.file.size;
      existingDoc.mimeType = req.file.mimetype;
      existingDoc.status = 'Pending'; // Reset to pending verification
      existingDoc.remarks = '';
      existingDoc.uploadedAt = new Date();

      await existingDoc.save();

      return res.json({
        success: true,
        message: `${documentType} re-uploaded successfully and sent for verification`,
        document: existingDoc
      });
    }

    // Create new document record
    const document = await Document.create({
      studentId: student._id,
      userId: req.user._id,
      documentType,
      fileName: req.file.originalname,
      filePath: relativePath,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: `${documentType} uploaded successfully`,
      document
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (err) {}
    }
    next(error);
  }
};

// @desc    Get my uploaded documents
// @route   GET /api/documents/my-documents
// @access  Private (Student)
const getMyDocuments = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.json({ success: true, documents: [] });
    }

    const documents = await Document.find({ studentId: student._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private (Student)
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this document' });
    }

    if (document.status === 'Verified') {
      return res.status(400).json({ message: 'Verified documents cannot be deleted. Contact administrator if update is needed.' });
    }

    // Delete file from disk
    const absolutePath = path.join(__dirname, '..', document.filePath);
    if (fs.existsSync(absolutePath)) {
      try { fs.unlinkSync(absolutePath); } catch (err) {}
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  deleteDocument
};
