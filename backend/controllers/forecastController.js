const Forecast = require('../models/Forecast');
const Material = require('../models/Material');

// @desc    Get all forecasts
// @route   GET /api/forecasts
// @access  Private
const getForecasts = async (req, res) => {
  try {
    // Temporary for testing - get all forecasts
    const forecasts = await Forecast.find({})
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

    // Temporary for testing - allow deletion without user check
    // Make sure user owns the forecast
    // if (forecast.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Not authorized to delete this forecast',
    //   });
    // }

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
    let materialHistories = {};

    // Check if user uploaded history with material-specific data
    if (historicalData && Array.isArray(historicalData)) {
      // Group data by material_name
      materialHistories = historicalData.reduce((acc, item) => {
        const materialName = item.material_name || 'General';
        if (!acc[materialName]) {
          acc[materialName] = [];
        }
        acc[materialName].push({
          date: item.date,
          quantity: parseFloat(item.quantity)
        });
        return acc;
      }, {});

      // Use the first material's data for the main forecast (for backward compatibility)
      const firstMaterial = Object.keys(materialHistories)[0];
      historyPayload = materialHistories[firstMaterial] || [];
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
    let pythonRes = null; // Declare outside try block

    try {
      // Try calling Python Service
      pythonRes = await axios.post('http://localhost:5001/predict', {
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


    // 3. Logic for Materials Breakdown - Use actual database materials
    const allMaterials = await Material.find({});
    const budgetCr = parseFloat(budget) || 10;

    let locationFactor = 1.0;
    if (location === 'Northern Region') locationFactor = 1.1;

    const forecastedMaterials = [];

    // Use actual materials from database instead of hardcoded recipes
    for (const dbMaterial of allMaterials) {
      let quantity = 0;
      let confidence = 85;

      // Check if we have historical data for this specific material
      const materialHistory = materialHistories[dbMaterial.name];
      if (materialHistory && materialHistory.length > 0) {
        // Use ML prediction for this material's historical data
        try {
          const materialPayload = materialHistory.map(h => ({
            date: h.date,
            quantity: h.quantity
          }));

          const materialRes = await axios.post('http://localhost:5001/predict', {
            history: materialPayload,
            params: {
              budget: budgetCr,
              location,
              towerType,
              forecastPeriod: forecastPeriod === '6 Months' ? 6 : (forecastPeriod === '2 Years' ? 24 : 12)
            }
          });

          if (materialRes.data.success && materialRes.data.chartData) {
            // Use the average of the forecasted values as the quantity
            const avgForecast = materialRes.data.chartData.reduce((sum, val) => sum + val, 0) / materialRes.data.chartData.length;
            quantity = Math.round(avgForecast);
            confidence = 90 + Math.floor(Math.random() * 9); // Higher confidence for data-driven forecasts
          }
        } catch (materialErr) {
          console.log(`ML prediction failed for ${dbMaterial.name}, using fallback`);
      }
      }

      // Fallback calculation if no historical data or ML failed
      if (quantity === 0) {
        // Use budget-based calculation with some randomization
        const baseQuantity = (budgetCr * 100) + Math.floor(Math.random() * 200); // Base calculation
        quantity = Math.round(baseQuantity * locationFactor);
        confidence = 75 + Math.floor(Math.random() * 14);
      }

      forecastedMaterials.push({
        material: dbMaterial._id,
        name: dbMaterial.name,
        category: dbMaterial.category,
        quantity: quantity,
        unit: dbMaterial.unit,
        unitCost: dbMaterial.unitCost,
        confidence: confidence
      });
    }

    // Save the forecast to database for inventory optimization
    try {
      const forecastData = {
        user: req.user ? req.user.id : '507f1f77bcf86cd799439011',
        projectName: `Forecast - ${location} ${towerType}`,
        budget: budgetCr,
        location,
        towerType,
        forecastPeriod,
        materials: forecastedMaterials.map(m => ({
          material: m.material,
          quantity: m.quantity,
          unit: m.unit,
          unitCost: m.unitCost,
          totalCost: m.quantity * m.unitCost,
          confidence: m.confidence
        })),
        subtotal: forecastedMaterials.reduce((sum, m) => sum + (m.quantity * m.unitCost), 0),
        taxes: 0, // Will be calculated if needed
        totalCost: forecastedMaterials.reduce((sum, m) => sum + (m.quantity * m.unitCost), 0),
        status: 'Completed'
      };

      console.log('Saving forecast to database:', forecastData);
      const savedForecast = await Forecast.create(forecastData);
      console.log('Forecast saved successfully:', savedForecast._id);
    } catch (saveError) {
      console.error('Error saving forecast:', saveError);
      // Continue with response even if save fails
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
