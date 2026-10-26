const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationNumber: {
    type: String,
    required: true,
    unique: true
  },
  preferredDepartment: {
    type: String,
    required: [true, 'Preferred department is required']
  },
  secondaryDepartment: {
    type: String,
    default: ''
  },
  academicDetails: {
    diplomaCollege: { type: String, required: true },
    diplomaBranch: { type: String, required: true },
    registerNumber: { type: String, required: true },
    passingYear: { type: String, required: true },
    percentageCGPA: { type: String, required: true },
    mediumOfInstruction: { type: String, default: 'English' }
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Verification', 'Correction Required', 'Approved', 'Rejected'],
    default: 'Submitted'
  },
  adminRemarks: {
    type: String,
    default: ''
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admission', admissionSchema);
