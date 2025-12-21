const express = require('express');
const router = express.Router();
const {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { protect } = require('../middleware/auth');

router.route('/').get(getMaterials).post(createMaterial);
router.route('/:id').get(protect, getMaterial).put(updateMaterial).delete(protect, deleteMaterial);
router.route('/:id').get(protect, getMaterial).put(protect, updateMaterial).delete(protect, deleteMaterial);

module.exports = router;

