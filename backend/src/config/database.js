const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Parse DATABASE_URL if provided (Railway/Render format)
 * Format: mysql://user:password@host:port/database
 */
const parseDatabaseUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: parseInt(urlObj.port, 10) || 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1), // Remove leading slash
    };
  } catch (error) {
    console.error('Failed to parse DATABASE_URL:', error.message);
    return null;
  }
};

// Database configuration
// Priority: DATABASE_URL (Railway/Render) > Individual env vars
const parsedUrl = parseDatabaseUrl(process.env.DATABASE_URL);
const dbConfig = parsedUrl || {
  host: process.env.DB_HOST || '127.0.0.1', // Use 127.0.0.1 instead of localhost to force IPv4
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'ace1_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ace1_development',
};

// Add connection pool settings
Object.assign(dbConfig, {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Create connection pool
let pool = null;

/**
 * Get database connection pool
 * @returns {Promise<mysql.Pool>} Database connection pool
 */
const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    console.log('✅ Database connection pool created');
  }
  return pool;
};

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
const testConnection = async () => {
  try {
    const connection = await getPool().getConnection();
    console.log('✅ Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Execute a query with parameters
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
const query = async (sql, params = []) => {
  try {
    const [results] = await getPool().execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

/**
 * Execute a transaction
 * @param {Function} callback - Transaction callback function
 * @returns {Promise<any>} Transaction result
 */
const transaction = async (callback) => {
  const connection = await getPool().getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Close database connection pool
 * @returns {Promise<void>}
 */
const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ Database connection pool closed');
  }
};

/**
 * Health check for database
 * @returns {Promise<Object>} Health status
 */
const healthCheck = async () => {
  try {
    const connection = await getPool().getConnection();
    const [rows] = await connection.execute('SELECT 1 as health');
    connection.release();
    
    return {
      status: 'connected',
      healthy: rows[0].health === 1,
    };
  } catch (error) {
    return {
      status: 'disconnected',
      healthy: false,
      error: error.message,
    };
  }
};

module.exports = {
  getPool,
  testConnection,
  query,
  transaction,
  closePool,
  healthCheck,
  dbConfig,
};
