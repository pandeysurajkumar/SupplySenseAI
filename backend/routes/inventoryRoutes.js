const express = require('express');
const router = express.Router();
const { getInventoryOptimization } = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

router.route('/optimization').get(getInventoryOptimization);

module.exports = router;
