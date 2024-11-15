import ee from '@google/earthengine';

// Spekboom classifier version
var spekboomClassifier = "2024-Nov-REG";

// ------ VARIABLES FOR THE MODEL ------

// A -
// MSAVI2
/* 
        Function collecting the average MSAVI2 (Surface reflectance from LANDSAT 8) over the last 10 years.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the average MSAVI2
    */  
var getAvgMSAVI2 = function(polygon){
    return new Promise((resolve, reject) => {
        try{

                   
            // 10 years of data
            var startDate = ee.Date.fromYMD(2014,1,1);
            var endDate = ee.Date.fromYMD(2024,1,1);
            var myImageCollection = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");
            
            //filter by geometry
            myImageCollection = myImageCollection.filterBounds(polygon);
            //print("numImages after geometry filter", myImageCollection.aggregate_count("CLOUD_COVER"));
            
            //filter by dates
            myImageCollection = myImageCollection.filterDate(startDate,endDate);
            
            //print("numImages after date filter", myImageCollection.aggregate_count("CLOUD_COVER"));
            
            //filter by cloudlessness
            myImageCollection = myImageCollection.filter(ee.Filter.lt("CLOUD_COVER",10));
            //print("numImages after cloud filter", myImageCollection.aggregate_count("CLOUD_COVER"));
            // Get all the image datess
            var datesOfImages = myImageCollection.aggregate_array("system:time_start").map(
                function (date) {
                return ee.Date(date).format().slice(0,10);
                });
            
            // Get all the distinct years of images
            var yearsOfImages = datesOfImages.map(
            function (date) {
                return ee.Number.parse(ee.Date(date).format("YYYY"));
            }).distinct();
            
            //print(myImageCollection.first());
            
            
            
            // calculate MSAVI2
            //MSAVI2 = 1/2 * ((2*(NIR+1)) - ((2*NIR+1-(2 – 8*(NIR-red))^1/2)
            // ESA
            // MSAVI2 = (1/2) * ( 2 * IR_factor * near_IR + 1 - sqrt( ( 2 * IR_factor * near_IR + 1) * ( 2 * IR_factor * near_IR + 1)
            //           - 8 * (IR_factor * near_IR - red_factor * red) ) )
            
            
            var calcMSAVI2 = function(image){
                var mSAVI2 = image.expression(
                '(1/2) * ((2*(NIR+1)) - ((2*NIR+1)*(2*NIR+1) - 8*(NIR-RED))**(1/2))', {
                'NIR': image.select('SR_B5'),
                'RED': image.select('SR_B4')
                });
                return mSAVI2.set('system:time_start',image.get('system:time_start'),'date',ee.Date(image.get('system:time_start')).format().slice(0,10));
            };
            
            
            var mSAVI2Collection = myImageCollection.map(calcMSAVI2);
            
            //print("mSAVI2", mSAVI2Collection);
            
            // Calculate the AVG per year
            // yearsOfImages - contains all the years that we have images for
            var yearlyAvg = function(year){
                
                var myYearlyAvgMSAVI2 = mSAVI2Collection.filter(ee.Filter.calendarRange(year,year,'year'));
                //print("filtered to year",myYearlyAvgMSAVI2);
                myYearlyAvgMSAVI2.reduce(ee.Reducer.mean());
                return myYearlyAvgMSAVI2.mosaic();
            };
            
            
            var mSAVI2YearlyAvgCollection = ee.ImageCollection(yearsOfImages.map(yearlyAvg));
            
            var avgMSAVI2 = mSAVI2YearlyAvgCollection.reduce(ee.Reducer.mean()).rename("avgMSAVI2");
            
            var avgMSAVI2Clip = avgMSAVI2.clip(polygon);

            resolve(avgMSAVI2Clip);

        }catch(error){
            reject(new Error("Error in getAvgMSAVI2: " + error.message));
        }
    })
};


// B -
// avgYearRainfall
var avgYearRainfall = function(polygon){
    /* 
        Function collecting the average yearly rainfall over the last 30 years in meters.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the average yearly rainfall

     */
    return new Promise((resolve, reject) => {
        try{

            var annualave_ppt = ee.Image("projects/ee-ambientes/assets/WC_2-1/Prec/annualave_ppt");

            var annualaveClip_ppt = annualave_ppt.clip(polygon).rename("avgYRainfall");

            resolve(annualaveClip_ppt);

        }catch(error){
            reject(new Error("Error in avgYearRainfall: " + error.message));
        }
    })
};


// C -
// avgRainfall6Hottest
var avgRainfall6Hottest = function(polygon){
    /*
        Function collecting the average rainfall during the 6 hottest months of the year over the last 30 years in meters.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the average rainfall during the 6 hottest months of the year

    */
    return new Promise((resolve, reject) => {
        try{

            var maxTempSemester_ppt = ee.Image("projects/ee-ambientes/assets/WC_2-1/Prec/maxtempsemester_ppt");

            var maxTempSemesterClip_ppt = maxTempSemester_ppt.clip(polygon).rename("avgRainfall6H");

            resolve(maxTempSemesterClip_ppt);

        }catch(error){
            reject(new Error("Error in avgRainfall6Hottest: " + error.message));
        }
    })
};


// D - avgRainfall6Coldest
// avgRainfall6Coldest
var avgRainfall6Coldest = function(polygon){
    /* 
        Function collecting the average rainfall during the 6 coldest months of the year over the last 30 years in meters.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the average rainfall during the 6 coldest months of the year
    */

    return new Promise((resolve, reject) => {
        try{

            var mintempsemester_ppt = ee.Image("projects/ee-ambientes/assets/WC_2-1/Prec/mintempsemester_ppt");
            
            var mintempsemesterClip_ppt = mintempsemester_ppt.clip(polygon).rename("avgRainfall6C");

            resolve(mintempsemesterClip_ppt);

        }catch(error){
            reject(new Error("Error in avgRainfall6Coldest: " + error.message));
        }
    })
};
    
  
// E - 
// sumHeatUnits6Hottest
var sumHeatUnits6Hottest = function(polygon){
    /*
        Function collecting the sum of heat units of the 6 hottest months over the last 30 years.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the sum of heat units of the 6 hottest months
    */

    return new Promise((resolve, reject) => {
        try{

            var maxtempsemester_heatunits = ee.Image("projects/ee-ambientes/assets/WC_2-1/HeatUnits/maxtempsemester_heatunits");

            var maxtempsemesterClip_heatunits = maxtempsemester_heatunits.clip(polygon).rename("sumHeatUnits6H");
            
            resolve(maxtempsemesterClip_heatunits);

        }catch(error){
            reject(new Error("Error in sumHeatUnits6Hottest: " + error.message));
        }
    })

};


// F - 
// sumGDDavg6Hottest
var sumHeatUnits6Coldest = function(polygon){   
    /*
        Function collecting the sum of heat units of the 6 coldest months over the last 30 years.

        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the sum of heat units of the 6 coldest months
    */

    return new Promise((resolve, reject) => {
        try{

            var maxtempsemester_heatunits = ee.Image("projects/ee-ambientes/assets/WC_2-1/HeatUnits/maxtempsemester_heatunits");

            var maxtempsemesterClip_heatunits = maxtempsemester_heatunits.clip(polygon).rename("sumHeatUnits6C");

            resolve(maxtempsemesterClip_heatunits);

        }catch(error){
            reject(new Error("Error in sumHeatUnits6Coldest: " + error.message));
        }
    })
};


// G - 
// sumRadiationavg6Hottest
var sumRadiationavg6Hottest = function(polygon){
    /*
        Function collecting the sum of radiation of the 6 hottest months over the last 30 years.

        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the sum of radiation of the 6 hottest months
    */

    return new Promise((resolve, reject) => {
        try{
            var maxtempsemester_rad = ee.Image("projects/ee-ambientes/assets/WC_2-1/Srad/maxtempsemester_rad");
            
            var maxtempsemesterClip_rad = maxtempsemester_rad.clip(polygon).rename("sumRadi6H");

            resolve(maxtempsemesterClip_rad);

        }catch(error){
            reject(new Error("Error in sumRadiationavg6Hottest: " + error.message));
        }
    })
};


// F - 
// sumRadiationavg6Coldest
var sumRadiationavg6Coldest = function(polygon){
    /* 
        Function collecting the sum of radiation of the 6 coldest months over the last 30 years.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the sum of radiation of the 6 coldest months
    */

    return new Promise((resolve, reject) => {
        try{
            var mintempsemester_rad = ee.Image("projects/ee-ambientes/assets/WC_2-1/Srad/mintempsemester_rad");

            resolve(mintempsemester_rad.clip(polygon).rename("sumRadi6C"));

        }catch(error){
            reject(new Error("Error in sumRadiationavg6Coldest: " + error.message));
        }
    })
    
};


// I - slopePercent
// slopePercent
var slopePercent = function(polygon){
    /*
        Function collecting the slope percentage of the polygon.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the slope percentage
    */

    return new Promise((resolve, reject) => {
        try{

            var dem = ee.Image("USGS/SRTMGL1_003");

            var terrain = ee.Algorithms.Terrain(dem);

            var slope = terrain.select("slope");

            var slopeRadians = slope.multiply(Math.PI).divide(180);

            var slopePerc = slopeRadians.tan().multiply(100);
            
            resolve(slopePerc.clip(polygon).rename("slopePerc"));
        }catch(error){
            reject(new Error("Error in slopePercent: " + error.message));
        }
    })
};


// J - getCTI
// getCTI
var getCTI = function(polygon){
    /*
        Function collecting the Compound Topographic Index (CTI) of the polygon.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the CTI
    */

    return new Promise((resolve, reject) => {
        try{
            var cti = ee.ImageCollection("projects/sat-io/open-datasets/Geomorpho90m/cti");
            cti = cti.filterBounds(polygon).mosaic();

            resolve(cti.clip(polygon).rename("cti"));

        }catch(error){
            reject(new Error("Error in getCTI: " + error.message));
        }
    })
};


// K - frostQuantity
var frostQuantity = function(polygon){
    /*
        Function collecting the frost quantity of the polygon.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the frost quantity
    */

    return new Promise((resolve, reject) => {
        try{
            var frQty = ee.Image("projects/ee-ambientes/assets/WC_2-1/frostqty");

            resolve(frQty.clip(polygon).rename("frQty"));
        }catch(error){
            reject(new Error("Error in frostQuantity: " + error.message));
        }
    })
};


// ------ STACKING VARIABLES ------
var createStack = function(polygon){
    /*
        Function stacking all the variables for the model.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with all the variables
    */

    return new Promise((resolve, reject) => {
        try{
            var avgMSAVI2_V = getAvgMSAVI2(polygon);
            var avgYearRainfall_V = avgYearRainfall(polygon);
            var avgRainfall6Hottest_V = avgRainfall6Hottest(polygon);
            var avgRainfall6Coldest_V = avgRainfall6Coldest(polygon);
            var sumHeatUnits6Hottest_V = sumHeatUnits6Hottest(polygon);
            var sumHeatUnits6Coldest_V = sumHeatUnits6Coldest(polygon);
            var sumRadiationavg6Hottest_V = sumRadiationavg6Hottest(polygon);
            var sumRadiationavg6Coldest_V = sumRadiationavg6Coldest(polygon);
            //var slopePercent_V = slopePercent(bbox);
            var getCTI_V = getCTI(polygon);
            //var meanMinTempColdestMonth_V = meanMinTempColdestMonth(bbox);
            var frostQuantity_V = frostQuantity(polygon);

            var stack = avgMSAVI2_V
                .addBands(avgYearRainfall_V)
                .addBands(avgRainfall6Hottest_V)
                .addBands(avgRainfall6Coldest_V)
                .addBands(sumHeatUnits6Hottest_V)
                .addBands(sumHeatUnits6Coldest_V)
                .addBands(sumRadiationavg6Hottest_V) 
                .addBands(sumRadiationavg6Coldest_V)
                //.addBands(slopePercent_V)
                .addBands(getCTI_V)
                //.addBands(meanMinTempColdestMonth_V)
                .addBands(frostQuantity_V);

            resolve(stack);

        }catch(error){
            reject(new Error("Error in createStack: " + error.message));
        }
    })
};


// ------ SPEKBOOM MASK ------
async function getSpekboomMask(polygon){
    /*
        Function generating a spekboom mask clipped to the polygon.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - Image with spekboom mask
    */

    // Load required images
    const pptAbove110 = ee.Image("projects/ee-ambientes/assets/Precipitation/GlobalAnnualPptAbove110mm");
    const frostqty_mask = ee.Image("projects/ee-ambientes/assets/Frost/frostqty_mask");

    const dem = ee.Image("USGS/SRTMGL1_003");

    // Added to create the landcover classification
    var landCover = ee.ImageCollection("COPERNICUS/Landcover/100m/Proba-V-C3/Global");
    landCover = landCover.filter(ee.Filter.eq('system:index', '2019')).first();
    landCover = landCover.select("discrete_classification");

    var urban = landCover.neq(50);
    var cultivated = landCover.neq(40);
    var permanentWater = landCover.neq(80);
    var openSea = landCover.neq(200);

    // Spekboom mask
    var spekBoom = urban.and(cultivated).and(permanentWater).and(openSea);

    // // Terrain and slope calculations
    // const terrain = ee.Algorithms.Terrain(dem);
    // const slope = terrain.select('slope');
    // const slopeRadians = slope.multiply(Math.PI).divide(180);
    // const slopePerc = slopeRadians.tan().multiply(100);

    spekBoom = spekBoom.and(pptAbove110).and(frostqty_mask).rename("spekBoom");
    
    // // Agriculture mask (slope > 5 degrees and precipitation > 400mm)
    // const agriMask = slopePerc.gt(5).and(pptAbove400).rename('AgriMask');
    
    // // Spekboom mask (agriculture mask, precipitation > 110mm, frost < threshold)
    // let spekBoom = agriMask.and(pptAbove110).and(frost30).rename('spekBoom');
    // spekBoom = spekBoom.updateMask(spekBoom);
    
    // // Clip the spekBoom mask to the polygon
    // const spekBoomClipped = spekBoom.clip(eePolygon);

    spekBoom = spekBoom.updateMask(spekBoom);

    // Clip the spekBoom mask to the polygon
    const spekBoomClipped = spekBoom.clip(polygon);

    return spekBoomClipped
}


// ------ CLASSIFICATION MODEL ------
async function spekboomClassification(polygon){
    /*
        Function classifying the polygon into a spekboom class.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the classification
    */
    
    try{
        var bandNames = ["avgMSAVI2",
            "avgYRainfall",
            "avgRainfall6H",
            "avgRainfall6C",
            "sumHeatUnits6H",
            "sumHeatUnits6C",
            "sumRadi6H",
            "sumRadi6C",
            //"slopePerc",
            "cti",
            //"mmtcm",
            "frQty"
        ];

        // Create the stack
        var stack = createStack(polygon);

        // Get the spekboom mask
        var spekboomMask = await getSpekboomMask(polygon);

        // Apply the mask to the stack
        stack = stack.updateMask(spekboomMask);

        // Load the model
        var trainedClassifier = ee.Classifier.load("projects/ee-ambientes/assets/SpekBoom/RF_Classifier_"+ spekboomClassifier);

        // Classify the image
        var classified = stack.select(bandNames).classify(trainedClassifier);

        // Clip the classified image to the polygon
        var classifiedClip = classified.clip(polygon);

        // Turn classification into abundance
        var spekboomAbundance = classifiedClip.multiply(classifiedClip)
            .multiply(0.7143)
            .add(classifiedClip.multiply(1.9524))
            .add(1)

        // Adjust the abundance
        var spekboomAbundanceAdj = spekboomAbundance.log().multiply(8.0337).add(5.1887);

        // Cut off lower abundance
        spekboomAbundanceAdj = spekboomAbundanceAdj.updateMask(spekboomAbundanceAdj.gt(5));

        // Divide into classes
        var classAdjust = spekboomAbundanceAdj
            .where(spekboomAbundanceAdj.lte(10),0)
            .where(spekboomAbundanceAdj.gt(10),1)
            .where(spekboomAbundanceAdj.gt(12),2)
            .where(spekboomAbundanceAdj.gt(14),3)
            .where(spekboomAbundanceAdj.gt(16),4)
            .where(spekboomAbundanceAdj.gt(18),5)
            .where(spekboomAbundanceAdj.gt(20),6)
            .where(spekboomAbundanceAdj.gt(22),7)
            .where(spekboomAbundanceAdj.gt(24),8);

        var imageVisParamBlue = {"opacity":1,"bands":["classification"],"min":0,"max":8,"palette":["4b4b96","0000ff","dcdcff","c8c84b","ffff00","ffffb4","c84b4b","ff0000","ffb4b4"] };

        // Get map
        var spekboomMap = classAdjust.getMap(imageVisParamBlue);

        

        // ----- NOW WOULD BE THE PART TO SOMEHOW RETURN THE CLASSIFIED IMAGE TO THE FRONTEND -----
        // I'm not sure how to do this, but I think it would be something like this: NOT USING GET MAP BUT SOMEHOW SAVING THE IMAGE

        // var spekboomMap = classAdjust.getMap(
        //     {
        //         min: 5,
        //         max: 60,
        //         palette: ["0000ff","2f52ff","859aff","ffffff","ffb6b6","ff5a5a","ff0000"]
        //     }
        // );

        return spekboomMap;    


    }catch(error){
        return new Error("Error in spekboomClassification: " + error.message);
    }
};


// Export the functions
export default {
    spekboomClassification,
};
