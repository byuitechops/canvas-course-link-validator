const d3 = require('d3-dsv');
const fs = require('fs');
const moment = require('moment');

module.exports = function (data) {


    //Transform the data to what we want it to be for the report
    var transformedData = data.map((item) => {
        return {
            "Course Id": item.id,
            "Course Code": item.courseCode,
            "Course Name": item.name,
            "Course Link": item.link,
            "Published Broken Links Count": item.publishedBrokenLinksCount,
            "Broken Links Count": item.brokenLinksCount,
            "Tool Success Message": item.message
        }
        //Might add the =HYPERLINK("link", "name") back!
    });

    //Use the array of courses with broken links and convert it to a CSV file using d3csv
    var csvFile = d3.csvFormat(transformedData);

    //Use FS to write the csv file
    fs.writeFileSync(`./Canvas Link Validation Report ${moment().format('MMM-DD-YYYY HH-mm-ss-SSS')}.csv`, csvFile);

}