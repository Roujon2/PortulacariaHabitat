import pool from "../../config/dbConfig";

class Job{
    constructor(job_id, user_id, polygon_id, status, created_at, updated_at){
        this.job_id = job_id;
        this.user_id = user_id;
        this.polygon_id = polygon_id;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    // Create a job
    static async create(user_id, polygon_id){
        const client = await pool.connect();

        // Query
        const query = `
            INSERT INTO jobs(user_id, polygon_id, status)
            VALUES($1, $2, 'pending')
            RETURNING *
        `;

        // Values
        const values = [user_id, polygon_id];

        try{
            // Query
            const result = await client.query(query, values);
            
            return new Job(...result.rows[0]);

        }catch(err){
            console.error("Error creating job:", err);
        }
        finally{
            client.release();
        }
    }

    // Update job status
    static async updateStatus(job_id, status){
        const client = await pool.connect();

        // Query
        const query = `
            UPDATE jobs
            SET status = $1
            WHERE job_id = $2
            RETURNING *
        `;

        // Values
        const values = [status, job_id];

        try{
            // Query
            const result = await client.query(query, values);

            // If the job wasn't found
            if(result.rows.length === 0){
                throw new Error("Job not found");
            }

            return new Job(...result.rows[0]);

        }catch(err){
            console.error("Error updating job status:", err);
        }
        finally{
            client.release();
        }
    }

    // Find job by id
    static async findById(job_id){
        const client = await pool.connect();

        // Query
        const query = `
            SELECT * FROM jobs
            WHERE job_id = $1
        `;

        // Values
        const values = [job_id];

        try{
            // Query
            const result = await client.query(query, values);

            // If the job wasn't found
            if(result.rows.length === 0){
                throw new Error("Job not found");
            }

            return new Job(...result.rows[0]);

        }catch(err){
            console.error("Error finding job:", err);
        }
        finally{
            client.release();
        }
    }

}

export default Job;