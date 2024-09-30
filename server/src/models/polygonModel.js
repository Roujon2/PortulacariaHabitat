import pool from '../../config/dbConfig.js';

const savePolygon = async (client, user_id, polygon) => {
    // Query
    const query = 'INSERT INTO polygons(user_id, name, description, coordinates, locality, ownership_type, farm_series_name, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';

    // Values
    const values = [user_id, polygon.name, polygon.description, JSON.stringify(polygon.coordinates), polygon.locality, polygon.ownership_type, polygon.farm_series_name, polygon.notes];

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows[0];
    }
    catch(err){
        throw err;
    }
};

// Function to update polygon data
const updatePolygon = async (client, polygon_id, polygon) => {
    // Query
    const query = 'UPDATE polygons SET name = $1, description = $2, coordinates = $3, locality = $4, ownership_type = $5, farm_series_name = $6, notes = $7 WHERE id = $8 RETURNING *';

    // Values
    const values = [polygon.name, polygon.description, JSON.stringify(polygon.coordinates), polygon.locality, polygon.ownership_type, polygon.farm_series_name, polygon.notes, polygon_id];

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows[0];
    }
    catch(err){
        throw err;
    }
};

// Function to delete specific polygon
const deletePolygon = async (client, polygon_id) => {
    // Query
    const query = 'DELETE FROM polygons WHERE id = $1';
    const values = [polygon_id];

    try{
        // Query
        await client.query(query, values);
    }
    catch(err){
        throw err;
    }
};

// Function to retrieve specific polygon
const getPolygon = async (client, polygon_id) => {
    // Query
    const query = 'SELECT * FROM polygons WHERE id = $1';
    const values = [polygon_id];

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows[0];
    }
    catch(err){
        throw err;
    }
};

// Function to lod more polygons past a certain timestamp
const loadMorePolygons = async (client, user_id, limit, last_updated_at) => {
    let query;
    let values;

    if (last_updated_at){
        query = `
            SELECT * FROM polygons
            WHERE user_id = $1
            AND updated_at < $2
            ORDER BY updated_at DESC
            LIMIT $3;
        `;

        values = [user_id, last_updated_at, limit];
    }else{
        query = `
            SELECT * FROM polygons
            WHERE user_id = $1
            ORDER BY updated_at DESC
            LIMIT $2;
        `;

        values = [user_id, limit];
    }

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows;
    }
    catch(err){
        throw err;
    }
};

// Function to refresh a list of polygons based on a last updated at timestamp
const refreshPolygons = async (client, user_id, last_updated_at, limit) => {
    let query;
    let values;

    if(last_updated_at){
        query = `
            SELECT * FROM polygons
            WHERE user_id = $1
            AND updated_at > $2
            ORDER BY updated_at DESC
        `;

        values = [user_id, last_updated_at];
    }else{
        query = `
            SELECT * FROM polygons
            WHERE user_id = $1
            ORDER BY updated_at DESC
            LIMIT $2
        `;

        values = [user_id, limit];
    }

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows;
    }
    catch(err){
        throw err;
    }
};

// Function to delete multiple polygons based on list of polygon ids
const deletePolygons = async (client, polygon_ids) => {
    // Query
    const query = 'DELETE FROM polygons WHERE id = ANY($1)';
    const values = [polygon_ids];

    try{
        // Query
        await client.query(query, values);
    }
    catch(err){
        throw err;
    }
};


// Function querying the database for number of polygons linked to a user
const getPolygonsCount = async (client, user_id) => {
    // Query
    const query = 'SELECT COUNT(*) FROM polygons WHERE user_id = $1';
    const values = [user_id];

    try{
        // Query
        const result = await client.query(query, values);
        return parseInt(result.rows[0].count);
    }
    catch(err){
        throw err;
    }
};


export default {
    savePolygon,
    getPolygon,
    updatePolygon,
    deletePolygon,
    loadMorePolygons,
    refreshPolygons,
    deletePolygons,
    getPolygonsCount
}