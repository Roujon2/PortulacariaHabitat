import config from '../../config/config.js';
import queryString from 'query-string';
import jwt from 'jsonwebtoken';
import axios from 'axios';

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
const verifyGoogleAuth = async (req, res) => {
    const { code } = req.query;

    // If the query doesn't exist
    if (!code) {
        return res.status(400).json({ error: 'Authorization code not provided.' });
    }

    try{
        // Extract all params needed for the token exchange
        const tokenParams = getGoogleTokenParams(code);

        // Exchange the auth code for an access token
        const { data: {id_token} } = await axios.post(`${config.google.token_url}?${tokenParams}`);

        // Check token's existence
        if (!id_token) {
            return res.status(400).json({ error: 'Authorization error. Token not provided.' });
        }

        // Decode the token and extract user info
        const decoded = jwt.decode(id_token);
        const user = {
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture
        };

        // Generate a new JWT token for the user
        const token = jwt.sign(user, config.google.token_secret, { expiresIn: config.google.token_expiration });
        // Set user info in the cookie
        res.cookie('user', token, {httpOnly: true, maxAge: config.google.token_expiration});
        res.json({user});
    }catch(error){
        console.error('Error: ', error.message);
        return res.status(500).json({ message: 'Error verifying authorization code. '+err.message })
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
        res.cookie('user', newToken, {httpOnly: true, maxAge: config.google.token_expiration});
        res.json({ loggedIn: true, user: decoded });
    }catch(error){
        console.error('Error: ', error.message);
        return res.json({ loggedIn: false , user: null});
    }
};


// Function to log out the user
const logout = (req, res) => {
    res.clearCookie('user');
    res.json({message: "Logged out successfully.", loggedIn: false});
};


// Export the functions
export default {
    googleAuthParams,
    verifyGoogleAuth,
    checkLoggedIn,
    logout
};