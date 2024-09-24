import Job from '../models/jobModel.js';
import sseService from '../services/sseService.js';

// Function to create a job
const createJob = async (req, res) => {
    const user_id = req.user.id;
    const polygon_id = req.params.id;

    try{
        const job = await Job.create(user_id, polygon_id);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "create", data: job});

        return res.status(201).json(job);
    }catch(err){
        return res.status(500).json({error: "Failed to create job:", err});
    }
};

// Function to update a job status
const updateJobStatus = async (req, res) => {
    const job_id = req.params.id;
    const status = req.body.status;

    try{
        const job = await Job.updateStatus(job_id, status);

        // Send SSE event
        sseService.sendEvent(job.user_id, {action: "update", data: job});

        return res.status(200).json(job);
    }catch(err){
        return res.status(500).json({error: "Failed to update job status:", err});
    }
};

// Function to find job by job id
const findJobById = async (req, res) => {
    const job_id = req.params.id;

    try{
        const job = await Job.findById(job_id);
        return res.status(200).json(job);
    }catch(err){
        return res.status(500).json({error: "Failed to find job by id:", err});
    }
};

export default {
    createJob,
    updateJobStatus,
    findJobById
};
