import express from 'express';
import authController from '../controllers/authController.js';
import config from '../../config/config.js';
import { generateClient } from '../middlewares/db.js';

const router = express.Router();

// Route to return auth url to frontend
router.get('/url', (_, res) => {
    res.json({
        url: `${config.google.auth_url}?${authController.googleAuthParams}`
    });
});

// Route to retrieve auth code from frontend and verify it
router.get('/token', generateClient, authController.verifyGoogleAuth);

// Route to check logged in status of user
router.get('/logged-in', authController.checkLoggedIn);

// Route to logout user
router.get('/logout', authController.logout);


export default router;