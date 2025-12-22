# SupplySenseAI System Architecture

## Overview

SupplySenseAI is a comprehensive supply chain intelligence platform that integrates machine learning capabilities with modern web technologies to provide accurate demand forecasting, inventory optimization, and supplier management.

## Architecture Principles

### Design Principles
- **Microservices Architecture**: Separated concerns with independent services
- **RESTful APIs**: Standardized API design with clear resource identification
- **Scalable Design**: Horizontal scaling capability for high load scenarios
- **Security First**: Comprehensive security measures at all layers
- **Modular Components**: Loosely coupled components for maintainability

### Technology Stack

#### Frontend Layer
- **React.js 19.2.0**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Tailwind CSS 4.1.17**: Utility-first CSS framework
- **React Router DOM 7.10.1**: Client-side routing
- **Chart.js 4.5.1**: Data visualization library
- **Axios 1.13.2**: HTTP client for API communication

#### Backend Layer
- **Node.js 18+**: JavaScript runtime environment
- **Express.js 5.2.1**: Web application framework
- **MongoDB 9.0.1**: NoSQL document database
- **Mongoose**: MongoDB object modeling
- **JWT 9.0.3**: JSON Web Token authentication
- **bcryptjs 3.0.3**: Password hashing

#### Machine Learning Layer
- **Python 3.x**: Programming language for ML
- **Flask**: Lightweight web framework
- **scikit-learn**: Machine learning library
- **pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing

#### Infrastructure
- **Docker**: Containerization platform
- **Nginx**: Web server and reverse proxy
- **PM2**: Process manager for Node.js
- **MongoDB Atlas**: Cloud database service

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                                  │
│  ┌─────────────────┬─────────────────┬─────────────────┐       │
│  │   Web Browser   │   Mobile App    │   API Clients   │       │
│  │   (React SPA)   │   (Future)      │   (Postman)     │       │
│  └─────────────────┴─────────────────┴─────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                             │
│  ┌─────────────────────────────────────────────────────┐       │
│  │               NGINX Reverse Proxy                   │       │
│  │  • Load Balancing                                  │       │
│  │  • SSL Termination                                 │       │
│  │  • Rate Limiting                                   │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                               │
│  ┌─────────────────┬─────────────────┬─────────────────┐       │
│  │   Frontend      │   Backend API   │   ML Service    │       │
│  │   (React)       │   (Node.js)     │   (Python)      │       │
│  │                 │                 │                 │       │
│  │  • Components   │  • Controllers  │  • Models       │       │
│  │  • Routing      │  • Middleware   │  • Predictions  │       │
│  │  • State Mgmt   │  • Validation   │  • Analytics    │       │
│  └─────────────────┴─────────────────┴─────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                     │
│  ┌─────────────────┬─────────────────┬─────────────────┐       │
│  │   MongoDB       │   Redis Cache   │   File Storage  │       │
│  │   Database      │   (Optional)    │   (AWS S3)      │       │
│  │                 │                 │                 │       │
│  │  • Users        │  • Sessions     │  • CSV Files    │       │
│  │  • Materials    │  • API Cache    │  • Reports      │       │
│  │  • Forecasts    │  • ML Models    │  • Backups      │       │
│  └─────────────────┴─────────────────┴─────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                            │
│  ┌─────────────────┬─────────────────┬─────────────────┐       │
│  │   Docker        │   Kubernetes    │   Cloud Services│       │
│  │   Containers    │   Orchestration │   (AWS/GCP)     │       │
│  │                 │                 │                 │       │
│  │  • Isolation    │  • Scaling      │  • CDN          │       │
│  │  • Portability  │  • HA           │  • Monitoring   │       │
│  └─────────────────┴─────────────────┴─────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture

#### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Modal, etc.)
│   ├── forms/          # Form components
│   └── charts/         # Chart components
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── Materials.jsx
│   ├── Forecasting.jsx
│   └── Settings.jsx
├── layouts/            # Layout components
│   └── AppLayout.jsx
├── utils/              # Utility functions
│   ├── api.js         # API client
│   └── dateUtils.js   # Date formatting
├── hooks/              # Custom React hooks
└── contexts/           # React contexts
```

#### State Management
- **Local State**: React useState/useReducer for component-level state
- **Global State**: React Context API for user authentication and preferences
- **Server State**: React Query (future implementation) for server data caching

### Backend Architecture

#### MVC Pattern Implementation
```
backend/
├── controllers/        # Business logic controllers
│   ├── authController.js
│   ├── materialController.js
│   ├── forecastController.js
│   └── reportController.js
├── models/            # Database models
│   ├── User.js
│   ├── Material.js
│   ├── Forecast.js
│   └── Report.js
├── routes/            # API route definitions
│   ├── authRoutes.js
│   ├── materialRoutes.js
│   └── forecastRoutes.js
├── middleware/        # Custom middleware
│   ├── auth.js        # Authentication middleware
│   └── errorHandler.js # Error handling middleware
├── utils/             # Utility functions
└── config/            # Configuration files
```

#### Request Flow
```
Client Request → Middleware → Route → Controller → Service → Model → Database
                      ↓
                Response ← Controller ← Service ← Model ← Database
```

### Machine Learning Architecture

#### ML Service Structure
```
ml_service/
├── app.py             # Flask application
├── models/            # ML model definitions
├── utils/             # ML utilities
├── requirements.txt   # Python dependencies
└── Dockerfile         # Container configuration
```

#### ML Pipeline
```
Raw Data → Preprocessing → Feature Engineering → Model Training → Prediction → Post-processing
```

## Database Architecture

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  fullName: String,
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  preferences: {
    theme: String,
    language: String,
    dateFormat: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Materials Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  unit: String,
  unitCost: Number,
  stock: Number,
  minStock: Number,
  maxStock: Number,
  supplier: ObjectId (ref: 'Supplier'),
  location: String,
  status: String,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Forecasts Collection
```javascript
{
  _id: ObjectId,
  projectName: String,
  location: String,
  budget: Number,
  materials: [{
    material: ObjectId (ref: 'Material'),
    quantity: Number,
    unit: String,
    unitCost: Number,
    totalCost: Number
  }],
  forecastData: Object,
  totalCost: Number,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Suppliers Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  category: String,
  rating: Number,
  status: String,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Database Relationships
- **Users** ↔ **Materials**: One-to-Many (createdBy)
- **Users** ↔ **Forecasts**: One-to-Many (createdBy)
- **Users** ↔ **Suppliers**: One-to-Many (createdBy)
- **Materials** ↔ **Suppliers**: Many-to-One
- **Forecasts** ↔ **Materials**: Many-to-Many

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: Admin/User permissions
- **Session Management**: Token expiration and refresh

### Security Layers
```
Client → HTTPS → API Gateway → Authentication → Authorization → Business Logic
```

### Security Features
- **CORS Protection**: Configured origins
- **Helmet.js**: Security headers
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Mongoose built-in protection
- **XSS Protection**: Content Security Policy

## Deployment Architecture

### Development Environment
```
Local Development
├── Frontend: Vite dev server (port 5173)
├── Backend: Node.js server (port 5000)
├── ML Service: Flask server (port 5001)
└── Database: Local MongoDB (port 27017)
```

### Production Environment
```
Docker Containers
├── Frontend: Nginx serving static files
├── Backend: Node.js application
├── ML Service: Python Flask application
└── Database: MongoDB Atlas

Load Balancer (Nginx)
├── SSL Termination
├── Request Routing
└── Rate Limiting
```

### CI/CD Pipeline
```
Git Push → Build → Test → Docker Build → Deploy → Monitor
```

## Performance Architecture

### Caching Strategy
- **Browser Caching**: Static assets caching
- **API Response Caching**: Redis for frequently accessed data
- **Database Query Caching**: MongoDB indexing

### Optimization Techniques
- **Database Indexing**: Optimized queries
- **Lazy Loading**: Frontend component loading
- **Image Optimization**: Compressed assets
- **CDN**: Static asset delivery

### Scalability Features
- **Horizontal Scaling**: Multiple application instances
- **Database Sharding**: Distributed data storage
- **Microservices**: Independent service scaling
- **Load Balancing**: Request distribution

## Monitoring and Logging

### Application Monitoring
- **Health Checks**: `/api/health` endpoint
- **Performance Metrics**: Response times, error rates
- **Resource Usage**: CPU, memory, disk usage

### Logging Strategy
- **Application Logs**: Winston logging library
- **Error Tracking**: Centralized error logging
- **Audit Logs**: User action tracking

### Alerting
- **Threshold Alerts**: Performance degradation
- **Error Alerts**: System failures
- **Security Alerts**: Suspicious activities

## Future Architecture Considerations

### Planned Enhancements
1. **Microservices Migration**: Break down monolithic backend
2. **Event-Driven Architecture**: Implement message queues
3. **GraphQL API**: Flexible data fetching
4. **Real-time Features**: WebSocket implementation
5. **Advanced ML**: Deep learning models integration

### Scalability Roadmap
1. **Phase 1**: Optimize current architecture
2. **Phase 2**: Implement microservices
3. **Phase 3**: Add event-driven capabilities
4. **Phase 4**: Global deployment with multi-region support

This architecture provides a solid foundation for SupplySenseAI while allowing for future growth and enhancement.