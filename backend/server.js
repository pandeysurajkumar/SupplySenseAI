const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: "*",
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/forecasts', require('./routes/forecastRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;

