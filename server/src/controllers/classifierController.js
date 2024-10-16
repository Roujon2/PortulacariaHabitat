import classifierService from "../services/classifierService.js";
import classifyResultModel from "../models/classifyResultModel.js";
import polygonModel from "../models/polygonModel.js";

import sseService from "../services/sseService.js";

const testClassifier = async (req, res) => {
    // Error if the request body is empty
    if (!req.body) {
        return res.status(400).json({
            error: 'Missing request body',
        });
    }

    // Error if there is not polygon 
    if (!req.body.polygon) {
        return res.status(400).json({
            error: 'Missing polygon in request body',
        });
    }

    const user_id = req.user.id;
    const polygon = req.body.polygon;
    const client = res.locals.dbClient;

    try {
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
        // Release the client after request
        if(client) client.release();
    }

};

// Function to get spekboom mask
const getSpekboomMask = async (req, res) => {
    if(!req.body){
        return res.status(400).json({
            error: 'Missing request body',
        });
    }

    if(!req.body.polygon){
        return res.status(400).json({
            error: 'Missing polygon in request body',
        });
    }

    const polygon = req.body.polygon;
    const client = res.locals.dbClient;

    try {
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
        // Release the client after request
        if(client) client.release();
    }
};


// Function to get a polygon classification result
const getPolygonClassificationResult = async (req, res) => {
    const user_id = req.user.id;
    const polygon_id = req.params.id;
    const client = res.locals.dbClient;

    try {
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
        // Release the client after request
        if(client) client.release();
    }
};

export default {
    testClassifier,
    getPolygonClassificationResult,
    getSpekboomMask,
};
