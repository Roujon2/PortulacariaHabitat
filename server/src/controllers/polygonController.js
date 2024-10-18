import polygonModel from "../models/polygonModel.js";
import sseService from "../services/sseService.js";

const savePolygon = async (req, res) => {
    const user_id = req.user.id;
    const polygon = req.body;
    const client = res.locals.dbClient;

    try{
        const savedPolygon = await polygonModel.savePolygon(client, user_id, polygon);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "polygon_save", data: savedPolygon});

        res.status(201).json(savedPolygon);
    }catch(err){
        console.error("Failed to save polygon:", err);
        res.status(500).json({error: "Failed to save polygon:", err});
    }finally{
        if(client){
            client.release();
        }
    }
};

const updatePolygon = async (req, res) => {
    const user_id = req.user.id;
    const polygon_id = req.params.id;
    const polygon = req.body

    const client = res.locals.dbClient;

    try{
        const updatedPolygon = await polygonModel.updatePolygon(client, polygon_id, polygon);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "polygon_update", data: updatedPolygon});

        res.status(200).json(updatedPolygon);
    }catch(err){
        res.status(500).json({error: "Failed to update polygon:", err});
    }finally{
        if(client){
            client.release();
        }
    }
};

const deletePolygon = async (req, res) => {
    const user_id = req.user.id;
    const polygon_id = req.params.id;

    const client = res.locals.dbClient;

    try{
        const deletedPolygon = await polygonModel.deletePolygon(client, polygon_id);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "polygon_delete", data: deletedPolygon});

        res.status(200).json(deletedPolygon);
    }catch(err){
        res.status(500).json({error: "Failed to delete polygon:", err});
    }finally{
        if(client){
            client.release();
        }
    }
};


const getPolygon = async (req, res) => {
    const polygon_id = req.params.id;

    const client = res.locals.dbClient;

    try{
        const polygon = await polygonModel.getPolygon(client, polygon_id);
        res.status(200).json(polygon);
    }catch(err){
        res.status(500).json({error: "Failed to get polygon:", err});
    }finally{
        if(client){
            client.release();
        }
    }
};

const loadMorePolygons = async (req, res) => {
    const user_id = req.user.id;
    const limit = req.query.limit || 10;
    const last_updated_at = req.query.last_updated_at || null;

    const client = res.locals.dbClient;

    try{
        const polygons = await polygonModel.loadMorePolygons(client, user_id, limit, last_updated_at);
        res.status(200).json(polygons);
    }catch(err){
        res.status(500).json({error: "Failed to get polygons:", err});
    }finally{
        if(client){
            client.release();
        }
    }
};

const refreshPolygons = async (req, res) => {
    const user_id = req.user.id;
    const limit = req.query.limit || 10;
    const last_updated_at = req.query.last_updated_at || null;

    const client = res.locals.dbClient;

    try{
        const polygons = await polygonModel.refreshPolygons(client, user_id, last_updated_at, limit);
        res.status(200).json(polygons);
    }catch(err){
        res.status(500).json({error: "Failed to get polygons:", err});
    }finally{
        if(client){
            client.release();  
        }
    }
};


const deletePolygons = async (req, res) => {
    const user_id = req.user.id;
    const polygon_ids = req.body;

    const client = res.locals.dbClient;

    try{
        await polygonModel.deletePolygons(client, polygon_ids);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "polygon_delete", data: polygon_ids});

        res.status(200).json({message: "Polygons deleted"});
    }catch(err){
        res.status(500).json({error: "Failed to delete polygons:", err});
    }finally{
        if(client){
            client.release();
        }
    }
}

// Get polygons count 
const getPolygonsCount = async (req, res) => {
    const user_id = req.user.id;

    const client = res.locals.dbClient;

    try{
        const count = await polygonModel.getPolygonsCount(client, user_id);
        res.status(200).json({count});
    }catch(err){
        res.status(500).json({error: "Failed to get polygons count:", err});
    }finally{
        if(client){
            client.release();
        }
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
};