const express = require('express');
const router = express.Router();
const {
  getApplications,
  getApplicationById,
  verifyDocument,
  rejectDocument,
  updateApplicationStatus,
  getAdminStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/applications', getApplications);
router.get('/applications/:id', getApplicationById);
router.put('/documents/:id/verify', verifyDocument);
router.put('/documents/:id/reject', rejectDocument);
router.put('/applications/:id/status', updateApplicationStatus);
router.get('/stats', getAdminStats);

module.exports = router;
