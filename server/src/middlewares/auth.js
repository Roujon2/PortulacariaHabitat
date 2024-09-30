import jwt from 'jsonwebtoken'
import config from '../../config/config.js';
import pool from '../../config/dbConfig.js';

// Auth middleware verification
const authorizeToken = async (req, res, next) => {
    try {
        // User token from cookies
        const token = req.cookies.user;

        if (!token) return res.status(401).json({ message: 'Unauthorized access. Authorization token not found.' });
        
        // Verify token
        const decoded = jwt.verify(token, config.google.token_secret);

        // Attach user info to request object
        req.user = decoded;

        // Set session id for postgres rls
        const client = await pool.connect();
        await client.query(`SET session.user_id = ${decoded.id}`);

        // Attach client to res
        res.locals.dbClient = client;

        // Return and execute next middleware
        return next();
    } catch (error) {
        console.error('Error: ', error.message);
        res.status(401).json({ message: 'Unauthorized access.' });
    }
}

export default {
    authorizeToken
}