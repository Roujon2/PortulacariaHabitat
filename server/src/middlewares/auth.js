import jwt from 'jsonwebtoken'
import config from '../../config/config.js'

// Auth middleware verification
const authorizeToken = (req, res, next) => {
    try {
        // User token from cookies
        const token = req.cookies.user;

        if (!token) return res.status(401).json({ message: 'Unauthorized access. Authorization token not found.' });
        
        // Verify token
        jwt.verify(token, config.google.token_secret);

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