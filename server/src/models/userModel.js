import pool from '../../config/dbConfig.js';

const getUserByEmail = async (email) => {
  // Parameters
  const client = await pool.connect();
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  try{
    // Query
    const result = await client.query(query, values);
    return result.rows[0];
  }catch(err){
    console.error("Error fetching user by email:", err);
  }finally{
    client.release();
  }
};

// Exports
export {
  getUserByEmail
};
    
    
