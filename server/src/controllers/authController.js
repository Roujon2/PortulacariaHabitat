import config from '../../config/config.js';
import queryString from 'query-string';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import pool from '../../config/dbConfig.js';

import AppError from '../errors/appError.js';

import { getUserByEmail } from '../models/userModel.js';

import {logInfo} from '../../logger.js';

// Query parameters for Google OAuth url
const googleAuthParams = queryString.stringify({
    client_id: config.google.client_id,
    redirect_uri: config.google.redirect_uri,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    state: 'standard_oauth',
    prompt: 'consent'
});

// Params for retrieving the access token from Google
const getGoogleTokenParams = (code) => 
    queryString.stringify({
        client_id: config.google.client_id,
        client_secret: config.google.client_secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.google.redirect_uri,
    });

// Function to retrieve the auth code from frontend and exchange it for an access token
const verifyGoogleAuth = async (req, res, next) => {
    const { code } = req.query;

    // Get db client
    const client = await pool.connect();

    try{

        // If the query doesn't exist
        if (!code) {
            throw new AppError('Authorization error: Auth code not provided.', 400, {error: 'Google auth code not provided'});
        }

        // Extract all params needed for the token exchange
        const tokenParams = getGoogleTokenParams(code);

        // Exchange the auth code for an access token
        const { data: {id_token} } = await axios.post(`${config.google.token_url}?${tokenParams}`);

        // Check token's existence
        if (!id_token) {
            throw new AppError('Authorization error: Token retrieval failed.', 400, {error: 'Google auth token retrieval failed'});
        }

        // Decode the token and extract user info
        const decoded = jwt.decode(id_token);
        const user = {
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture
        };

        // Check if the user exists in the database
        const dbUser = await getUserByEmail(client, user.email);

        // If the user doesn't exist, reject the request
        if (!dbUser) {
            throw new AppError('Authorization error. Google email not authorized.', 401, {error: 'User not registered. Contact an administrator for more information.', user: user});
        }

        // Add the db user id to the token user 
        user.id = dbUser.id;

        // Generate a new JWT token for the user
        const token = jwt.sign(user, config.google.token_secret, { expiresIn: config.google.token_expiration });

        // Log the user info
        logInfo('User logged in', user);

        // Set user info in the cookie
        res.cookie('user', token, {httpOnly: true, maxAge: config.google.token_expiration, sameSite: 'None', secure: true});
        res.json({user});
    }catch(error){
        if(error instanceof AppError){
            next(error);
        }else{
            next(new AppError('Authorization error. Token verification failed.', 500, { error: 'Google OAuth Token verification failed: ' + error.message }));
        }
    }finally{
        if(client){
            client.release();
        }
    }
};


// Function checking logged in status of the user
const checkLoggedIn = (req, res) => {
    try{
        // User token from cookies
        const user = req.cookies.user;

        // If the user token doesn't exist
        if (!user) {
            return res.json({ loggedIn: false , user: null });
        }

        // Verify the token and add user info
        const decoded = jwt.verify(user, config.google.token_secret);

        // Separate the user info from the token
        const {iat, exp, ...userDetails} = decoded;

        // Generate a new token
        const newToken = jwt.sign(userDetails, config.google.token_secret, { expiresIn: config.google.token_expiration });

        // Reset token in cookie
        res.cookie('user', newToken, {httpOnly: true, maxAge: config.google.token_expiration, sameSite: 'None', secure: true});
        res.json({ loggedIn: true, user: decoded });
    }catch(error){
        console.error('Error: ', error.message);
        return res.json({ loggedIn: false , user: null});
    }
};


// Function to log out the user
const logout = (req, res) => {
    // Get user info from cookie
    const user = req.cookies.user;

    // Decode
    const decoded = jwt.decode(user);
    
    // Log user info
    logInfo('User logged out', decoded);

    res.clearCookie('user', {httpOnly: true, sameSite: 'None', secure: true, path: '/'});
    res.json({message: "Logged out successfully.", loggedIn: false});
};


// Export the functions
export default {
    googleAuthParams,
    verifyGoogleAuth,
    checkLoggedIn,
    logout
};