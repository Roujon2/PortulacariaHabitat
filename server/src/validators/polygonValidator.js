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
            joi.array()
                .items(
                    joi.number()
                        .required()
                        .messages({
                            'number.base': 'Coordinate must be a number',
                            'any.required': 'Coordinate is required'
                        })
                )
                .length(2)
                .required()
                .messages({
                    'array.base': 'Coordinate must be an array',
                    'array.length': 'Coordinate must have exactly 2 elements (latitude and longitude)',
                    'any.required': 'Coordinate is required'
                })
        )
        .min(3)
        .required()
        .messages({
            'array.base': 'Coordinates must be an array',
            'array.min': 'Polygon must have at least 3 coordinates',
            'any.required': 'Coordinates are required'
        }),
});

export default polygonSchema;