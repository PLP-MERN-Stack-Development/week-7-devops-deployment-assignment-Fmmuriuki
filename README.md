# 🚀 MERN Stack Deployment Project

**Author:** Felix M Muriithi  
**Project:** Week 7 DevOps Deployment Assignment

A full-stack MERN (MongoDB, Express.js, React, Node.js) application with comprehensive DevOps deployment setup, CI/CD pipelines, and monitoring.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring](#monitoring)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## ✨ Features

### Backend Features
- **RESTful API** with Express.js
- **User Authentication** with JWT tokens
- **Role-based Access Control** (User/Admin)
- **MongoDB Integration** with Mongoose ODM
- **Input Validation** with express-validator
- **Security Headers** with Helmet
- **Rate Limiting** for API protection
- **Compression** for better performance
- **Comprehensive Error Handling**
- **Health Check Endpoints**
- **Logging** with Morgan

### Frontend Features
- **Modern React** with Hooks and Context
- **Responsive Design** with Tailwind CSS
- **Form Validation** with React Hook Form
- **State Management** with React Query
- **Authentication Flow** with Protected Routes
- **Real-time Notifications** with React Hot Toast
- **Code Splitting** for better performance
- **Progressive Web App** ready

### DevOps Features
- **GitHub Actions** CI/CD pipelines
- **Automated Testing** and linting
- **Security Audits** and vulnerability scanning
- **Multi-environment** deployment
- **Health Monitoring** and uptime checks
- **Automated Builds** and deployments

## 🛠️ Tech Stack

### Backend
- **Node.js** (v18+)
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Jest** - Testing framework

### Frontend
- **React** (v18)
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

### DevOps & Deployment
- **GitHub Actions** - CI/CD
- **Render** - Backend hosting
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Cloud database
- **Docker** - Containerization (optional)

## 📁 Project Structure

```
week-7-devops-deployment-assignment-Fmmuriuki/
├── backend/                    # Express.js backend
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── middleware/            # Custom middleware
│   ├── tests/                 # Test files
│   ├── package.json
│   └── server.js
├── frontend/                  # React frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── .github/                  # GitHub Actions workflows
│   └── workflows/
├── deployment/               # Deployment configs
├── monitoring/              # Health check scripts
├── env.example             # Environment variables template
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd week-7-devops-deployment-assignment-Fmmuriuki
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mern-app
MONGODB_URI_TEST=mongodb://localhost:27017/mern-app-test

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# API URL for frontend
REACT_APP_API_URL=http://localhost:5000/api
```

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select the backend directory
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`

3. **Configure Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-production-jwt-secret
   FRONTEND_URL=https://your-frontend-domain.com
   ```

### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)

2. **Import Project**
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Configure build settings

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

### Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)

2. **Create Cluster**
   - Choose free tier
   - Select your preferred region

3. **Configure Database Access**
   - Create database user
   - Set up IP whitelist

4. **Get Connection String**
   - Copy the connection string
   - Replace `<password>` with your user password

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

The project includes several automated workflows:

1. **Backend CI** (`.github/workflows/backend-ci.yml`)
   - Runs on backend changes
   - Tests with multiple Node.js versions
   - Security audits
   - Uploads test results

2. **Frontend CI** (`.github/workflows/frontend-ci.yml`)
   - Runs on frontend changes
   - Linting and testing
   - Build verification
   - Security audits

3. **Backend Deployment** (`.github/workflows/deploy-backend.yml`)
   - Deploys to Render on main branch
   - Health checks after deployment
   - Automatic rollback on failure

4. **Frontend Deployment** (`.github/workflows/deploy-frontend.yml`)
   - Deploys to Vercel on main branch
   - Build optimization
   - Health checks

### Required Secrets

Add these secrets to your GitHub repository:

```
RENDER_TOKEN=your-render-api-token
RENDER_SERVICE_ID=your-render-service-id
VERCEL_TOKEN=your-vercel-api-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
REACT_APP_API_URL=https://your-backend-url.com/api
FRONTEND_URL=https://your-frontend-url.com
BACKEND_URL=https://your-backend-url.com
```

## 📊 Monitoring

### Health Checks

The application includes comprehensive health monitoring:

- **Backend Health Endpoint**: `GET /api/health`
- **Database Connection Check**
- **Uptime Monitoring**
- **Error Tracking**

### Monitoring Script

Use the included health check script:

```bash
node monitoring/health-check.js
```

### Performance Monitoring

- **Server Response Times**
- **Database Query Performance**
- **Frontend Load Times**
- **Error Rate Tracking**

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/logout` | Logout user |

### Posts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like/unlike post |
| POST | `/api/posts/:id/comments` | Add comment |

### Users Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (admin) |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user (admin) |

### Health Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## 🔧 Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# All tests
npm run test
```

### Code Quality

```bash
# Lint backend
cd backend
npm run lint

# Lint frontend
cd frontend
npm run lint
```

### Database Management

```bash
# Connect to MongoDB
mongosh

# Use database
use mern-app

# View collections
show collections
```

## 🚀 Production Checklist

Before deploying to production:

- [ ] Update environment variables
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure CORS origins
- [ ] Set up SSL certificates
- [ ] Configure monitoring
- [ ] Set up backups
- [ ] Test all endpoints
- [ ] Verify security headers
- [ ] Check performance
- [ ] Set up error tracking

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Felix M Muriithi**

- GitHub: [@Fmmuriuki](https://github.com/Fmmuriuki)
- Email: felix.muriithi@example.com

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- React team for the amazing frontend library
- MongoDB team for the powerful database
- Render and Vercel for hosting services
- GitHub for CI/CD platform

---

**Note:** This project was created as part of the Week 7 DevOps Deployment Assignment. All deployment configurations, CI/CD pipelines, and monitoring setups are production-ready and follow industry best practices. 