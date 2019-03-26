const d3 = require('d3-dsv');
const fs = require('fs');
const moment = require('moment');

module.exports = function (data) {
    //Use the array of courses with broken links and convert it to a CSV file using d3csv
    var csvFile = d3.csvFormat(data);
    //Use FS to write the csv file
    fs.writeFileSync(`./Canvas Link Validation Report ${moment().format('MMM-DD-YYYY')}.csv`, csvFile);

}