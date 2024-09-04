import pool from '../../config/dbConfig.js';

const savePolygon = async (user_id, polygon) => {
    // Params
    const client = await pool.connect();

    // Deconstruct polygon
    const { name, description, coordinates } = polygon;

    // Query
    const query = 'INSERT INTO polygons(user_id, name, description, coordinates) VALUES($1, $2, $3, $4) RETURNING *';

    // Values
    const values = [user_id, name, description, coordinates];

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows[0];
    }
    catch(err){
        console.error("Error saving polygon:", err);
    }
    finally{
        client.release();
    }

};

// Function to retrieve specific polygon
const getPolygon = async (polygon_id) => {
    // Params
    const client = await pool.connect();

    // Query
    const query = 'SELECT * FROM polygons WHERE id = $1';
    const values = [polygon_id];

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows[0];
    }
    catch(err){
        console.error("Error fetching polygon:", err);
    }
    finally{
        client.release();
    }
};


export default {
    savePolygon,
    getPolygon
}