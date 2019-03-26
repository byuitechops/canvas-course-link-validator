#!/usr/bin/env node

/************************************************************************* 
 * Libraries / Requires / Constants
 *************************************************************************/
const main = require('../main.js');
const getBoundaryDate = require('../helper/getBoundaryDate.js');
const writeCsvReport = require('../helper/writeCsvReport.js');
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
            boundaryDate: boundaryDate,
            courseId: courseId
        };
    });
}

/************************************************************************* 
 * Output Function
 * If it is complicated, consider abstracting it to a separate file.
 *************************************************************************/
function formatOutput(data) {
    //Write the csv report
    writeCsvReport([data]);
    return Promise.resolve(data);
}


Promise
    .resolve()
    .then(getInput)
    .then(main)
    .then(formatOutput)
    .then(console.log);