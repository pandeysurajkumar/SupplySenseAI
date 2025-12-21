# SupplySenseAI Backend API

Backend API for SUPPLYSENSEAI Supply Chain Intelligence System built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication & Authorization
- 📦 Material Inventory Management
- 📊 Forecasting & Analytics
- 📄 Report Generation
- 🏢 Supplier Management
- 🗄️ MongoDB Database
- 🔒 Security Middleware (Helmet, CORS)
- ✅ Error Handling
- 📝 Request Logging

## Project Structure

```
backend/
├── config/          # Configuration files (database, JWT)
├── controllers/     # Business logic controllers
├── middleware/      # Custom middleware (auth, error handling)
├── models/          # MongoDB schemas/models
├── routes/          # API route definitions
├── services/        # Business services (optional)
├── utils/           # Utility functions
├── server.js        # Main server file
└── package.json     # Dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/supplysense

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if installed as service)
net start MongoDB

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in .env file
```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Materials
- `GET /api/materials` - Get all materials (Protected)
- `GET /api/materials/:id` - Get single material (Protected)
- `POST /api/materials` - Create material (Protected)
- `PUT /api/materials/:id` - Update material (Protected)
- `DELETE /api/materials/:id` - Delete material (Protected)

### Forecasts
- `GET /api/forecasts` - Get all forecasts (Protected)
- `GET /api/forecasts/:id` - Get single forecast (Protected)
- `POST /api/forecasts` - Create forecast (Protected)
- `PUT /api/forecasts/:id` - Update forecast (Protected)
- `DELETE /api/forecasts/:id` - Delete forecast (Protected)

### Suppliers
- `GET /api/suppliers` - Get all suppliers (Protected)
- `GET /api/suppliers/:id` - Get single supplier (Protected)
- `POST /api/suppliers` - Create supplier (Protected)
- `PUT /api/suppliers/:id` - Update supplier (Protected)
- `DELETE /api/suppliers/:id` - Delete supplier (Protected)

### Reports
- `GET /api/reports` - Get all reports (Protected)
- `GET /api/reports/:id` - Get single report (Protected)
- `POST /api/reports` - Create report (Protected)
- `PUT /api/reports/:id` - Update report (Protected)
- `DELETE /api/reports/:id` - Delete report (Protected)

### Health Check
- `GET /api/health` - Server health check

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Database Models

- **User** - User accounts with authentication
- **Material** - Inventory materials
- **Supplier** - Supplier information
- **Forecast** - Demand forecasting data
- **Report** - Generated reports

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Helmet security headers
- Input validation
- Error handling middleware

## Development

The backend uses:
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

## Notes

- Make sure MongoDB is running before starting the server
- Update `.env` file with your MongoDB connection string
- Change `JWT_SECRET` to a secure random string in production
- All timestamps are automatically managed by Mongoose

