const redis = require('redis');
require('dotenv').config();

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
};

// Create Redis client
let client = null;

/**
 * Get Redis client
 * @returns {redis.RedisClientType} Redis client
 */
const getClient = () => {
  if (!client) {
    client = redis.createClient(redisConfig);

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('✅ Redis connected');
    });

    client.on('ready', () => {
      console.log('✅ Redis ready');
    });

    client.on('end', () => {
      console.log('❌ Redis connection closed');
    });
  }

  return client;
};

/**
 * Connect to Redis
 * @returns {Promise<void>}
 */
const connect = async () => {
  const redisClient = getClient();
  
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  
  return redisClient;
};

/**
 * Test Redis connection
 * @returns {Promise<boolean>} True if connection successful
 */
const testConnection = async () => {
  try {
    const redisClient = await connect();
    await redisClient.ping();
    console.log('✅ Redis connection successful');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    throw error;
  }
};

/**
 * Set value in Redis
 * @param {string} key - Key
 * @param {string} value - Value
 * @param {number} expiresIn - Expiration in seconds (optional)
 * @returns {Promise<void>}
 */
const set = async (key, value, expiresIn = null) => {
  const redisClient = await connect();
  
  if (expiresIn) {
    await redisClient.setEx(key, expiresIn, value);
  } else {
    await redisClient.set(key, value);
  }
};

/**
 * Get value from Redis
 * @param {string} key - Key
 * @returns {Promise<string|null>} Value or null
 */
const get = async (key) => {
  const redisClient = await connect();
  return await redisClient.get(key);
};

/**
 * Delete key from Redis
 * @param {string} key - Key
 * @returns {Promise<number>} Number of keys deleted
 */
const del = async (key) => {
  const redisClient = await connect();
  return await redisClient.del(key);
};

/**
 * Check if key exists
 * @param {string} key - Key
 * @returns {Promise<boolean>} True if key exists
 */
const exists = async (key) => {
  const redisClient = await connect();
  const result = await redisClient.exists(key);
  return result === 1;
};

/**
 * Set expiration on key
 * @param {string} key - Key
 * @param {number} seconds - Seconds until expiration
 * @returns {Promise<boolean>} True if expiration was set
 */
const expire = async (key, seconds) => {
  const redisClient = await connect();
  const result = await redisClient.expire(key, seconds);
  return result === 1;
};

/**
 * Get time to live for key
 * @param {string} key - Key
 * @returns {Promise<number>} Seconds until expiration (-1 if no expiration, -2 if key doesn't exist)
 */
const ttl = async (key) => {
  const redisClient = await connect();
  return await redisClient.ttl(key);
};

/**
 * Increment value
 * @param {string} key - Key
 * @returns {Promise<number>} New value
 */
const incr = async (key) => {
  const redisClient = await connect();
  return await redisClient.incr(key);
};

/**
 * Decrement value
 * @param {string} key - Key
 * @returns {Promise<number>} New value
 */
const decr = async (key) => {
  const redisClient = await connect();
  return await redisClient.decr(key);
};

/**
 * Get all keys matching pattern
 * @param {string} pattern - Pattern (e.g., 'session:*')
 * @returns {Promise<Array<string>>} Array of keys
 */
const keys = async (pattern) => {
  const redisClient = await connect();
  return await redisClient.keys(pattern);
};

/**
 * Delete all keys matching pattern
 * @param {string} pattern - Pattern (e.g., 'session:*')
 * @returns {Promise<number>} Number of keys deleted
 */
const deletePattern = async (pattern) => {
  const redisClient = await connect();
  const matchingKeys = await redisClient.keys(pattern);
  
  if (matchingKeys.length === 0) {
    return 0;
  }
  
  return await redisClient.del(matchingKeys);
};

/**
 * Set hash field
 * @param {string} key - Key
 * @param {string} field - Field
 * @param {string} value - Value
 * @returns {Promise<number>} 1 if new field, 0 if updated
 */
const hSet = async (key, field, value) => {
  const redisClient = await connect();
  return await redisClient.hSet(key, field, value);
};

/**
 * Get hash field
 * @param {string} key - Key
 * @param {string} field - Field
 * @returns {Promise<string|null>} Value or null
 */
const hGet = async (key, field) => {
  const redisClient = await connect();
  return await redisClient.hGet(key, field);
};

/**
 * Get all hash fields
 * @param {string} key - Key
 * @returns {Promise<Object>} Hash object
 */
const hGetAll = async (key) => {
  const redisClient = await connect();
  return await redisClient.hGetAll(key);
};

/**
 * Delete hash field
 * @param {string} key - Key
 * @param {string} field - Field
 * @returns {Promise<number>} Number of fields deleted
 */
const hDel = async (key, field) => {
  const redisClient = await connect();
  return await redisClient.hDel(key, field);
};

/**
 * Health check for Redis
 * @returns {Promise<Object>} Health status
 */
const healthCheck = async () => {
  try {
    const redisClient = await connect();
    await redisClient.ping();
    
    return {
      status: 'connected',
      healthy: true,
    };
  } catch (error) {
    return {
      status: 'disconnected',
      healthy: false,
      error: error.message,
    };
  }
};

/**
 * Close Redis connection
 * @returns {Promise<void>}
 */
const close = async () => {
  if (client && client.isOpen) {
    await client.quit();
    client = null;
    console.log('✅ Redis connection closed');
  }
};

/**
 * Flush all data (use with caution!)
 * @returns {Promise<void>}
 */
const flushAll = async () => {
  const redisClient = await connect();
  await redisClient.flushAll();
};

module.exports = {
  getClient,
  connect,
  testConnection,
  set,
  get,
  del,
  exists,
  expire,
  ttl,
  incr,
  decr,
  keys,
  deletePattern,
  hSet,
  hGet,
  hGetAll,
  hDel,
  healthCheck,
  close,
  flushAll,
  redisConfig,
};
