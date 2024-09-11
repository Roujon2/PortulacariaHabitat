import polygonModel from "../models/polygonModel.js";
import sseService from "../services/sseService.js";

const savePolygon = async (req, res) => {
    const user_id = req.user.id;
    const polygon = req.body;

    try{
        const savedPolygon = await polygonModel.savePolygon(user_id, polygon);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "save", data: savedPolygon});

        return res.status(201).json(savedPolygon);
    }catch(err){
        return res.status(500).json({error: "Failed to save polygon:", err});
    }
};

const updatePolygon = async (req, res) => {
    const user_id = req.user.id;
    const polygon_id = req.params.id;
    const polygon = req.body

    try{
        const updatedPolygon = await polygonModel.updatePolygon(polygon_id, polygon);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "update", data: updatedPolygon});

        return res.status(200).json(updatedPolygon);
    }catch(err){
        return res.status(500).json({error: "Failed to update polygon:", err});
    }
};

const deletePolygon = async (req, res) => {
    const user_id = req.user.id;
    const polygon_id = req.params.id;

    try{
        const deletedPolygon = await polygonModel.deletePolygon(polygon_id);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "delete", data: deletedPolygon});

        return res.status(200).json(deletedPolygon);
    }catch(err){
        return res.status(500).json({error: "Failed to delete polygon:", err});
    }
};


const getPolygon = async (req, res) => {
    const polygon_id = req.params.id;

    try{
        const polygon = await polygonModel.getPolygon(polygon_id);
        return res.status(200).json(polygon);
    }catch(err){
        return res.status(500).json({error: "Failed to get polygon:", err});
    }
};

const getPolygons = async (req, res) => {
    const user_id = req.user.id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    try{
        const polygons = await polygonModel.getPolygons(user_id, limit, offset);
        return res.status(200).json(polygons);
    }catch(err){
        return res.status(500).json({error: "Failed to get polygons:", err});
    }
};


const deletePolygons = async (req, res) => {
    const user_id = req.user.id;
    const polygon_ids = req.body;

    try{
        await polygonModel.deletePolygons(polygon_ids);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "delete", data: polygon_ids});

        return res.status(200).json({message: "Polygons deleted"});
    }catch(err){
        return res.status(500).json({error: "Failed to delete polygons:", err});
    }
}

// Get polygons count 
const getPolygonsCount = async (req, res) => {
    const user_id = req.user.id;

    try{
        const count = await polygonModel.getPolygonsCount(user_id);
        return res.status(200).json({count});
    }catch(err){
        return res.status(500).json({error: "Failed to get polygons count:", err});
    }
};

export default {
    savePolygon,
    getPolygon,
    updatePolygon,
    deletePolygon,
    getPolygons,
    deletePolygons,
    getPolygonsCount
};