import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import ndviRoute from './src/routes/ndviRoute.js';
import classifierRoute from './src/routes/classifierRoutes.js';
import sseRoutes from './src/routes/sseRoutes.js';

const app = express();
const PORT = config.server.port;

// CORS config
app.use(cors({
    origin: config.google.client_url,
    credentials: true
}));

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
app.use('/sse', sseRoutes);

// Heath check
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is online', timestamp: new Date().toISOString() });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});