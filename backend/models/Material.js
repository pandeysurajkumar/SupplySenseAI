const mongoose = require('mongoose');

const materialSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a material name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Tower Components', 'Transmission Line', 'Sub-station Fittings', 'Foundation Materials', 'Accessories'],
    },
    currentStock: {
      type: Number,
      required: [true, 'Please add current stock'],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Please add a unit'],
      enum: ['Units', 'Kilometers', 'Metric Tons', 'Cubic Meters', 'kg'],
    },
    reorderLevel: {
      type: Number,
      required: [true, 'Please add reorder level'],
      default: 0,
    },
    unitCost: {
      type: Number,
      required: [true, 'Please add unit cost'],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Status will be calculated in the controller

module.exports = mongoose.model('Material', materialSchema);

