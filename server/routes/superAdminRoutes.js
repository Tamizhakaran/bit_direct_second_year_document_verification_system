const express = require('express');
const router = express.Router();
const {
  getAdmins,
  createAdmin,
  toggleAdminStatus,
  getDepartments,
  createDepartment,
  updateDepartmentSeats,
  getAuditLogs,
  getSuperAdminStats,
  getLandingContent,
  updateLandingContent,
  addAchievementBanner,
  updateAchievementBanner,
  deleteAchievementBanner,
  uploadLandingImage,
  addFeatureCard,
  updateFeatureCard,
  deleteFeatureCard,
  addCampusPhoto,
  updateCampusPhoto,
  deleteCampusPhoto
} = require('../controllers/superAdminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route to fetch departments list (used in student application dropdown)
router.get('/departments/public', getDepartments);

// Public route to fetch landing page content (branding, banner carousel, about campus)
router.get('/landing-content', getLandingContent);

router.use(protect);

router.get('/admins', authorize('superadmin'), getAdmins);
router.post('/admins', authorize('superadmin'), createAdmin);
router.put('/admins/:id/status', authorize('superadmin'), toggleAdminStatus);

router.get('/departments', getDepartments); // All authenticated roles can view
router.post('/departments', authorize('superadmin'), createDepartment);
router.put('/departments/:id', authorize('superadmin'), updateDepartmentSeats);

router.get('/audit-logs', authorize('superadmin'), getAuditLogs);
router.get('/stats', authorize('superadmin'), getSuperAdminStats);

// SuperAdmin Landing Page & Banner Management routes
router.put('/landing-content', authorize('superadmin'), updateLandingContent);
router.post('/landing-content/banner', authorize('superadmin'), addAchievementBanner);
router.put('/landing-content/banner/:id', authorize('superadmin'), updateAchievementBanner);
router.delete('/landing-content/banner/:id', authorize('superadmin'), deleteAchievementBanner);
router.post('/landing-content/upload-image', authorize('superadmin'), upload.single('image'), uploadLandingImage);

// SuperAdmin Feature Cards Management routes
router.post('/landing-content/feature', authorize('superadmin'), addFeatureCard);
router.put('/landing-content/feature/:id', authorize('superadmin'), updateFeatureCard);
router.delete('/landing-content/feature/:id', authorize('superadmin'), deleteFeatureCard);

// SuperAdmin Campus Gallery routes
router.post('/landing-content/gallery', authorize('superadmin'), addCampusPhoto);
router.put('/landing-content/gallery/:id', authorize('superadmin'), updateCampusPhoto);
router.delete('/landing-content/gallery/:id', authorize('superadmin'), deleteCampusPhoto);

module.exports = router;
