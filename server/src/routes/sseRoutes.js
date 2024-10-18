import express from 'express';

import sseController from '../controllers/sseController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();   

// SSE connection route
router.get('/events', 
    authMiddleware.authorizeToken, 
    sseController.connect);

export default router;