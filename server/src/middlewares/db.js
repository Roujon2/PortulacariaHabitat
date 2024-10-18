import config from '../../config/config.js';
import pool from '../../config/dbConfig.js';

export const generateClient = async (req, res, next) => {
    try{
        // Retrieve user from req
        const user = req.user;
        if(!user){
            return res.status(400).json({message: "User not found in request."});
        }
    
        // Create client and set session id
        const client = await pool.connect();
        await client.query(`SET session.user_id = ${user.id}`);

        // Attach client to res.locals for use in subsequent middleware/routes
        res.locals.dbClient = client;

        // Next middleware
        return next();
    }catch (error){
        console.error("Error generating DB client: ", error.message);
        return res.status(500).json({message: "Database connection error."});
    }
};

export const releaseClient = async(req, res, next) => {
    const client = res.locals.dbClient;

    // If the client exists, release it
    if(client){
        client.release();
    }

    return next();
};
