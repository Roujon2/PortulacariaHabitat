const getUserByEmail = async (client, email) => {
  // Parameters
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  try{
    // Query
    const result = await client.query(query, values);

    // If no rows
    if(result.rows.length === 0){
      return null;
    }

    return result.rows[0];
  }catch(err){
    // Throw error
    throw err;
  }
};

// Exports
export {
  getUserByEmail
};
    
    
