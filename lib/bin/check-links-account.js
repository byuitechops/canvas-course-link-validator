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

    //BYU-Idaho Online Master Courses Account
    const masterCoursesAccount = 5;
    //Get the account id parameter from the command line
    var accountId = (process.argv[2]) ? process.argv[2] : masterCoursesAccount;
    //Get the list of courses in the account given
    var coursesToValidate = [];

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