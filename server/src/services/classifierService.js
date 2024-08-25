import ee from '@google/earthengine';

// Helper function to prepare Landsat 8 surface reflectance images
function prepSrL8(image){
    // Develop masks for unwanted pixels (fill, could, cloud shadow)
    const qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
    const saturationMask = image.select('QA_RADSAT').eq(0);

    // Apply scaling factors to the appropriate bands
    const getFactorImg = function(factorNames){
        const factorList = image.toDictionary().select(factorNames).values();
        return ee.Image.constant(factorList);
    }

    const scaleImg = getFactorImg([
        'REFLECTANCE_MULT_BAND_.|TEMPERATURE_MULT_BAND_ST_B10']);
    const offsetImg = getFactorImg([
        'REFLECTANCE_ADD_BAND_.|TEMPERATURE_ADD_BAND_ST_B10']);
    const scaled = image.select('SR_B.|ST_B10').multiply(scaleImg).add(offsetImg);

    // Replace original bands with the scaled bands and apply masks
    return image.addBands(scaled, null, true)
        .updateMask(qaMask)
        .updateMask(saturationMask);
}

// Classifier function
async function classifyImage(polygon){
    return new Promise((resolve, reject) => {
        try{
            // Reformat coordinates
            const polyCoords = reformatCoordinates(polygon.coordinates);

            // Create ee polygon from coordinates
            const eePolygon = ee.Geometry.Polygon(polyCoords);

            // Prepare the image
            const image = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
                .filterDate('2022-03-01', '2022-07-01')
                .filterBounds(eePolygon)
                .map(prepSrL8)
                .median();
            
            // Bands for prediction
            const bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7', 'ST_B10'];

            // Load classifier model from assets
            const newClassifier = ee.Classifier.load('projects/ee-ambientes/assets/SpekBoom/testclassifier');

            // Classify the image
            const classified = image.select(bands).classify(newClassifier);

            // Clip the classified image to the polygon
            const classifiedClip = classified.clip(eePolygon);

            // Map layer for visualization
            const classifiedMap = classifiedClip.getMap(
                {
                    min: 0,
                    max: 2,
                    palette: ['orange', 'green', 'blue'],
                }
            )

            resolve(classifiedMap);

        } catch (error) {
            reject(error);
        }
    });
}

// Function to reformat coordinate data if it is in {lat, lng} format
function reformatCoordinates(coordinates){
    return coordinates.map(coord => {
        return [coord.lng, coord.lat];
    });
}

// Default export
export default {
    classifyImage
};