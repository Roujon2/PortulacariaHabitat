import classifierService from "../services/classifierService.js";

const testClassifier = async (req, res) => {
    console.log(req);

    // Error if the request body is empty
    if (!req.body) {
        return res.status(400).json({
            error: 'Missing request body',
        });
    }


    try {
        const result = await classifierService.classifyImage(req.body.polygon);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Error with test classifier: ' + error.message,
        });
    }
};

export default {
    testClassifier
};
