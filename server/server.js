import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from '../config/config';
import ndviRoute from './routes/ndviRoute';

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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});