import polygonSchema from "../validators/polygonValidator.js";

// Validate polygon data
const validatePolygonData = (req, res, next) => {
    console.log(req.body.polygon);
    const { error } = polygonSchema.validate(req.body.polygon);

    // If there is a mismatch in the data
    if (error) {
        return res.status(400).json({ error: error.details });
    }

    // Call the next middleware
    next();
};

export default{
    validatePolygonData
}