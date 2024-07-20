import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        auth_url: process.env.GOOGLE_AUTH_URL,
        token_url: process.env.GOOGLE_TOKEN_URL,
        client_url: process.env.GOOGLE_CLIENT_URL,
        token_secret: process.env.GOOGLE_TOKEN_SECRET,
        token_expiration: process.env.GOOGLE_TOKEN_EXPIRY,
        ee_key: process.env.GOOGLE_EE_KEY
    },
    server: {
        port: process.env.PORT || 5000
    }
};

export default config;