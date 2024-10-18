import express from 'express';
import classifierController from '../controllers/classifierController.js';
import authMiddleware from '../middlewares/auth.js';
import validateData from '../middlewares/validateData.js';
import { generateClient, releaseClient } from '../middlewares/db.js';


const router = express.Router();

// Route to get classification for polygon
router.post('/test', 
    validateData.validatePolygonData, 
    authMiddleware.authorizeToken, 
    generateClient, 
    classifierController.testClassifier, 
    releaseClient);

// Route to get classification result for polygon
router.get('/:id', 
    authMiddleware.authorizeToken, 
    generateClient, 
    classifierController.getPolygonClassificationResult, 
    releaseClient);

// Route to get spekboom mask
router.post('/spekboom_mask', 
    validateData.validatePolygonData, 
    authMiddleware.authorizeToken, 
    generateClient, 
    classifierController.getSpekboomMask, 
    releaseClient);


export default router;