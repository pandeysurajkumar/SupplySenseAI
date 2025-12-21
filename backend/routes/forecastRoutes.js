const express = require('express');
const router = express.Router();
const {
  getForecasts,
  getForecast,
  createForecast,
  updateForecast,
  deleteForecast,
  generateForecast
} = require('../controllers/forecastController');
const { protect } = require('../middleware/auth');

router.route('/').get(getForecasts).post(createForecast);
router.route('/generate').post(generateForecast);
router.route('/:id').get(getForecast).put(updateForecast).delete(deleteForecast);

module.exports = router;

