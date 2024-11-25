import pkg from 'pg';
import config from './config.js';
const { Pool } = pkg;

// Database connection and configuration
const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port,
    // Maximum number of clients in the pool
    max: 20,
    // Time to wait before timing out when connecting a new client
    connectionTimeoutMillis: 30000
});


// Export
export default pool;