const Material = require('../models/Material');

// @desc    Get all materials
// @route   GET /api/materials
// @access  Private
const getMaterials = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category && category !== 'All Categories') {
      query.category = category;
    }

    if (status && status !== 'All Status') {
      query.status = status;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Data Isolation: If not admin, only show own materials
    // Temporary for testing - show all materials
    // if (req.user && req.user.role !== 'admin') {
    //   query.createdBy = req.user.id;
    // }

    const materials = await Material.find(query).populate('supplier', 'name email');

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single material
// @route   GET /api/materials/:id
// @access  Private
const getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate('supplier');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    res.status(200).json({
      success: true,
      data: material,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new material
// @route   POST /api/materials
// @access  Private
const createMaterial = async (req, res) => {
  try {
    // Assign createdBy to current user (temporary for testing)
    req.body.createdBy = req.user ? req.user.id : '507f1f77bcf86cd799439011';

    // Handle supplier field - convert empty string to null
    if (req.body.supplier === '') {
      req.body.supplier = null;
    }

    // Calculate status based on stock
    const currentStock = req.body.currentStock || 0;
    const reorderLevel = req.body.reorderLevel || 0;

    if (currentStock === 0) {
      req.body.status = 'Out of Stock';
    } else if (currentStock <= reorderLevel) {
      req.body.status = 'Low Stock';
    } else {
      req.body.status = 'In Stock';
    }

    const material = await Material.create(req.body);

    res.status(201).json({
      success: true,
      data: material,
    });
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private
const updateMaterial = async (req, res) => {
  try {
    // Handle supplier field - convert empty string to null
    if (req.body.supplier === '') {
      req.body.supplier = null;
    }

    // Calculate status based on stock if stock fields are being updated
    if (req.body.currentStock !== undefined || req.body.reorderLevel !== undefined) {
      const material = await Material.findById(req.params.id);
      if (material) {
        const currentStock = req.body.currentStock !== undefined ? req.body.currentStock : material.currentStock;
        const reorderLevel = req.body.reorderLevel !== undefined ? req.body.reorderLevel : material.reorderLevel;

        if (currentStock === 0) {
          req.body.status = 'Out of Stock';
        } else if (currentStock <= reorderLevel) {
          req.body.status = 'Low Stock';
        } else {
          req.body.status = 'In Stock';
        }
      }
    }

    const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    res.status(200).json({
      success: true,
      data: material,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    await material.deleteOne();

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

module.exports = {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};

