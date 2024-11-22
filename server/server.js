import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import ndviRoute from './src/routes/ndviRoute.js';
import classifierRoute from './src/routes/classifierRoutes.js';
import sseRoutes from './src/routes/sseRoutes.js';
import polygonRoutes from './src/routes/polygonRoutes.js';

import { setSseHeaders } from './src/middlewares/sse.js';

import AppError from './src/errors/appError.js';

import https from 'https';
import fs from 'fs';

const app = express();
const PORT = config.server.port;

// CORS config
app.use(cors({
    origin: [config.google.client_url, 'https://spekboom-mapper.web.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// General endpoint
app.get('/', (req, res) => {
	res.status(200).json({message: "Welcome to the Spekboom Mapping API!"});
});

// Parsing cookies
app.use(cookieParser());

// Parsing json bodies
app.use(bodyParser.json());

// Routes for authentication and authorization
app.use('/auth', authRoutes);

// Route for NDVI
app.use('/ndvi', ndviRoute);

// Route for Classifier
app.use('/classifier', classifierRoute);

// Routes for SSE
app.use('/sse', setSseHeaders, sseRoutes);

// Routes for polygons
app.use('/polygons', polygonRoutes);

// Heath check
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is online', timestamp: new Date().toISOString(), status: 200 });
});


// Error handler internal app errors
app.use((err, req, res, next) => {
    // Release the db client if it exists
    if(res.locals.dbClient) {
        res.locals.dbClient.release();
    }

    if(err instanceof AppError) {
        res.status(err.statusCode).json(err.toJSON());
    }

    // If error is not an instance of AppError, call next middleware
    next(err);
});

// Error handler for 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found', status: 404 });
});


// General error handler middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: 'Internal server error: ' + err.message, status: err.statusCode || 500 });
});



// HTTPS server in production
if(process.env.NODE_ENV === 'production') {
    // SSL certificate and key
    const ssl_cert = fs.readFileSync(config.server.cert);
    const ssl_key = fs.readFileSync(config.server.key);

    const credentials = { key: ssl_key, cert: ssl_cert };

    // Create https server
    const server = https.createServer(credentials, app);

    // Start server
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}else if(process.env.NODE_ENV === 'development') {
    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}else{
    console.error('Environment not set');
}
