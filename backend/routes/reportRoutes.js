const express = require('express');
const router = express.Router();
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.route('/').get(getReports).post(createReport);
router.route('/:id').get(protect, getReport).put(protect, updateReport).delete(protect, deleteReport);

module.exports = router;

