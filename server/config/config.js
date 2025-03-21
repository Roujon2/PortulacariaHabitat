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
        ee_key: process.env.GOOGLE_EE_SERVICE_ACCOUNT_KEY
    },
    server: {
        port: process.env.PORT || 5000,
        cert: process.env.SSL_CERT_PATH,
        key: process.env.SSL_KEY_PATH
    },
    db: {
        user: process.env.DB_USER_CLIENT,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME_CLIENT,
        password: process.env.DB_PASSWORD_CLIENT,
        port: process.env.DB_PORT
    }
};


export default config;