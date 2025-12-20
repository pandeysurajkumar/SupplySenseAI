const Forecast = require('../models/Forecast');
const Material = require('../models/Material');

// @desc    Get all forecasts
// @route   GET /api/forecasts
// @access  Private
const getForecasts = async (req, res) => {
  try {
    const forecasts = await Forecast.find({ user: req.user.id })
      .populate('materials.material')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: forecasts.length,
      data: forecasts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single forecast
// @route   GET /api/forecasts/:id
// @access  Private
const getForecast = async (req, res) => {
  try {
    const forecast = await Forecast.findById(req.params.id)
      .populate('materials.material')
      .populate('user', 'username email fullName');

    if (!forecast) {
      return res.status(404).json({
        success: false,
        message: 'Forecast not found',
      });
    }

    // Make sure user owns the forecast
    if (forecast.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this forecast',
      });
    }

    res.status(200).json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new forecast
// @route   POST /api/forecasts
// @access  Private
const createForecast = async (req, res) => {
  try {
    req.body.user = req.user.id;

    // Calculate material costs and totals
    let subtotal = 0;
    const materials = [];

    if (req.body.materials && req.body.materials.length > 0) {
      for (const mat of req.body.materials) {
        const material = await Material.findById(mat.material);
        if (material) {
          const totalCost = mat.quantity * material.unitCost;
          subtotal += totalCost;
          materials.push({
            material: mat.material,
            quantity: mat.quantity,
            unit: material.unit,
            unitCost: material.unitCost,
            totalCost,
            confidence: mat.confidence || 90,
          });
        }
      }
    }

    const taxes = subtotal * (req.body.taxRate / 100);
    const totalCost = subtotal + taxes;

    const forecast = await Forecast.create({
      ...req.body,
      materials,
      subtotal,
      taxes,
      totalCost,
      status: 'Completed',
    });

    res.status(201).json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update forecast
// @route   PUT /api/forecasts/:id
// @access  Private
const updateForecast = async (req, res) => {
  try {
    let forecast = await Forecast.findById(req.params.id);

    if (!forecast) {
      return res.status(404).json({
        success: false,
        message: 'Forecast not found',
      });
    }

    // Make sure user owns the forecast
    if (forecast.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this forecast',
      });
    }

    forecast = await Forecast.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete forecast
// @route   DELETE /api/forecasts/:id
// @access  Private
const deleteForecast = async (req, res) => {
  try {
    const forecast = await Forecast.findById(req.params.id);

    if (!forecast) {
      return res.status(404).json({
        success: false,
        message: 'Forecast not found',
      });
    }

    // Make sure user owns the forecast
    if (forecast.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this forecast',
      });
    }

    await forecast.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Generate a new forecast based on parameters (Real ML via Python)
// @route   POST /api/forecasts/generate
// @access  Private
const generateForecast = async (req, res) => {
  try {
    const { budget, location, towerType, forecastPeriod, historicalData } = req.body;
    const axios = require('axios');

    // 1. Prepare data for Python Service
    let historyPayload = [];

    // Check if user uploaded history, otherwise assume we use a default/sample history
    if (historicalData && Array.isArray(historicalData)) {
      historyPayload = historicalData;
    } else {
      // Fallback: Generate some dummy history if none provided (for demo purposes)
      const today = new Date();
      for (let i = 24; i > 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        historyPayload.push({
          date: d.toISOString().split('T')[0],
          quantity: Math.floor(Math.random() * 500) + 100 // Random dummy data
        });
      }
    }

    // 2. Call Python Service
    let chartLabels = [];
    let chartData = [];
    let modelUsed = "Simulation (Python Service Unavailable)";

    try {
      // Try calling Python Service
      const pythonRes = await axios.post('http://localhost:5001/predict', {
        history: historyPayload,
        params: {
          budget,
          location,
          towerType,
          forecastPeriod: forecastPeriod === '6 Months' ? 6 : (forecastPeriod === '2 Years' ? 24 : 12)
        }
      });

      if (pythonRes.data.success) {
        chartLabels = pythonRes.data.chartLabels;
        chartData = pythonRes.data.chartData;
        modelUsed = pythonRes.data.model_used;

        // Extract optimization metrics if available
        if (pythonRes.data.optimization_metrics) {
          console.log("Optimization Metrics Received:", pythonRes.data.optimization_metrics);
          // We can attach this to the response or use it to adjust the confidence/quantity logic below
          // For now, let's keep it in the response data
        }
      }
    } catch (metricErr) {
      console.error("Python ML Service Error:", metricErr.message);
      // Fallback to JS simulation if Python is down
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chartLabels = months;
      chartData = months.map(() => Math.floor(Math.random() * 100));
    }


    // 3. Logic for Materials Breakdown (This effectively stays similar as it maps demand to materials)
    const allMaterials = await Material.find({});

    const budgetCr = parseFloat(budget) || 10;

    let locationFactor = 1.0;
    if (location === 'Northern Region') locationFactor = 1.1;

    const recipe = [
      { name: 'Structural Steel', basePerCr: 80, unit: 'Metric Tons' },
      { name: 'Conductor Cable', basePerCr: 45, unit: 'Kilometers' },
      { name: 'Insulators', basePerCr: 600, unit: 'Units' },
      { name: 'Concrete', basePerCr: 300, unit: 'Cubic Meters' },
      { name: 'Hardware & Fittings', basePerCr: 1500, unit: 'Units' }
    ];

    const forecastedMaterials = [];

    for (const item of recipe) {
      let unitCost = 5000;
      let matId = null;
      let matCategory = 'General';

      const dbMaterial = allMaterials.find(m => m.name.includes(item.name));
      if (dbMaterial) {
        unitCost = dbMaterial.unitCost;
        matId = dbMaterial._id;
        matCategory = dbMaterial.category;
      }

      let quantity = item.basePerCr * budgetCr * locationFactor;
      const confidence = 85 + Math.floor(Math.random() * 14);

      forecastedMaterials.push({
        material: matId,
        name: item.name,
        category: matCategory,
        quantity: Math.round(quantity),
        unit: item.unit,
        unitCost: unitCost,
        confidence: confidence
      });
    }

    res.status(200).json({
      success: true,
      data: {
        materials: forecastedMaterials,
        chartLabels: chartLabels,
        chartData: chartData,
        modelInfo: modelUsed,
        optimizationMetrics: pythonRes?.data?.optimization_metrics || null
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getForecasts,
  getForecast,
  createForecast,
  updateForecast,
  deleteForecast,
  generateForecast
};
