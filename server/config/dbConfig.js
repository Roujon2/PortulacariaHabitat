import pkg from 'pg';
import config from './config.js';
const { Pool } = pkg;

// Database connection and configuration
const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port
});


// Export
export default pool;