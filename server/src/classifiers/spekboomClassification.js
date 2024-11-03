import ee from '@google/earthengine';

// Spekboom classifier version
var spekboomClassifier = "2024-Nov-REG";

// ------ VARIABLES FOR THE MODEL ------

// A - 
// MSAVI2
var getAvgMSAVI2 = function(polygon){
    /* 
        Function collecting the average MSAVI2 (Surface reflectance from LANDSAT 8) over the last 10 years.
        
        Input
            - polygon: ee.Geometry.Polygon

        Output
            - ee.Image with the average MSAVI2

     */


    // 10 year period
    var startDate = ee.Date.fromYMD(2014, 1, 1);
    var endDate = ee.Date.fromYMD(2024, 1, 1);

    // Image collection and filtering
    var imageCollection = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
        .filterBounds(polygon)
        .filterDate(startDate, endDate)
        .filter(ee.Filter.lt("CLOUD_COVER",10))
    ;

    // Collect image years
    var yearsOfImages = imageCollection.aggregate_array("system:time_start").map(
        function(date){
            return ee.Date(date).format('YYYY');
        }
    ).distinct(); // Filter out duplicates


    // Function to calculate MSAVI2
    var calcMSAVI2 = function(image){
        var mSAVI2 = image.expression(
            '(1/2) * ((2*(NIR+1)) - ((2*NIR+1)**2 - 8*(NIR-RED))**(1/2))',
            {
                "NIR": image.select("SR_B5"),
                "RED": image.select("SR_B4")
            }
        );
        return mSAVI2.set("system:time_start", image.get("system:time_start"), 'date', ee.Date(image.get("system:time_start")).format().slice(0,10));
    };

    var mSAVI2Collection = imageCollection.map(calcMSAVI2);

    // Calculate average MSAVI2 per year
    var yearlyAvg = function(year){

        var myYearlyAvgMSAVI2 = mSAVI2Collection.filter(ee.Filter.calendarRange(year, year, 'year'));
        var myYearlyAvgMSAVI2 = myYearlyAvgMSAVI2.reduce(ee.Reducer.mean());
        return myYearlyAvgMSAVI2.mosaic();
    };

    var mSAVI2YearlyAvgCollection = ee.ImageCollection(yearsOfImages.map(yearlyAvg));
  
    var avgMSAVI2 = mSAVI2YearlyAvgCollection.reduce(ee.Reducer.mean()).rename("avgMSAVI2");
  
    return avgMSAVI2.clip(polygon);
};

// B -
// avgYearRainfall