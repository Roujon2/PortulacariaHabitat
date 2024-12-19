// Function to save polygon data
const savePolygon = async (client, user_id, polygon) => {
    // Query
    const query = 'INSERT INTO polygons(user_id, name, description, coordinates, locality, ownership_type, farm_series_name, notes, classification_status, area_hectares) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';

    // Values
    const values = [user_id, polygon.name, polygon.description, JSON.stringify(polygon.coordinates), polygon.locality, polygon.ownership_type, polygon.farm_series_name, polygon.notes, 'pending', polygon.area_hectares];

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
    const query = 'UPDATE polygons SET name = $1, description = $2, coordinates = $3, locality = $4, ownership_type = $5, farm_series_name = $6, notes = $7, classification_status = $8, area_hectares = $9 WHERE id = $10 RETURNING *';

    // Values
    const values = [polygon.name, polygon.description, JSON.stringify(polygon.coordinates), polygon.locality, polygon.ownership_type, polygon.farm_series_name, polygon.notes, polygon.classification_status, polygon.area_hectares, polygon_id];

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows[0];
    }
    catch(err){
        throw err;
    }
};

// Function to update polygon classification status
const updatePolygonClassificationStatus = async (client, polygon_id, classification_status) => {
    // Query
    const query = 'UPDATE polygons SET classification_status = $1 WHERE id = $2 RETURNING *';

    // Values
    const values = [classification_status, polygon_id];

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows[0];
    }catch(err){
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
const loadMorePolygons = async (client, user_id, offset) => {
    let query;
    let values;

    query = `
        SELECT * FROM polygons
        WHERE user_id = $1
        ORDER BY updated_at DESC
        OFFSET $2
    `;


    values = [user_id, offset];


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
const refreshPolygons = async (client, user_id, limit) => {
    let query;
    let values;

    query = `
        SELECT * FROM polygons
        WHERE user_id = $1
        ORDER BY updated_at DESC
        LIMIT $2
    `;
    values = [user_id, limit];
    

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
    getPolygonsCount,
    updatePolygonClassificationStatus
}