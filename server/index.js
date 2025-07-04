const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const flightRoutes = require('./routes/flights');
const hotelRoutes = require('./routes/hotels');
const tourRoutes = require('./routes/tours');
const transferRoutes = require('./routes/transfers');
const paymentRoutes = require('./routes/payments');
const { router: authRoutes } = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const aiRoutes = require('./routes/ai');
const currencyRoutes = require('./routes/currency');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware - must be first, before any other middleware
app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:3000',
    'https://hopeful-harmony.railway.app',
    /\.netlify\.app$/,
    /\.netlify\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/currency', currencyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const requiredEnv = [
  'TRAVELPAYOUTS_API_KEY',
  'PAYSTACK_SECRET_KEY',
  'OPENAI_API_KEY',
  'AVIATIONSTACK_API_KEY',
  'EMAIL_USER',
  'EMAIL_PASS',
];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.warn('Warning: Missing environment variables:', missingEnv.join(', '));
}

app.listen(PORT, () => {
  console.log(`🚀 Flyeasy Backend Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});