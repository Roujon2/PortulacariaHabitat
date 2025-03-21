import express from 'express';
import polygonController from '../controllers/polygonController.js';
import authMiddleware from '../middlewares/auth.js';
import classifierController from '../controllers/classifierController.js';
import { generateClient, releaseClient } from '../middlewares/db.js';


const router = express.Router();

// Polygon routes

// Fetching polygons
// Refreshing list
router.get('/refresh', 
    authMiddleware.authorizeToken, 
    generateClient,
    polygonController.refreshPolygons,
    releaseClient
);
// Loading more
router.get('/loadmore', 
    authMiddleware.authorizeToken, 
    generateClient,
    polygonController.loadMorePolygons,
    releaseClient
);

// Get polygons count
router.get('/count', 
    authMiddleware.authorizeToken, 
    generateClient,
    polygonController.getPolygonsCount,
    releaseClient
);

// Get polygon
router.get('/:id', 
    authMiddleware.authorizeToken, 
    generateClient,
    polygonController.getPolygon
);

// Save polygon
router.post('/', 
    authMiddleware.authorizeToken, 
    generateClient,
    polygonController.savePolygon
);

// Update polygon
router.put('/:id', 
    authMiddleware.authorizeToken, 
    generateClient,
    polygonController.updatePolygon
);

// Delete polygon
router.delete('/:id', 
    authMiddleware.authorizeToken, 
    generateClient,
    polygonController.deletePolygon
);
router.delete('/', 
    authMiddleware.authorizeToken, 
    generateClient,
    polygonController.deletePolygons
);


// Polygon classification

// Get spekboom mask
router.post('/:id/classify/spekboom_mask', 
    authMiddleware.authorizeToken, 
    generateClient,
    classifierController.getSpekboomMask
);

// Classify spekboom
router.post('/:id/classify/spekboom', 
    authMiddleware.authorizeToken, 
    generateClient,
    classifierController.getSpekboomClassification
);


export default router;