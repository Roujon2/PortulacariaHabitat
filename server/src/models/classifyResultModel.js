// Function to save classification result
const saveClassificationResult = async (client, user_id, polygon_id, result) => {
    // Query
    const query = `INSERT INTO classification_results
    (user_id, polygon_id, classification_type, classification_result_url)
    VALUES($1, $2, $3, $4) RETURNING *`;

    // Values
    const values = [user_id, polygon_id, result.classification_type, result.classification_result_url];

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows[0];
    }
    catch(err){
        throw err;
    }
};

// Function to retrieve classification result
const getClassificationResult = async (client, user_id, polygon_id) => {
    // Query
    const query = 'SELECT * FROM classification_results WHERE user_id = $1 AND polygon_id = $2';
    const values = [user_id, polygon_id];

    try{
        // Query
        const result = await client.query(query, values);
        return result.rows[0];
    }
    catch(err){
        throw err;
    }
};

// Function to delete classification result
const deleteClassificationResult = async (client, user_id, polygon_id) => {
    // Query
    const query = 'DELETE FROM classification_results WHERE user_id = $1 AND polygon_id = $2';
    const values = [user_id, polygon_id];

    try{
        // Query
        await client.query(query, values);
    }
    catch(err){
        throw err;
    }
};

// Export functions
export default {
    saveClassificationResult,
    getClassificationResult,
    deleteClassificationResult
};