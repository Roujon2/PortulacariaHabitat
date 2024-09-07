import express from 'express';
import polygonController from '../controllers/polygonController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Polygon routes

// Get polygon
router.get('/:id', authMiddleware.authorizeToken, polygonController.getPolygon);

// Save polygon
router.post('/', authMiddleware.authorizeToken, polygonController.savePolygon);

// Update polygon
router.put('/:id', authMiddleware.authorizeToken, polygonController.updatePolygon);

// Delete polygon
router.delete('/:id', authMiddleware.authorizeToken, polygonController.deletePolygon);

export default router;