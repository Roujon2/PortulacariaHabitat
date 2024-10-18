import express from 'express';
import ndviController from '../controllers/ndviController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Route to get NDVI value
router.post('/', 
    authMiddleware.authorizeToken, 
    ndviController.sendNDVI
);

// Route to get NDVI value from polygon coords
router.post('/polygon', 
    authMiddleware.authorizeToken, 
    ndviController.sendNDVIPolygon,
);


export default router;
