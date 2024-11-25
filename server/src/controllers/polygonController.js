import AppError from "../errors/appError.js";
import polygonModel from "../models/polygonModel.js";
import sseService from "../services/sseService.js";

const savePolygon = async (req, res, next) => {
    try{
    
        const user_id = req.user.id;
        const polygon = req.body;
        const client = res.locals.dbClient;

        const savedPolygon = await polygonModel.savePolygon(client, user_id, polygon);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "polygon_save", data: savedPolygon});

        res.status(201).json(savedPolygon);
    }catch(err){
        if (!(err instanceof AppError)) {
            err = new AppError('Failed to save polygon', 500, {error: err.message});
        }
        next(err);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};

const updatePolygon = async (req, res, next) => {
    try{
    
        const user_id = req.user.id;
        const polygon_id = req.params.id;
        const polygon = req.body

        const client = res.locals.dbClient;

        const updatedPolygon = await polygonModel.updatePolygon(client, polygon_id, polygon);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "polygon_update", data: updatedPolygon});

        res.status(200).json(updatedPolygon);
    }catch(err){
        if (!(err instanceof AppError)) {
            err = new AppError('Failed to update polygon', 500, {error: err.message, polygon_id: req.params.id});
        }
        next(err);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};

const deletePolygon = async (req, res, next) => {
    try{
    
        const user_id = req.user.id;
        const polygon_id = req.params.id;

        const client = res.locals.dbClient;

        const deletedPolygon = await polygonModel.deletePolygon(client, polygon_id);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "polygon_delete", data: deletedPolygon});

        res.status(200).json(deletedPolygon);
    }catch(err){
        if (!(err instanceof AppError)) {
            err = new AppError('Failed to delete polygon', 500, {error: err.message, polygon_id: req.params.id});
        }
        next(err);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};


const getPolygon = async (req, res, next) => {
    try{

        const polygon_id = req.params.id;

        const client = res.locals.dbClient;

        const polygon = await polygonModel.getPolygon(client, polygon_id);
        res.status(200).json(polygon);
    }catch(err){
        if (!(err instanceof AppError)) {
            err = new AppError('Failed to retrieve polygon', 500, {error: err.message, polygon_id:req.params.id});
        }
        next(err);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};

const loadMorePolygons = async (req, res, next) => {
    try{

    
        const user_id = req.user.id;
        const limit = req.query.limit || 10;
        const last_updated_at = req.query.last_updated_at || null;

        const client = res.locals.dbClient;

        const polygons = await polygonModel.loadMorePolygons(client, user_id, limit, last_updated_at);
        res.status(200).json(polygons);
    }catch(err){
        if (!(err instanceof AppError)) {
            err = new AppError('Failed to retrieve multiple polygons', 500, {error: err.message, limit: req.query.limit, last_updated_at: req.query.last_updated_at});
        }
        next(err);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};

const refreshPolygons = async (req, res, next) => {
    try{

        const user_id = req.user.id;
        const limit = req.query.limit || 10;
        const last_updated_at = req.query.last_updated_at || null;

        const client = res.locals.dbClient;

        const polygons = await polygonModel.refreshPolygons(client, user_id, last_updated_at, limit);
        res.status(200).json(polygons);
    }catch(err){
        if (!(err instanceof AppError)) {
            err = new AppError('Failed to refresh polygons', 500, {error: err.message, limit: req.query.limit, last_updated_at: req.query.last_updated_at});
        }
        next(err);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};


const deletePolygons = async (req, res, next) => {
    try{

        const user_id = req.user.id;
        const polygon_ids = req.body;

        const client = res.locals.dbClient;

        await polygonModel.deletePolygons(client, polygon_ids);

        // Send SSE event
        sseService.sendEvent(user_id, {action: "polygon_delete", data: polygon_ids});

        res.status(200).json({message: "Polygons deleted"});
    }catch(err){
        if (!(err instanceof AppError)) {
            err = new AppError('Failed to delete multiple polygons', 500, {error: err.message, polygon_ids: req.body});
        }
        next(err);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
}

// Get polygons count 
const getPolygonsCount = async (req, res, next) => {
    try{

        const user_id = req.user.id;

        const client = res.locals.dbClient;

        const count = await polygonModel.getPolygonsCount(client, user_id);
        res.status(200).json({count});
    }catch(err){
        if (!(err instanceof AppError)) {
            err = new AppError('Failed to retrieve polygons count', 500, {error: err.message});
        }
        next(err);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
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