# SupplySenseAI API Documentation

## Overview

SupplySenseAI provides a comprehensive REST API for supply chain intelligence operations. The API follows RESTful conventions and uses JSON for data exchange.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All API requests require authentication using JWT tokens in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "password123",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "admin"
  }
}
```

#### Change Password
```http
PUT /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```

## Materials Management

### Get All Materials
```http
GET /materials
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of items per page (default: 10)
- `search` (string): Search term for material name or description
- `category` (string): Filter by category
- `status` (string): Filter by status (active, inactive, discontinued)

**Response:**
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "totalCount": 25
  },
  "data": [
    {
      "_id": "material_id",
      "name": "Steel Rod",
      "description": "High-quality steel rods for construction",
      "category": "Raw Materials",
      "unit": "kg",
      "unitCost": 50.00,
      "stock": 1000,
      "minStock": 100,
      "maxStock": 5000,
      "supplier": {
        "_id": "supplier_id",
        "name": "Steel Corp",
        "email": "contact@steelcorp.com"
      },
      "location": "Warehouse A",
      "status": "active",
      "createdBy": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Material
```http
GET /materials/:id
Authorization: Bearer <token>
```

### Create Material
```http
POST /materials
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Copper Wire",
  "description": "Insulated copper wire for electrical applications",
  "category": "Electrical Materials",
  "unit": "meters",
  "unitCost": 25.50,
  "stock": 500,
  "minStock": 50,
  "maxStock": 2000,
  "supplier": "supplier_id",
  "location": "Warehouse B"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "material_id",
    "name": "Copper Wire",
    "description": "Insulated copper wire for electrical applications",
    "category": "Electrical Materials",
    "unit": "meters",
    "unitCost": 25.50,
    "stock": 500,
    "minStock": 50,
    "maxStock": 2000,
    "supplier": "supplier_id",
    "location": "Warehouse B",
    "status": "active",
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Material
```http
PUT /materials/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "stock": 450,
  "unitCost": 26.00
}
```

### Delete Material
```http
DELETE /materials/:id
Authorization: Bearer <token>
```

## Supplier Management

### Get All Suppliers
```http
GET /suppliers
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "supplier_id",
      "name": "Steel Corp",
      "email": "contact@steelcorp.com",
      "phone": "+1-555-0123",
      "address": "123 Industrial Blvd, Steel City, SC 12345",
      "category": "Raw Materials",
      "rating": 4.5,
      "status": "active",
      "createdBy": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Supplier
```http
POST /suppliers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Global Materials Ltd",
  "email": "procurement@globalmaterials.com",
  "phone": "+1-555-0456",
  "address": "456 Commerce St, Material City, MC 67890",
  "category": "Raw Materials"
}
```

### Update Supplier
```http
PUT /suppliers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4.8,
  "status": "active"
}
```

## Forecasting

### Generate Forecast
```http
POST /forecasts/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectName": "Transmission Line Project Phase 2",
  "location": "Southern Region",
  "budget": 15000000,
  "towerType": "Distribution Tower",
  "substationType": "Primary Substation",
  "materials": [
    {
      "material": "material_id_1",
      "quantity": 1000
    },
    {
      "material": "material_id_2",
      "quantity": 500
    }
  ],
  "historicalData": [
    {
      "material_name": "Steel Rod",
      "date": "2023-01-01",
      "quantity": 450,
      "unit": "kg"
    },
    {
      "material_name": "Steel Rod",
      "date": "2023-02-01",
      "quantity": 520,
      "unit": "kg"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "forecast_id",
    "projectName": "Transmission Line Project Phase 2",
    "location": "Southern Region",
    "budget": 15000000,
    "forecastData": {
      "Steel Rod": {
        "chartLabels": ["Jan 2024", "Feb 2024", "Mar 2024"],
        "chartData": [480, 510, 495],
        "optimization_metrics": {
          "safety_stock": 45,
          "reorder_point": 525,
          "average_monthly_demand": 495
        }
      }
    },
    "totalCost": 75000,
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Forecasts
```http
GET /forecasts
Authorization: Bearer <token>
```

### Get Single Forecast
```http
GET /forecasts/:id
Authorization: Bearer <token>
```

### Delete Forecast
```http
DELETE /forecasts/:id
Authorization: Bearer <token>
```

## Reports

### Get All Reports
```http
GET /reports
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "report_id",
      "title": "Monthly Inventory Report",
      "type": "inventory",
      "status": "completed",
      "data": {
        "totalMaterials": 25,
        "lowStockItems": 3,
        "totalValue": 125000,
        "generatedAt": "2024-01-01T00:00:00.000Z"
      },
      "createdBy": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Generate Report
```http
POST /reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Q4 Inventory Analysis",
  "type": "inventory",
  "description": "Quarterly inventory analysis report"
}
```

### Get Report by ID
```http
GET /reports/:id
Authorization: Bearer <token>
```

### Delete Report
```http
DELETE /reports/:id
Authorization: Bearer <token>
```

## Inventory Optimization

### Get Optimization Data
```http
GET /inventory/optimization
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "_id": "material_id",
        "name": "Steel Rod",
        "currentStock": 1000,
        "minStock": 100,
        "maxStock": 5000,
        "forecastedDemand": 480,
        "recommendedOrder": 380,
        "supplier": "Steel Corp"
      }
    ],
    "activeForecasts": 2,
    "totalOptimizationValue": 250000
  }
}
```

## Error Responses

All API errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development mode)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes for authenticated users
- 10 requests per 15 minutes for unauthenticated users

## Data Formats

### Date Format
All dates are returned in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

### Currency
All monetary values are in the system's base currency (typically INR or USD) and represented as numbers with 2 decimal places.

### Pagination
List endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

## WebSocket Support

Real-time updates are available via WebSocket connection:

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});

// Listen for inventory updates
socket.on('inventory-update', (data) => {
  console.log('Inventory updated:', data);
});

// Listen for forecast completion
socket.on('forecast-complete', (data) => {
  console.log('Forecast completed:', data);
});
```

## File Upload

File uploads (for CSV data import) use multipart/form-data:

```http
POST /forecasts/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: historical_data.csv
```

## Versioning

The API uses URL versioning. Current version is v1:
```
http://localhost:5000/api/v1/
```

For backward compatibility, unversioned endpoints are also available but deprecated.