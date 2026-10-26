const Student = require('../models/Student');
const User = require('../models/User');

// Helper to calculate profile completion %
const calculateCompletion = (student) => {
  let score = 0;
  const totalFields = 12;

  if (student.personalDetails?.fullName) score++;
  if (student.personalDetails?.dob) score++;
  if (student.personalDetails?.gender) score++;
  if (student.personalDetails?.mobileNumber) score++;
  if (student.personalDetails?.email) score++;
  if (student.personalDetails?.aadhaarNumber) score++;

  if (student.address?.city) score++;
  if (student.address?.district) score++;
  if (student.address?.pincode) score++;

  if (student.parentDetails?.parentName) score++;
  if (student.parentDetails?.parentMobile) score++;

  if (student.academicDetails?.diplomaCollege) score++;

  return Math.min(100, Math.round((score / totalFields) * 100));
};

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getStudentProfile = async (req, res, next) => {
  try {
    let student = await Student.findOne({ userId: req.user._id });
    
    if (!student) {
      student = await Student.create({
        userId: req.user._id,
        personalDetails: {
          fullName: req.user.name,
          email: req.user.email,
          mobileNumber: req.user.mobileNumber || ''
        },
        academicDetails: {
          registerNumber: req.user.registerNumber || ''
        }
      });
    }

    student.profileCompletion = calculateCompletion(student);
    await student.save();

    res.json({
      success: true,
      student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateStudentProfile = async (req, res, next) => {
  try {
    const { personalDetails, address, parentDetails, academicDetails } = req.body;

    let student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      student = new Student({ userId: req.user._id });
    }

    // Merge and update Personal Details if provided
    if (personalDetails) {
      student.personalDetails = { 
        ...student.personalDetails, 
        ...personalDetails 
      };
    }

    // Merge and update Address Details if provided
    if (address) {
      student.address = { 
        ...student.address, 
        ...address 
      };
    }

    // Merge and update Parent Details if provided
    if (parentDetails) {
      student.parentDetails = { 
        ...student.parentDetails, 
        ...parentDetails 
      };
    }

    if (academicDetails) {
      student.academicDetails = { 
        ...student.academicDetails, 
        ...academicDetails 
      };
    }

    student.profileCompletion = calculateCompletion(student);
    await student.save();

    // Also sync User model name if personalDetails.fullName changed
    if (personalDetails?.fullName && personalDetails.fullName.trim() && personalDetails.fullName !== req.user.name) {
      await User.findByIdAndUpdate(req.user._id, { name: personalDetails.fullName.trim() });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      student
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile
};
