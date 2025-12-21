const Report = require('../models/Report');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    // For testing, show all reports or filter by user if available
    const query = req.user ? { user: req.user.id } : {};

    if (type && type !== 'All Types') {
      query.type = type;
    }

    if (status && status !== 'All Status') {
      query.status = status;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const reports = await Report.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('user', 'username email fullName');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Make sure user owns the report
    if (report.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this report',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    // Assign user ID (temporary for testing)
    req.body.user = req.user ? req.user.id : '507f1f77bcf86cd799439011';

    const report = await Report.create(req.body);

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Make sure user owns the report
    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this report',
      });
    }

    report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Temporary for testing - allow deletion without user check
    // Make sure user owns the report
    // if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Not authorized to delete this report',
    //   });
    // }

    await report.deleteOne();

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
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
};

