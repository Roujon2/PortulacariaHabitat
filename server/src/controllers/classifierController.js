import classifierService from "../services/classifierService.js";
import classifyResultModel from "../models/classifyResultModel.js";

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

        res.status(200).json(savedResult);
    } catch (error) {
        res.status(500).json({
            error: 'Error with test classifier: ' + error.message,
        });
    }
};

export default {
    testClassifier
};
