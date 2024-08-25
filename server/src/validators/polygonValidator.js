import joi from 'joi';

// Polygon schema
const polygonSchema = joi.object({
    name: joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name cannot be empty',
            'any.required': 'Name is required'
        }),
    
    description: joi.string()
        .max(1000)
        .optional()
        .allow('')
        .messages({
            'string.base': 'Description must be a string',
            'string.max': 'Description cannot be more than 1000 characters'
        }),

    coordinates: joi.array()
        .items(
            joi.object({
                lat: joi.number()
                    .required()
                    .messages({
                        'number.base': 'Latitude must be a number',
                        'any.required': 'Latitude is required'
                    }),
                lng: joi.number()
                    .required()
                    .messages({
                        'number.base': 'Longitude must be a number',
                        'any.required': 'Longitude is required'
                    }),
            })
        )
        .min(3)
        .required()
        .messages({
            'array.base': 'Coordinates must be an array',
            'array.min': 'Polygon must have at least 3 coordinates',
            'any.required': 'Coordinates are required'
        }),
}).unknown(true);

export default polygonSchema;