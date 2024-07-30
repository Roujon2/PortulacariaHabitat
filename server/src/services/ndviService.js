import ee from '@google/earthengine';
import config from '../../config/config.js';

// Initialize Earth Engine
function initEE() {
    const privateKey = JSON.parse(config.google.ee_key);

    ee.data.authenticateViaPrivateKey(privateKey, () => {
        ee.initialize(null, null, () => {
            console.log('EE initialized');
        });
    });
}

// Function of EE script to calculate NDVI
async function getNDVI(lat, lon){
    return new Promise((resolve, reject) => {
        try{
            // Turn lat and lon into numbers
            lat = Number(lat);
            lon = Number(lon);

            const point = ee.Geometry.Point(lon, lat);
            const image = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
                .filterBounds(point)
                .first();
            
            // Get the ndvi info from the retrieved image
            const nd = image.normalizedDifference(['SR_B5', 'SR_B4']).reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: point,
                scale: 30,
            }).getInfo();

            // Change the key name
            const ndvi = {
                ndvi: nd.nd
            };

            resolve(ndvi);
        } catch (error) {
            reject(error);
        }
    });
}

// Function to calculate the ndvi
async function calculateNDVI(polygons){
    const { coordinates, startDate, endDate } = polygons;

    const polygonGeo = ee.Geometry.Polygon(coordinates);

    const l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
                .filterBounds(polygonGeo)
                .filterDate(startDate, endDate)
                .first();
    
    // Error catching if l8 is empty
    try{
        l8.getInfo();
    }catch(error){
        console.error('Error getting NDVI value:', error.message);
    }

    // Compute NDVI
    const ndvi = l8.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
    // Clip the NDVI image to the polygon boundary
    const ndviClip = ndvi.clip(polygonGeo);

    const ndviMap = ndviClip.getMap({ min: 0.04, max: 0.76, palette: ['blue', 'white', 'green'] });

    console.log("NDVI Map:", ndviMap);

    return ndviMap
}

// Initialize the Earth Engine API
initEE();

// Exports
export default {
    getNDVI,
    calculateNDVI
};