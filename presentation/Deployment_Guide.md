# SupplySenseAI Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying SupplySenseAI in various environments including development, staging, and production.

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **Python**: Version 3.8 or higher
- **MongoDB**: Version 5.0 or higher (or MongoDB Atlas)
- **Docker**: Version 20.10 or higher (optional)
- **Git**: Version 2.0 or higher

### Hardware Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **CPU**: 2 cores minimum, 4 cores recommended
- **Storage**: 10GB free space
- **Network**: Stable internet connection

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/supplysenseai.git
cd supplysenseai
```

### 2. Environment Configuration

#### Backend Environment Variables
Create `.env` file in the `backend` directory:

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

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# ML Service Configuration
ML_SERVICE_URL=http://localhost:5001
```

#### Frontend Environment Variables
Create `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SupplySenseAI
VITE_APP_VERSION=1.0.0
```

#### ML Service Environment Variables
Create `.env` file in the `ml_service` directory:

```env
FLASK_ENV=development
FLASK_APP=app.py
PORT=5001
```

## Development Deployment

### Method 1: Manual Setup

#### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

**ML Service:**
```bash
cd ../ml_service
pip install -r requirements.txt
```

#### 2. Start MongoDB
```bash
# Using local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - ML Service:**
```bash
cd ml_service
python app.py
```

#### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- ML Service: http://localhost:5001

### Method 2: Docker Compose (Recommended)

#### 1. Create docker-compose.yml
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

#### 2. Create Dockerfiles

**backend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```

**ml_service/Dockerfile:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["python", "app.py"]
```

#### 3. Start Services
```bash
docker-compose up -d
```

## Production Deployment

### 1. Production Environment Setup

#### Environment Variables for Production
```env
# Production Backend .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/supplysenseai
JWT_SECRET=your_production_jwt_secret_key_minimum_32_characters
JWT_EXPIRE=24h
FRONTEND_URL=https://yourdomain.com
ML_SERVICE_URL=http://ml-service:5001
```

#### SSL Configuration
```nginx
# nginx.conf for SSL termination
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Production Docker Deployment

#### Production Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    restart: always
    environment:
      MONGO_INITDB_DATABASE: supplysenseai
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secure_password
    volumes:
      - mongodb_data:/data/db
    networks:
      - supplysenseai

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: always
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:secure_password@mongodb:27017/supplysenseai
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=https://yourdomain.com
    depends_on:
      - mongodb
    networks:
      - supplysenseai

  ml-service:
    build:
      context: ./ml_service
      dockerfile: Dockerfile.prod
    restart: always
    environment:
      - FLASK_ENV=production
    networks:
      - supplysenseai

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: always
    environment:
      - VITE_API_URL=https://yourdomain.com/api
    networks:
      - supplysenseai

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - supplysenseai

volumes:
  mongodb_data:

networks:
  supplysenseai:
    driver: bridge
```

#### Production Dockerfiles

**backend/Dockerfile.prod:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy source code
COPY --chown=nextjs:nodejs . .

USER nextjs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["npm", "start"]
```

**frontend/Dockerfile.prod:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. Cloud Deployment Options

#### AWS Deployment
```bash
# Using AWS ECS
aws ecs create-cluster --cluster-name supplysenseai

# Deploy using AWS Fargate
aws ecs run-task \
  --cluster supplysenseai \
  --task-definition supplysenseai-task \
  --launch-type FARGATE
```

#### Heroku Deployment
```bash
# Backend deployment
heroku create supplysenseai-backend
heroku config:set NODE_ENV=production
git push heroku main

# Frontend deployment (as static site)
heroku create supplysenseai-frontend --buildpack heroku/static
```

#### Vercel Deployment (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

## Database Setup

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create new cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string

### Database Initialization
```javascript
// Run in MongoDB shell or create seed script
use supplysenseai;

// Create collections
db.createCollection("users");
db.createCollection("materials");
db.createCollection("suppliers");
db.createCollection("forecasts");
db.createCollection("reports");

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.materials.createIndex({ "name": 1 });
db.materials.createIndex({ "category": 1 });
db.forecasts.createIndex({ "createdBy": 1 });
```

## Monitoring and Maintenance

### Health Checks
```bash
# API Health Check
curl https://yourdomain.com/api/health

# ML Service Health Check
curl http://localhost:5001/health
```

### Log Monitoring
```bash
# View application logs
docker-compose logs -f backend

# View ML service logs
docker-compose logs -f ml-service
```

### Backup Strategy
```bash
# Database backup
mongodump --db supplysenseai --out /backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db supplysenseai --out /backup/supplysenseai_$DATE
find /backup -name "supplysenseai_*" -mtime +7 -delete
```

### Performance Monitoring
```bash
# Install PM2 for production
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Monitor performance
pm2 monit
```

## Security Configuration

### SSL/TLS Setup
```bash
# Generate SSL certificate
certbot certonly --webroot -w /var/www/html -d yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

### Firewall Configuration
```bash
# UFW firewall rules
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Environment Security
```bash
# Secure environment variables
chmod 600 .env
export JWT_SECRET=$(openssl rand -hex 32)

# Rotate secrets regularly
# Use secret management services (AWS Secrets Manager, etc.)
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MongoDB status
docker ps | grep mongodb

# Test connection
mongo mongodb://localhost:27017/supplysenseai
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :5000

# Kill process using port
kill -9 $(lsof -t -i:5000)
```

#### Memory Issues
```bash
# Check memory usage
docker stats

# Increase Docker memory limit
# Docker Desktop: Preferences > Resources > Memory
```

#### Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## Scaling Considerations

### Horizontal Scaling
```yaml
# Multiple backend instances
services:
  backend:
    scale: 3
    # Load balancer will distribute requests
```

### Database Scaling
- Implement read replicas
- Use database sharding
- Implement connection pooling

### CDN Integration
```javascript
// CloudFront distribution for static assets
const AWS = require('aws-sdk');
const cloudfront = new AWS.CloudFront();
```

## Backup and Recovery

### Automated Backups
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
mongodump --db supplysenseai --out $BACKUP_DIR/db_$DATE

# Application backup
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /app

# Retention policy (keep last 30 days)
find $BACKUP_DIR -name "db_*" -mtime +30 -delete
find $BACKUP_DIR -name "app_*" -mtime +30 -delete
```

### Disaster Recovery
1. **Regular Backups**: Daily automated backups
2. **Off-site Storage**: Cloud storage for backups
3. **Recovery Testing**: Monthly recovery drills
4. **Failover Setup**: Multi-region deployment

This deployment guide ensures reliable and scalable deployment of SupplySenseAI across different environments.