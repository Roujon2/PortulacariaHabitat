import client from "../../config/db.js";

const getAllUsers = async () => {
    const query = 'SELECT * FROM users';
    const { rows } = await client.query(query);
    return rows;
}

export default {
    getAllUsers
};


// 
const user = {name: 'Jonathan Roulet', email: 'jonroulet@gmail.com'};

const seedUsers = async () => {
    try {
      const userCollection = 'users';
  
      await client.query(`CREATE TABLE IF NOT EXISTS ${userCollection} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE
      )`);
  
      const existingUsers = await client.query(`SELECT * FROM ${userCollection}`);
      if (existingUsers.rows.length === 0) {
        // Add user to the collection
        await client.query(`INSERT INTO ${userCollection} (name, email) VALUES ('${user.name}', '${user.email}')`);
        console.log("Users seeded");
      } else {
        console.log("Users already exist in the collection.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      await client.end();
    }
  };
  
  seedUsers();