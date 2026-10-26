const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalDetails: {
    fullName: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    mobileNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    aadhaarNumber: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    nationality: { type: String, default: 'Indian' },
    community: { type: String, default: '' }
  },
  address: {
    doorNo: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: 'Tamil Nadu' },
    pincode: { type: String, default: '' }
  },
  parentDetails: {
    parentName: { type: String, default: '' },
    relationship: { type: String, default: 'Father' },
    parentMobile: { type: String, default: '' },
    parentEmail: { type: String, default: '' },
    occupation: { type: String, default: '' },
    annualIncome: { type: String, default: '' }
  },
  academicDetails: {
    diplomaCollege: { type: String, default: '' },
    diplomaBranch: { type: String, default: '' },
    registerNumber: { type: String, default: '' },
    passingYear: { type: String, default: '' },
    percentageCGPA: { type: String, default: '' }
  },
  profileCompletion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
