const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bit_dny_admission_secret_key_2026_super_secure', {
    expiresIn: '7d'
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res, next) => {
  try {
    const { name, email, mobileNumber, password, confirmPassword, registerNumber } = req.body;

    if (!name || !email || !password || !registerNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check existing email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    // Check existing register number
    const existingRegNo = await User.findOne({ registerNumber });
    if (existingRegNo) {
      return res.status(400).json({ message: 'A student with this register number is already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobileNumber,
      password: hashedPassword,
      registerNumber,
      role: 'student'
    });

    // Create corresponding Student profile record
    const student = await Student.create({
      userId: user._id,
      personalDetails: {
        fullName: name,
        email: user.email,
        mobileNumber: mobileNumber || ''
      },
      academicDetails: {
        registerNumber: registerNumber
      },
      profileCompletion: 25 // 25% completed on initial registration
    });

    // Create Welcome Notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to BIT DNY Portal',
      message: 'Your account has been successfully created. Please complete your profile and submit your DNY admission application.',
      type: 'success'
    });

    // Audit Log
    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      role: 'student',
      action: 'REGISTER_STUDENT',
      description: `New student registered with Reg No: ${registerNumber}`
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        registerNumber: user.registerNumber,
        studentId: student._id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new Admin or SuperAdmin with Security Access Code
// @route   POST /api/auth/register-staff
// @access  Public (Protected by Security Code)
const registerStaff = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role, department, mobileNumber, securityCode } = req.body;

    if (!name || !email || !password || !role || !securityCode) {
      return res.status(400).json({ message: 'Name, Email, Password, Role, and Security Access Code are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Role-specific validation and Security Code Verification
    if (role === 'superadmin') {
      const validSuperCode = process.env.SUPERADMIN_SECURITY_CODE || 'BIT_SUPER_2026';
      if (securityCode.trim() !== validSuperCode) {
        return res.status(401).json({ message: 'Invalid Super Admin Security Access Code. Contact institutional administration.' });
      }
    } else if (role === 'admin') {
      const validAdminCode = process.env.ADMIN_SECURITY_CODE || 'BIT_FACULTY_2026';
      if (securityCode.trim() !== validAdminCode) {
        return res.status(401).json({ message: 'Invalid Faculty Verifier Security Access Code. Contact department coordinator.' });
      }

      if (!department) {
        return res.status(400).json({ message: 'Assigned Department is required for Faculty Verifier' });
      }

      if (!email.toLowerCase().endsWith('@bitsathy.ac.in')) {
        return res.status(400).json({ message: 'Faculty Verifier email address must end with @bitsathy.ac.in' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid registration role specified' });
    }

    // Check existing email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobileNumber: mobileNumber || '',
      password: hashedPassword,
      role,
      department: role === 'admin' ? department : undefined,
      status: 'active'
    });

    // Create Audit Log
    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'REGISTER_STAFF',
      description: `New ${role === 'superadmin' ? 'Super Administrator' : `Faculty Verifier (${department})`} registered via security access code.`
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: `${role === 'superadmin' ? 'Super Admin' : 'Faculty Verifier'} account registered successfully`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account has been disabled by the administrator.' });
    }

    let studentProfile = null;
    if (user.role === 'student') {
      studentProfile = await Student.findOne({ userId: user._id });
    }

    // Audit log
    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'USER_LOGIN',
      description: `User logged in as ${user.role}`
    });

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        registerNumber: user.registerNumber,
        studentId: studentProfile ? studentProfile._id : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let studentProfile = null;

    if (user.role === 'student') {
      studentProfile = await Student.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        registerNumber: user.registerNumber,
        mobileNumber: user.mobileNumber,
        studentId: studentProfile ? studentProfile._id : null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudent,
  registerStaff,
  loginUser,
  getMe
};
