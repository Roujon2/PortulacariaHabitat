import AppError from '../errors/appError.js';

import { logError } from '../../logger.js';



import ee from '@google/earthengine';

// Spekboom classifier version
var spekboomClassifier = "2024-Nov-REG";

// ------ VARIABLES FOR THE MODEL ------

// A -
// MSAVI2
var getAvgMSAVI2 = function(polygon) {
    // 10 years of data
    var startDate = ee.Date.fromYMD(2014, 1, 1);
    var endDate = ee.Date.fromYMD(2024, 1, 1);
    var myImageCollection = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");

    // Filter by geometry
    myImageCollection = myImageCollection.filterBounds(polygon);

    // Filter by dates
    myImageCollection = myImageCollection.filterDate(startDate, endDate);

    // Filter by cloudlessness
    myImageCollection = myImageCollection.filter(ee.Filter.lt("CLOUD_COVER", 10));

    // Calculate MSAVI2
    var calcMSAVI2 = function(image) {
        var mSAVI2 = image.expression(
            '(1/2) * ((2*(NIR+1)) - ((2*NIR+1)*(2*NIR+1) - 8*(NIR-RED))**(1/2))', {
                'NIR': image.select('SR_B5'),
                'RED': image.select('SR_B4')
            });
        return mSAVI2.set('system:time_start', image.get('system:time_start'), 'date', ee.Date(image.get('system:time_start')).format().slice(0, 10));
    };

    var mSAVI2Collection = myImageCollection.map(calcMSAVI2);

    // Calculate the AVG per year
    var datesOfImages = myImageCollection.aggregate_array("system:time_start").map(
        function(date) {
            return ee.Date(date).format().slice(0, 10);
        });

    var yearsOfImages = datesOfImages.map(
        function(date) {
            return ee.Number.parse(ee.Date(date).format("YYYY"));
        }).distinct();

    var yearlyAvg = function(year) {
        var myYearlyAvgMSAVI2 = mSAVI2Collection.filter(ee.Filter.calendarRange(year, year, 'year'));
        myYearlyAvgMSAVI2.reduce(ee.Reducer.mean());
        return myYearlyAvgMSAVI2.mosaic();
    };

    var mSAVI2YearlyAvgCollection = ee.ImageCollection(yearsOfImages.map(yearlyAvg));

    var avgMSAVI2 = mSAVI2YearlyAvgCollection.reduce(ee.Reducer.mean()).rename("avgMSAVI2");

    return avgMSAVI2.clip(polygon);
};

// B -
// avgYearRainfall
var avgYearRainfall = function(polygon) {
    var annualave_ppt = ee.Image("projects/ee-ambientes/assets/WC_2-1/Prec/annualave_ppt");
    return annualave_ppt.clip(polygon).rename("avgYRainfall");
};

// C -
// avgRainfall6Hottest
var avgRainfall6Hottest = function(polygon) {
    var maxTempSemester_ppt = ee.Image("projects/ee-ambientes/assets/WC_2-1/Prec/maxtempsemester_ppt");
    return maxTempSemester_ppt.clip(polygon).rename("avgRainfall6H");
};

// D - avgRainfall6Coldest
var avgRainfall6Coldest = function(polygon) {
    var mintempsemester_ppt = ee.Image("projects/ee-ambientes/assets/WC_2-1/Prec/mintempsemester_ppt");
    return mintempsemester_ppt.clip(polygon).rename("avgRainfall6C");
};

// E - 
// sumHeatUnits6Hottest
var sumHeatUnits6Hottest = function(polygon) {
    var maxtempsemester_heatunits = ee.Image("projects/ee-ambientes/assets/WC_2-1/HeatUnits/maxtempsemester_heatunits");
    return maxtempsemester_heatunits.clip(polygon).rename("sumHeatUnits6H");
};

// F - 
// sumHeatUnits6Coldest
var sumHeatUnits6Coldest = function(polygon) {
    var maxtempsemester_heatunits = ee.Image("projects/ee-ambientes/assets/WC_2-1/HeatUnits/maxtempsemester_heatunits");
    return maxtempsemester_heatunits.clip(polygon).rename("sumHeatUnits6C");
};

// G - 
// sumRadiationavg6Hottest
var sumRadiationavg6Hottest = function(polygon) {
    var maxtempsemester_rad = ee.Image("projects/ee-ambientes/assets/WC_2-1/Srad/maxtempsemester_rad");
    return maxtempsemester_rad.clip(polygon).rename("sumRadi6H");
};

// H - 
// sumRadiationavg6Coldest
var sumRadiationavg6Coldest = function(polygon) {
    var mintempsemester_rad = ee.Image("projects/ee-ambientes/assets/WC_2-1/Srad/mintempsemester_rad");
    return mintempsemester_rad.clip(polygon).rename("sumRadi6C");
};

// I - slopePercent
var slopePercent = function(polygon) {
    var dem = ee.Image("USGS/SRTMGL1_003");
    var terrain = ee.Algorithms.Terrain(dem);
    var slope = terrain.select("slope");
    var slopeRadians = slope.multiply(Math.PI).divide(180);
    var slopePerc = slopeRadians.tan().multiply(100);
    return slopePerc.clip(polygon).rename("slopePerc");
};

// J - getCTI
var getCTI = function(polygon) {
    var cti = ee.ImageCollection("projects/sat-io/open-datasets/Geomorpho90m/cti");
    cti = cti.filterBounds(polygon).mosaic();
    return cti.clip(polygon).rename("cti");
};

// K - frostQuantity
var frostQuantity = function(polygon) {
    var frQty = ee.Image("projects/ee-ambientes/assets/WC_2-1/frostqty");
    return frQty.clip(polygon).rename("frQty");
};

// Custom function to estimate the dynamic scale of a polygon 
var getDynamicScale = function(polygon) {
    var maxFileSize = 33554432; // 32 MB in bytes
    // Aprox amount of bytes per pixel in geoTIFF
    var bytesPerPixel = 8;
    var maxPixels = maxFileSize / bytesPerPixel;

    var area = polygon.area();
    var scale = ee.Number(area).sqrt().divide(maxPixels).sqrt().round();

    // Return scale in meters per pixel
    return scale;
};

// Custom function to calculate the area of a specific class
const calculateClassArea = function(classifiedImage, classValue, polygon) {
    // Create a mask for the class
    var classMask = classifiedImage.eq(classValue);

    // Pixel area and mask to class
    var pixelArea = ee.Image.pixelArea().updateMask(classMask);

    // Sum the area of the class
    var classArea = pixelArea.reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: polygon,
        scale: 1000,
        maxPixels: 1e9
    });

    // Convert square meters to hectares
    var classAreaHa = ee.Number(classArea.get("area")).divide(10000).round();

    return classAreaHa;
};



// ------ STACKING VARIABLES ------
var createStack = function(polygon) {
    var avgMSAVI2_V = getAvgMSAVI2(polygon);
    var avgYearRainfall_V = avgYearRainfall(polygon);
    var avgRainfall6Hottest_V = avgRainfall6Hottest(polygon);
    var avgRainfall6Coldest_V = avgRainfall6Coldest(polygon);
    var sumHeatUnits6Hottest_V = sumHeatUnits6Hottest(polygon);
    var sumHeatUnits6Coldest_V = sumHeatUnits6Coldest(polygon);
    var sumRadiationavg6Hottest_V = sumRadiationavg6Hottest(polygon);
    var sumRadiationavg6Coldest_V = sumRadiationavg6Coldest(polygon);
    var getCTI_V = getCTI(polygon);
    var frostQuantity_V = frostQuantity(polygon);

    var stack = avgMSAVI2_V
        .addBands(avgYearRainfall_V)
        .addBands(avgRainfall6Hottest_V)
        .addBands(avgRainfall6Coldest_V)
        .addBands(sumHeatUnits6Hottest_V)
        .addBands(sumHeatUnits6Coldest_V)
        .addBands(sumRadiationavg6Hottest_V)
        .addBands(sumRadiationavg6Coldest_V)
        .addBands(getCTI_V)
        .addBands(frostQuantity_V);

    return stack;
};

// ------ SPEKBOOM MASK ------
var getSpekboomMask = function(polygon) {
    const pptAbove110 = ee.Image("projects/ee-ambientes/assets/Precipitation/GlobalAnnualPptAbove110mm");
    const frostqty_mask = ee.Image("projects/ee-ambientes/assets/Frost/frostqty_mask");
    const dem = ee.Image("USGS/SRTMGL1_003");

    var landCover = ee.ImageCollection("COPERNICUS/Landcover/100m/Proba-V-C3/Global");
    landCover = landCover.filter(ee.Filter.eq('system:index', '2019')).first();
    landCover = landCover.select("discrete_classification");

    var urban = landCover.neq(50);
    var cultivated = landCover.neq(40);
    var permanentWater = landCover.neq(80);
    var openSea = landCover.neq(200);

    var spekBoom = urban.and(cultivated).and(permanentWater).and(openSea);
    spekBoom = spekBoom.and(pptAbove110).and(frostqty_mask).rename("spekBoom");
    spekBoom = spekBoom.updateMask(spekBoom);

    return spekBoom.clip(polygon);
};
// ------ CLASSIFICATION MODEL ------
var spekboomClassification = function(polygon) {
    return new Promise((resolve, reject) => {
        try{
            var bandNames = ["avgMSAVI2",
                "avgYRainfall",
                "avgRainfall6H",
                "avgRainfall6C",
                "sumHeatUnits6H",
                "sumHeatUnits6C",
                "sumRadi6H",
                "sumRadi6C",
                "cti",
                "frQty"
            ];

            var stack = createStack(polygon);
            var spekboomMask = getSpekboomMask(polygon);
            stack = stack.updateMask(spekboomMask);

            var trainedClassifier = ee.Classifier.load("projects/ee-ambientes/assets/SpekBoom/RF_Classifier_" + spekboomClassifier);
            var classified = stack.select(bandNames).classify(trainedClassifier);
            var classifiedClip = classified.clip(polygon);


            var spekboomAbundance = classifiedClip.multiply(classifiedClip)
                .multiply(0.7143)
                .add(classifiedClip.multiply(1.9524))
                .add(1);

            var spekboomAbundanceAdj = spekboomAbundance.log().multiply(8.0337).add(5.1887);
            spekboomAbundanceAdj = spekboomAbundanceAdj.updateMask(spekboomAbundanceAdj.gt(5));

            var classAdjust = spekboomAbundanceAdj
                .where(spekboomAbundanceAdj.lte(10), 0)
                .where(spekboomAbundanceAdj.gt(10), 1)
                .where(spekboomAbundanceAdj.gt(12), 2)
                .where(spekboomAbundanceAdj.gt(14), 3)
                .where(spekboomAbundanceAdj.gt(16), 4)
                .where(spekboomAbundanceAdj.gt(18), 5)
                .where(spekboomAbundanceAdj.gt(20), 6)
                .where(spekboomAbundanceAdj.gt(22), 7)
                .where(spekboomAbundanceAdj.gt(24), 8)

            // Calculate the area of each class
            var classAreas = [];
            for (var i = 0; i < 9; i++) {
                classAreas.push(calculateClassArea(classAdjust, i, polygon));
            }

            // Add 3 bottom together, 3 middle together, and 3 top together
            var classAreasBottom3 = ee.Number(classAreas[0]).add(classAreas[1]).add(classAreas[2]);
            var classAreasMiddle3 = ee.Number(classAreas[3]).add(classAreas[4]).add(classAreas[5]);
            var classAreasTop3 = ee.Number(classAreas[6]).add(classAreas[7]).add(classAreas[8]);

            // Results in simple json object
            var classAreasRes = [
                ["#0000ff", classAreasBottom3],
                ["#ffff00", classAreasMiddle3],
                ["#ff0000", classAreasTop3]
            ]

            // Wrap in promise for getInfo
            const classAreasPromise = new Promise((resolve, reject) => {
                ee.List(classAreasRes.map(([color, area]) => [color, ee.Number(area)]))
                    .getInfo((result, error) => {
                        if (error) {
                            return reject(new AppError("Error getting class areas for Spekboom classification.", 500, { error: error }));
                        }
                        resolve(result);
                    });
            });


            // Visualization parameters: var imageVisParam3 = {"opacity":1,"bands":["classification"],"min":0,"max":8,"palette":["0000ff","0000ff","0000ff","ffff00","ffff00","ffff00","ff0000","ff0000","ff0000"]
            // var imageVisParamPol = ee.Algorithms.If(aoi.area().lt(maxArea),imageVisParam9,imageVisParam3);
            
            //var imageVisParamBlue = {opacity: 1, bands: ["classification"], min: 0, max: 8, palette: ["4b4b96", "0000ff", "dcdcff", "c8c84b", "ffff00", "ffffb4", "c84b4b", "ff0000", "ffb4b4"]};
            var imageVisParam3 = {opacity: 1, bands: ["classification"], min: 0, max: 8, palette: ["0000ff","0000ff","0000ff","ffff00","ffff00","ffff00","ff0000","ff0000","ff0000"]};

            // Get map
            var spekboomMapViz = classAdjust.visualize(imageVisParam3);

            // Get the dynamic scale
            var scale = getDynamicScale(polygon);


            // Wrap getMap in a Promise
            const getMapPromise = new Promise((resolve, reject) => {
                classAdjust.getMap(imageVisParam3, (map, error) => {
                    if (error) {
                        return reject(new AppError("Error generating map URL.", 500, {error: error}));
                    }
                    resolve(map);
                });
            });

            // Wrap getDownloadURL in a Promise
            const getDownloadUrlPromise = new Promise((resolve, reject) => {
                spekboomMapViz.getDownloadURL({
                    name: "spekboom_classification",
                    scale: scale,
                    fileFormat: "GeoTIFF",
                    region: polygon
                }, (url, error) => {
                    if (error) {
                        return reject(new AppError("Error generating download URL.", 500, {error: error}));
                    }
                    resolve(url);
                });
            });

            // // Use Promise.all for both
            // Promise.all([getMapPromise, getDownloadUrlPromise])
            //     .then(([map, url]) => {
            //         var spekboomClassificationRes = {
            //             map: map,
            //             downloadUrl: url
            //         };
            //         resolve(spekboomClassificationRes);
            //     })
            //     .catch(error => {
            //         if(!(error instanceof AppError)){
            //             error = new AppError('Error generating map and download URL.', 500, {error: error.message});
            //         }
            //         reject(error);
            //     });

            // Return the map and download URL using Promise.allSettled
            Promise.allSettled([getMapPromise, getDownloadUrlPromise, classAreasPromise])
                .then(([map, url, classAreas]) => {
                    // If there was an error with the map or download URL, log it
                    if(map.status === "rejected"){
                        logError("Status Code: 500 | Error generating map URL for Spekboom classification. | Error: " + map.reason);
                        reject(new AppError("Error generating map URL.", 500, {error: map.reason}));
                    }
                    if(url.status === "rejected"){
                        logError("Status Code: 500 | Error generating download URL for Spekboom classification. | Error: " + url.reason);
                    }
                    if(classAreas.status === "rejected"){
                        logError("Status Code: 500 | Error getting class areas for Spekboom classification. | Error: " + classAreas.reason);
                    }

                    var spekboomClassificationRes = {
                        map: map.status === "fulfilled" ? map.value : null,
                        downloadUrl: url.status === "fulfilled" ? url.value : null,
                        classAreas: classAreas.status === "fulfilled" ? classAreas.value : null
                    };


                    resolve(spekboomClassificationRes);
                })
                .catch(error => {
                    if(!(error instanceof AppError)){
                        error = new AppError('Error generating map and download URL.', 500, {error: error.message});
                    }
                    reject(error);
                }
            );

        } catch (error) {
            if(!(error instanceof AppError)){
                error = new AppError('Error with spekboom classifier.', 500, {error: error.message});
            }
            reject(error);
        }
            
    });
};

// Export the functions
export default {
    spekboomClassification,
};
