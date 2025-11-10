const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { testConnection, healthCheck: dbHealthCheck } = require('./config/database');
const { testConnection: testRedis, healthCheck: redisHealthCheck } = require('./config/redis');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbHealth = await dbHealthCheck();
  const redisHealth = await redisHealthCheck();
  
  const isHealthy = dbHealth.healthy && redisHealth.healthy;
  
  res.json({
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: dbHealth.status,
    redis: redisHealth.status,
  });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
// app.use('/api/payment', require('./routes/payment'));

// Import error handlers
const { notFound, errorHandler } = require('./middleware/errorHandler');

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

if (require.main === module) {
  // Test database and Redis connections before starting server
  Promise.all([testConnection(), testRedis()])
    .then(() => {
      app.listen(PORT, HOST, () => {
        console.log(`🚀 Server running on http://${HOST}:${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
      });
    })
    .catch((error) => {
      console.error('❌ Failed to start server:', error.message);
      console.error('💡 Make sure MySQL and Redis are running');
      process.exit(1);
    });
}

module.exports = app;
