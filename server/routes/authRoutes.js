const express = require('express');
const router = express.Router();
const { registerStudent, registerStaff, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/register-staff', registerStaff);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
