const express = require('express');
const router = express.Router();
const { uploadDocument, getMyDocuments, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.post('/upload', authorize('student'), upload.single('file'), uploadDocument);
router.get('/my-documents', authorize('student'), getMyDocuments);
router.delete('/:id', authorize('student'), deleteDocument);

module.exports = router;
