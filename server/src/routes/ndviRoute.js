import express from 'express';
import ndviController from '../controllers/ndviController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Route to get NDVI value
router.post('/', authMiddleware.authorizeToken, ndviController.sendNDVI);

export default router;
