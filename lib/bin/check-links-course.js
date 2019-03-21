#!/usr/bin/env node

/************************************************************************* 
 * Libraries / Requires / Constants
 *************************************************************************/
const main = require('../main.js');
const getBoundaryDate = require('../helper/getBoundaryDate.js');
/************************************************************************* 
 * Input Function
 * If it is complicated, consider abstracting it to a separate file.
 *************************************************************************/
function getInput() {
    //Get courseId from command line
    var courseId = process.argv[2];
    //Get boundary date from enquirer prompt function
    return getBoundaryDate().then((boundaryDate) => {
        //return object with courseId and boundaryDate
        return {
            courseId: courseId,
            boundaryDate: boundaryDate
        };
    });
}

/************************************************************************* 
 * Output Function
 * If it is complicated, consider abstracting it to a separate file.
 *************************************************************************/
function formatOutput(data) {
    //Use the array of courses with broken links and convert it to a CSV file using d3csv

    //Use FS to write the csv file


    // How to output data, eg. to csv, to json, to console, etc.
    return Promise.resolve();
}


Promise
    .resolve()
    .then(getInput)
    .then(main)
    .then(formatOutput)
    .then(console.log);