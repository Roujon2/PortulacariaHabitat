import classifierService from "../services/classifierService.js";
import classifyResultModel from "../models/classifyResultModel.js";
import polygonModel from "../models/polygonModel.js";

import sseService from "../services/sseService.js";

const testClassifier = async (req, res) => {
    try {
        const user_id = req.user.id;
        const polygon = req.body.polygon;
        const client = res.locals.dbClient;

        // Error if the request body is empty
        if (!req.body) {
            res.status(400).json({
                error: 'Missing request body',
            });
        }

        // Error if there is not polygon 
        if (!req.body.polygon) {
            res.status(400).json({
                error: 'Missing polygon in request body',
            });
        }
    
        const result = await classifierService.classifyImage(polygon);


        // Structure the result object
        if(!result.urlFormat){
            return res.status(500).json({
                error: 'Error with test classifier: ' + result.error,
            });
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
        res.status(500).json({
            error: 'Error with test classifier: ' + error.message,
        });
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};

// Function to get spekboom mask
const getSpekboomMask = async (req, res) => {
    try{
        // Retrieve polygon id from params
        const id = req.params.id;
        
        // DB client
        const client = res.locals.dbClient;

        // Find polygon in db
        const polygon = await polygonModel.getPolygon(client, id);

        if(!polygon){
            return res.status(404).json({
                error: 'Polygon not found',
            });
        }

        // Get the spekboom mask
        const mask = await classifierService.getSpekboomMask(polygon);

        if(!mask.urlFormat){
            return res.status(500).json({
                error: 'Error getting spekboom mask.',
            });
        }

        res.status(200).json(mask);
    }catch(error){
        res.status(500).json({
            error: 'Error getting spekboom mask: ' + error.message,
        });
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};


// Function to get a polygon classification result
const getPolygonClassificationResult = async (req, res) => {
    try {
        const user_id = req.user.id;
        const polygon_id = req.params.id;
        const client = res.locals.dbClient;

        const result = await classifyResultModel.getClassificationResult(client, user_id, polygon_id);

        if (!result) {
            return res.status(404).json({
                error: 'Classification result not found',
            });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Error getting polygon classification result: ' + error.message,
        });
    }finally{
        if(res.locals.dbClient){
            res.locals.dbClient.release();
        }
    }
};


// Function to get spekboom classification
const getSpekboomClassification = async (req, res) => {
    try {
        const polygon_id = req.params.id;
        const client = res.locals.dbClient;

        // Retrieve the polygon
        const polygon = await polygonModel.getPolygon(client, polygon_id);

        if (!polygon) {
            res.status(404).json({
                error: 'Polygon not found',
            });
        }

        // Get the spekboom classification
        const result = await classifierService.classifySpekboom(polygon);

        // Send SSE event
        sseService.sendEvent(polygon.user_id, {action: "classification_complete", data: result});

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            error: 'Error getting polygon classification result: ' + error.message,
        });
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
