import classifierService from "../services/classifierService.js";
import classifyResultModel from "../models/classifyResultModel.js";
import polygonModel from "../models/polygonModel.js";

import sseService from "../services/sseService.js";

import AppError from '../errors/appError.js';

import { logInfo } from "../../logger.js";

import jwt from 'jsonwebtoken';


const testClassifier = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const polygon = req.body.polygon;
        const client = res.locals.dbClient;

        // Error if the request body is empty
        if (!req.body) {
            throw new AppError('Missing request body.', 400);
        }

        // Error if there is not polygon 
        if (!req.body.polygon) {
            throw new AppError('Missing polygon in request body.', 400);
        }
    
        const result = await classifierService.classifyImage(polygon);


        // Structure the result object
        if(!result.urlFormat){
            throw new AppError('Error with test classifier.', 500, {error: result.error});
        }

        const classificationResult = {
            classification_type: 'Land Cover Classification',
            classification_result_url: result.urlFormat,
        };

        // Save the classification result
        const savedResult = await classifyResultModel.saveClassificationResult(client, user_id, polygon.id, classificationResult);
        // Change polygon classification status
        await polygonModel.updatePolygonClassificationStatus(client, polygon.id, 'pending'); // CHANGED FROM 'classified' TO 'pending' CAUSE BROKEN

        // Send SSE event
        sseService.sendEvent(user_id, {action: "classification_complete", data: savedResult});


        res.status(200).json(savedResult);
    } catch (error) {
        if(!(error instanceof AppError)){
            error = new AppError('Error with test classifier.', 500, {error: error.message});
        }

        next(error);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};

// Function to get spekboom mask
const getSpekboomMask = async (req, res, next) => {
    try{
        // Retrieve polygon id from params
        const id = req.params.id;
        
        // DB client
        const client = res.locals.dbClient;

        // Find polygon in db
        const polygon = await polygonModel.getPolygon(client, id);

        if(!polygon){
            throw new AppError('Polygon not found in database.', 404);
        }

        // Get the spekboom mask
        const mask = await classifierService.getSpekboomMask(polygon);

        if(!mask.urlFormat){
            throw new AppError('Error getting spekboom mask.', 500);
        }

        res.status(200).json(mask);
    }catch(error){
        if(!(error instanceof AppError)){
            error = new AppError('Error getting spekboom mask.', 500, {error: error.message});
        }

        next(error);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};


// Function to get a polygon classification result
const getPolygonClassificationResult = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const polygon_id = req.params.id;
        const client = res.locals.dbClient;

        const result = await classifyResultModel.getClassificationResult(client, user_id, polygon_id);

        if (!result) {
            throw new AppError('Classification result not found in database.', 404);
        }

        res.status(200).json(result);
    } catch (error) {
        if(!(error instanceof AppError)){
            error = new AppError('Error getting polygon classification result.', 500, {error: error.message});
        }

        next(error);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};


// Function to get spekboom classification
const getSpekboomClassification = async (req, res, next) => {
    try {
        // Timer for request length
        const start = Date.now();

        const polygon_id = req.params.id;
        const client = res.locals.dbClient;

        // Extract post json data
        const classificationOptions = req.body;

        // Error if the request body is empty
        if (!req.body) {
            throw new AppError('Missing request data.', 400);
        }
        // Verify body contents
        else{
            if (classificationOptions.exactArea === undefined){
                throw new AppError('Missing exactArea option in request body.', 400);
            }
            if (classificationOptions.downloadUrl === undefined){
                throw new AppError('Missing downloadURL option in request body.', 400);
            }
            if (classificationOptions.filename === undefined){
                throw new AppError('Missing filename in request body.', 400);
            }
        }

        var polygon;

        try{
            // Retrieve the polygon
            polygon = await polygonModel.getPolygon(client, polygon_id);
        }catch(error){
            throw new AppError('Error getting polygon from database.', 500, {error: error.message});
        }

        if (!polygon) {
            throw new AppError('Polygon not found in database.', 404);
        }

        // Get the spekboom classification
        const result = await classifierService.classifySpekboom(polygon, classificationOptions);

        // If the result is an instance of AppError, throw it
        if(result instanceof AppError){
            throw result;
        }

        if(!result?.map?.urlFormat){
            throw new AppError('Error getting spekboom classification. No URL present in the response.', 500);
        }

        // Send SSE event
        sseService.sendEvent(polygon.user_id, {action: "classification_complete", data: result});

        // Log the action
        const elapsedTime = Date.now() - start;

        var userData = req.cookies?.user ? jwt.decode(req.cookies.user) : undefined;
        userData.polygon_id = polygon_id;
        userData.classificationOptions = classificationOptions;
        userData.elapsedTime = `${elapsedTime}ms`;
        logInfo('Status Code: 200 | Spekboom classification complete', userData);

        res.status(200).json(result);

    } catch (error) {
        if(!(error instanceof AppError)){
            error = new AppError('Error getting spekboom classification.', 500, {error: error.message});
        }

        next(error);
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};

export default {
    testClassifier,
    getPolygonClassificationResult,
    getSpekboomMask,
    getSpekboomClassification,
};
