import ndviService from '../services/ndviService.js';

const sendNDVI = async (req, res) => {
    // Get the data from the request
    const { lat, lon } = req.body;

    // Send an error if the lat or lon is missing
    if (!lat || !lon) {
        return res.status(400).json({
            error: 'Missing latitude or longitude in request body',
        });
    }

    // Get the NDVI value
    try {
        const ndvi = await ndviService.getNDVI(lat, lon);
        res.status(200).json(ndvi);
    } catch (error) {
        res.status(500).json({
            error: 'Error getting NDVI value: ' + error.message,
        });
    }
}

const sendNDVIPolygon = async (req, res) => {
    // Get the data from the request
    const polygons = req.body;

    // Send an error if the polygon is missing
    if (!polygons) {
        return res.status(400).json({
            error: 'Missing polygon in request body',
        });
    }

    // Get the NDVI value
    try {
        const ndvi = await ndviService.calculateNDVI(polygons);

        // Send an error if the ndvi is null
        if (!ndvi) {
            return res.status(500).json({
                error: 'Error getting NDVI value: ' + error.message,
            });
        }

        res.status(200).json(ndvi);
    } catch (error) {
        res.status(500).json({
            error: 'Error getting NDVI value: ' + error.message,
        });
    }
}

// Default export
export default {
    sendNDVI,
    sendNDVIPolygon
};