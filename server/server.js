const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const documentRoutes = require('./routes/documentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Root and API Base Endpoints
const apiInfo = {
  name: 'BIT DNY Admission Portal API',
  version: '1.0.0',
  status: 'Online',
  message: 'Backend server is running. Access API endpoints below or view the React frontend on port 5173.',
  endpoints: {
    health: 'GET /api/health',
    auth: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      currentUser: 'GET /api/auth/me'
    },
    students: 'GET/PUT /api/students/profile',
    admissions: {
      submit: 'POST /api/admissions',
      myApplication: 'GET /api/admissions/my-application'
    },
    documents: {
      upload: 'POST /api/documents/upload',
      myDocuments: 'GET /api/documents/my-documents',
      delete: 'DELETE /api/documents/:id'
    },
    admin: '/api/admin',
    superadmin: '/api/superadmin',
    notifications: '/api/notifications'
  },
  frontendUrl: 'http://localhost:5173'
};

app.get('/', (req, res) => {
  res.json(apiInfo);
});

app.get('/api', (req, res) => {
  res.json(apiInfo);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'BIT DNY Admission Backend Server is running smoothly',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 Catch-all handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    help: 'Visit GET /api or GET /api/health for available endpoints.'
  });
});

// Global Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect DB & start server
connectDB().then(async () => {
  // Check if database needs initial auto-seed
  const User = require('./models/User');
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Database is empty. Running initial database seeder...');
    const seedData = require('./utils/seed');
    await seedData();
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 BIT DNY Admission Server running on port ${PORT}`);
    console.log(`📍 REST API URL: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
