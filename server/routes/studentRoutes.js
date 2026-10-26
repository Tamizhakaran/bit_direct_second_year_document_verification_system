const express = require('express');
const router = express.Router();
const { getStudentProfile, updateStudentProfile } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('student'));

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);

module.exports = router;
