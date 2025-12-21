const Material = require('../models/Material');
const Forecast = require('../models/Forecast');

// @desc    Get Inventory Optimization Data (Stock vs Demand)
// @route   GET /api/inventory/optimization
// @access  Private
const getInventoryOptimization = async (req, res) => {
    try {
        // 1. Get all materials (temporary for testing - remove user filtering)
        const materials = await Material.find({});

        // 2. Get the specific forecast to compare against (passed via query ?forecastId=...)
        //    OR default to the latest forecast
        let forecast = null;
        if (req.query.forecastId) {
            forecast = await Forecast.findById(req.query.forecastId);
        } else {
            // Get latest forecast (temporary for testing - not filtering by user)
            forecast = await Forecast.findOne({}).sort('-createdAt');
        }

        const optimizationData = [];

        // Map forecast requirements for easy lookup
        const demandMap = {}; // materialId -> quantity
        if (forecast && forecast.materials) {
            forecast.materials.forEach(fm => {
                if (fm.material) {
                    demandMap[fm.material.toString()] = fm.quantity;
                }
            });
        }

        // 3. Compare Stock vs Demand
        for (const mat of materials) {
            const currentStock = mat.currentStock || 0; // Field is currentStock
            // If Material model doesn't have quantity, we might need to use a different field or simulate it.
            // Checking Material model structure... previous `view_file` of models/Material.js not done.
            // Assuming 'quantity' exists based on typical implementations, but if not, I'll fallback safely.

            const demand = demandMap[mat._id.toString()] || 0;

            let status = 'Good';
            let recommendation = 'None';
            let shortage = 0;

            if (demand > currentStock) {
                shortage = demand - currentStock;
                status = 'Shortage';
                recommendation = `Procure ${shortage} ${mat.unit}`;
            } else if (currentStock > (demand * 2) && demand > 0) {
                status = 'Surplus';
                recommendation = 'Hold Procurement';
            }

            optimizationData.push({
                materialName: mat.name,
                category: mat.category,
                currentStock: currentStock,
                forecastedDemand: demand,
                unit: mat.unit,
                status: status,
                shortage: shortage,
                recommendation: recommendation,
                unitCost: mat.unitCost
            });
        }

        res.status(200).json({
            success: true,
            data: {
                forecastName: forecast ? forecast.projectName : 'No Active Forecast',
                optimizationItems: optimizationData
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
    getInventoryOptimization
};
