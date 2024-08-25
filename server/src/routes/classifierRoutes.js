import express from 'express';
import classifierController from '../controllers/classifierController.js';
import authMiddleware from '../middlewares/auth.js';
import validateData from '../middlewares/validateData.js';

const router = express.Router();

// Route to get classification for polygon
router.post('/test', validateData.validatePolygonData, authMiddleware.authorizeToken, classifierController.testClassifier);


export default router;