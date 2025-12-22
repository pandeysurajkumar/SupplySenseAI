# SupplySenseAI - AI-Powered Supply Chain Intelligence System

## 🚀 Overview

SupplySenseAI is a comprehensive supply chain intelligence platform that combines machine learning with modern web technologies to provide accurate demand forecasting, intelligent inventory management, and comprehensive supplier relationship management. The system helps industries minimize shortages, reduce costs, and streamline supply chain operations.

## ✨ Key Features

### 🔐 Authentication & User Management
- JWT-based secure authentication
- Role-based access control (Admin/User)
- Password change functionality
- User profile management

### 📦 Material Inventory Management
- Complete CRUD operations for materials
- Stock level monitoring (Min/Max thresholds)
- Category-based organization
- Supplier linkage and tracking
- Real-time inventory status updates

### 🏢 Supplier Relationship Management
- Supplier database management
- Performance rating system
- Contact information tracking
- Procurement history

### 🤖 AI-Powered Demand Forecasting
- Machine learning-based demand prediction
- Random Forest regression models
- Historical data analysis
- CSV data import for bulk forecasting
- Multi-material forecasting support
- Budget and project-based adjustments

### 📊 Inventory Optimization
- Safety stock calculations
- Reorder point recommendations
- Economic Order Quantity (EOQ) analysis
- Automated optimization suggestions
- Real-time inventory alerts

### 📈 Analytics & Reporting
- Comprehensive dashboard with KPIs
- Interactive charts and visualizations
- Custom report generation
- Export functionality (CSV, PDF)
- Performance analytics

### 🎨 Modern User Interface
- Responsive design for all devices
- Dark/Light theme support
- Intuitive navigation and workflows
- Real-time data updates
- Mobile-friendly interface

## 🛠 Technology Stack

### Frontend
- **React.js 19.2.0** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **React Router DOM 7.10.1** - Client-side routing
- **Chart.js 4.5.1** - Data visualization library
- **Axios 1.13.2** - HTTP client for API communication

### Backend
- **Node.js 18+** - JavaScript runtime environment
- **Express.js 5.2.1** - Web application framework
- **MongoDB 9.0.1** - NoSQL document database
- **Mongoose** - MongoDB object modeling
- **JWT 9.0.3** - JSON Web Token authentication
- **bcryptjs 3.0.3** - Password hashing

### Machine Learning Service
- **Python 3.8+** - Programming language for ML
- **Flask** - Lightweight web framework
- **scikit-learn** - Machine learning library
- **pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing

### Infrastructure
- **Docker** - Containerization platform
- **PM2** - Process manager for production
- **Nginx** - Web server and reverse proxy

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

### Required Software
- **Node.js** (version 18.0 or higher) - [Download](https://nodejs.org/)
- **Python** (version 3.8 or higher) - [Download](https://python.org/)
- **MongoDB** (version 5.0 or higher) - [Download](https://mongodb.com/) or use MongoDB Atlas
- **Git** (version 2.0 or higher) - [Download](https://git-scm.com/)

### Optional but Recommended
- **Docker** (version 20.10 or higher) - [Download](https://docker.com/)
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)
- **Postman** - For API testing [Download](https://postman.com/)

### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **CPU**: 2 cores minimum, 4 cores recommended
- **Storage**: 10GB free space
- **Operating System**: Windows 10/11, macOS, or Linux

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/supplysenseai.git
cd supplysenseai
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/supplysenseai

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# ML Service Configuration
ML_SERVICE_URL=http://localhost:5001
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Environment Configuration
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SupplySenseAI
VITE_APP_VERSION=1.0.0
```

### 4. Machine Learning Service Setup

#### Install Dependencies
```bash
cd ../ml_service
pip install -r requirements.txt
```

#### Python Requirements File
```txt
Flask==2.3.3
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
python-dotenv==1.0.0
```

## 🎯 Running the Project

### Method 1: Manual Setup (Recommended for Development)

#### 1. Start MongoDB
```bash
# Using local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### 2. Start Backend Server
```bash
cd backend
npm run dev
```
Server will run on: `http://localhost:5000`

#### 3. Start ML Service
```bash
cd ml_service
python app.py
```
Service will run on: `http://localhost:5001`

#### 4. Start Frontend
```bash
cd frontend
npm run dev
```
Application will be available at: `http://localhost:5173`

### Method 2: Docker Compose (Production-Ready)

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: supplysenseai
    volumes:
      - mongodb_data:/data/db

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/supplysenseai
      - JWT_SECRET=your_jwt_secret
      - FRONTEND_URL=http://localhost:5173
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app
      - /app/node_modules

  ml-service:
    build:
      context: ./ml_service
      dockerfile: Dockerfile
    ports:
      - "5001:5001"
    environment:
      - FLASK_ENV=development
    volumes:
      - ./ml_service:/app

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  mongodb_data:
```

#### Start All Services
```bash
docker-compose up -d
```

## 📁 Project Structure

```
SupplySenseAI/
├── backend/                    # Node.js Backend API
│   ├── config/                # Configuration files
│   │   ├── database.js        # MongoDB connection
│   │   └── jwt.js            # JWT configuration
│   ├── controllers/           # Business logic controllers
│   │   ├── authController.js
│   │   ├── materialController.js
│   │   ├── forecastController.js
│   │   └── reportController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # Authentication middleware
│   │   └── errorHandler.js   # Error handling
│   ├── models/               # Database models
│   │   ├── User.js
│   │   ├── Material.js
│   │   ├── Forecast.js
│   │   └── Report.js
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── server.js             # Main server file
│   └── package.json
├── frontend/                  # React Frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── layouts/         # Layout components
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   └── package.json
├── ml_service/               # Python ML Service
│   ├── app.py               # Flask application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile
├── presentation/            # Documentation
│   ├── SupplySenseAI_Project_Report.docx
│   ├── API_Documentation.md
│   ├── System_Architecture.md
│   ├── Deployment_Guide.md
│   └── ML_Models_Documentation.md
├── csv_template_example.csv # Sample data file
├── package.json             # Root package.json
└── README.md               # This file
```

## 🔗 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Materials Management
- `GET /api/materials` - Get all materials
- `POST /api/materials` - Create material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Forecasting
- `POST /api/forecasts/generate` - Generate forecast
- `GET /api/forecasts` - Get all forecasts
- `DELETE /api/forecasts/:id` - Delete forecast

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier

### Reports & Analytics
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Generate report

### Health Check
- `GET /api/health` - Server health check

## 🔧 Available Scripts

### Backend Scripts
```bash
cd backend
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Frontend Scripts
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### ML Service Scripts
```bash
cd ml_service
python app.py    # Start Flask development server
```

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use
- Run `npm install` to ensure dependencies are installed

#### Frontend Won't Load
- Ensure backend is running on port 5000
- Check `.env` file has correct `VITE_API_URL`
- Clear browser cache and cookies
- Try `npm run dev` in frontend directory

#### ML Service Errors
- Verify Python 3.8+ is installed
- Check if all requirements are installed: `pip install -r requirements.txt`
- Ensure port 5001 is available
- Check Flask app is running: `python app.py`

#### Database Connection Issues
- Verify MongoDB is running on port 27017
- Check `MONGODB_URI` in backend `.env`
- For MongoDB Atlas, ensure IP whitelist includes your IP
- Test connection: `mongo mongodb://localhost:27017/supplysenseai`

#### Port Conflicts
```bash
# Check what's using a port
netstat -ano | findstr :5000

# Kill process using port
taskkill /PID <PID> /F
```

### Performance Issues
- Close unnecessary applications
- Ensure at least 4GB RAM available
- Clear browser cache
- Restart all services

### Build Issues
```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Docker issues
docker system prune -a
docker-compose down
docker-compose up --build
```

## 📞 Getting Help

### Documentation
- **API Documentation**: `presentation/API_Documentation.md`
- **System Architecture**: `presentation/System_Architecture.md`
- **Deployment Guide**: `presentation/Deployment_Guide.md`
- **ML Documentation**: `presentation/ML_Models_Documentation.md`

### Support
- Check the troubleshooting section above
- Review the documentation files
- Check GitHub issues for similar problems
- Verify all prerequisites are met

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React.js, Node.js, and Python communities
- Open source libraries and frameworks used
- Academic and research contributions in supply chain management

---

**SupplySenseAI** - Transforming Supply Chain Management with AI 🚀

