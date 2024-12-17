import ee from '@google/earthengine';
import { format } from 'winston';

async function calculatePolygonAreaHectares(coordinates){
    try{
        // Coordinates are assumed to be in form [{lat: 0, lng: 0}, {lat: 0, lng: 0}, ...]
        // Reformat coordinates
        const polyCoords = reformatCoordinates(coordinates);
        // Create ee polygon from coordinates
        const eePolygon = ee.Geometry.Polygon(polyCoords);

        // Calculate area
        const area = ee.Geometry(eePolygon).area().divide(10000).getInfo();

        return area;
    }catch(error){
        if(!(error instanceof AppError)){
            error = new AppError('Error calculating polygon area.', 500, {error: error.message});
        }
        
        throw error;
    }
};


// Function to reformat coordinate data if it is in {lat, lng} format
function reformatCoordinates(coordinates){
    return coordinates.map(coord => {
        return [coord.lng, coord.lat];
    });
};

// Default export
export default {
    calculatePolygonAreaHectares,
};