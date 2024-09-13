import express from 'express';
import polygonController from '../controllers/polygonController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Polygon routes

// Fetching polygons
// Refreshing list
router.get('/refresh', authMiddleware.authorizeToken, polygonController.refreshPolygons);
// Loading more
router.get('/loadmore', authMiddleware.authorizeToken, polygonController.loadMorePolygons);

// Get polygons count
router.get('/count', authMiddleware.authorizeToken, polygonController.getPolygonsCount);

// Get polygon
router.get('/:id', authMiddleware.authorizeToken, polygonController.getPolygon);

// Save polygon
router.post('/', authMiddleware.authorizeToken, polygonController.savePolygon);

// Update polygon
router.put('/:id', authMiddleware.authorizeToken, polygonController.updatePolygon);

// Delete polygon
router.delete('/:id', authMiddleware.authorizeToken, polygonController.deletePolygon);
router.delete('/', authMiddleware.authorizeToken, polygonController.deletePolygons);


export default router;