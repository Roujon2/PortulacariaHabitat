// Import Pool from pg
import pkg from 'pg';
const { Pool } = pkg;
import config from "../../config/config.js";

const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port
});


// Function to drop the tables in the spekboom database
const dropTables = async (client) => {
    await client.query(`
        DROP TABLE IF EXISTS results;
        DROP TABLE IF EXISTS polygons;
        DROP TABLE IF EXISTS users;
    `);

    console.log('Tables dropped');
};

// Function to create the tables in the spekboom database
const createTables = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  
        );
        
        CREATE TABLE IF NOT EXISTS polygons (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            locality VARCHAR(100) NOT NULL,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            ownership_type VARCHAR(100),
            farm_series_name VARCHAR(100),
            notes TEXT,
            coordinates JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

    `);

    console.log('Tables created');
};

// Function to set up the database
const setupDatabase = async () => {
    const client = await pool.connect();

    try{

        await client.query('BEGIN');

        // Action to take
        const action = process.argv[2];


        if (action === 'drop') {
            await dropTables(client);
        } else if (action === 'create') {
            await createTables(client);
        } else if (action === 'reboot'){
            await dropTables(client);
            await createTables(client);
        }else{
            console.log('Invalid action: [drop | create | reboot]');
        }

        await client.query('COMMIT');
        console.log('Database setup complete');

    } catch (e) {
        // Rolling back actions if an error occurs
        await client.query('ROLLBACK');
        console.error('Error setting up the database:', e);
    } finally {
        client.release();
        await pool.end();
    }
};

// Function to insert a user into the users table
const insertUser = async (client, email, name) => {
    const query = {
        text: 'INSERT INTO users(email, name) VALUES($1, $2) RETURNING *',
        values: [email, name]
    };

    const result = await client.query(query);
    return result.rows[0];
};

// Function to insert a polygon into the polygons table
const insertPolygon = async (client, userId, name, description, points) => {
    const query = {
        text: 'INSERT INTO polygons(user_id, name, description, coordinates) VALUES($1, $2, $3, $4) RETURNING *',
        values: [userId, name, description, points]
    };

    const result = await client.query(query);
    return result.rows[0];
};

// Function to insert test data into the tables
const insertTestData = async (client) => {
    // Insert test user
    const user = await insertUser(client, 'john@john.com', 'John Doe');
    console.log('User inserted:', user);

    // Insert test polygon
    const polygonPoints = JSON.stringify([
        { latitude: -33.92584, longitude: 18.42322 },
        { latitude: -33.92584, longitude: 18.42322 },
        { latitude: -33.92584, longitude: 18.42322 }
    ]);
    const polygon = await insertPolygon(client, user.id, 'Test Polygon', 'This is a test polygon', polygonPoints);
    console.log('Polygon inserted:', polygon);

};

// Function to retrieve all users from the users table
const getUsers = async (client) => {
    const query = 'SELECT * FROM users';
    const result = await client.query(query);
    return result.rows;
}

// Function to retrieve all polygons from the polygons table
const getPolygons = async (client) => {
    const query = 'SELECT * FROM polygons';
    const result = await client.query(query);

    return result.rows;
}

// Function to run test queries
const testQueries = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Insert test data
        await insertTestData(client);

        // Get all users
        const users = await getUsers(client);
        console.log('All users:', users);

        // Get all polygons
        const polygons = await getPolygons(client);
        console.log('All polygons:', polygons);

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error running test queries:', e);
    } finally {
        client.release();
        await pool.end();
    }
};



setupDatabase();
//testQueries();