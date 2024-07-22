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

// Initialize the Earth Engine API
initEE();

// Exports
export default {
    getNDVI
};