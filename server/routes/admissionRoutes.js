const express = require('express');
const router = express.Router();
const { submitApplication, getMyApplication } = require('../controllers/admissionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorize('student'), submitApplication);
router.get('/my-application', authorize('student'), getMyApplication);

module.exports = router;
