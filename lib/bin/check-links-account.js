#!/usr/bin/env node

/************************************************************************* 
 * Libraries / Requires / Constants
 *************************************************************************/
const main = require('../main.js');
const getBoundaryDate = require('../helper/getBoundaryDate.js');
const writeCsvReport = require('../helper/writeCsvReport.js');
const canvas = require('canvas-api-wrapper');
/************************************************************************* 
 * Input Function
 * If it is complicated, consider abstracting it to a separate file.
 *************************************************************************/
function getInput() {

    //BYU-Idaho Online Master Courses Account
    const masterCoursesAccount = 5;
    //Get the account id parameter from the command line
    var accountId = (process.argv[2]) ? process.argv[2] : masterCoursesAccount;

    //Promise to get the list of courses for a given account
    var courseListPromise = canvas.get(`https://byui.instructure.com/api/v1/accounts/${accountId}/courses`, {
        sort: 'course_name'
    }).then((arrayOfCourseIdsInAccount) => {
        return arrayOfCourseIdsInAccount;
    });

    //Promise to get the boundary date (using an enquirer prompt function)
    var boundaryDatePromise = getBoundaryDate();

    //Will generate the array with an array of course objects and the boundaryDate
    return Promise.all([courseListPromise, boundaryDatePromise]);
}
/************************************************************************* 
 * Output Function
 * If it is complicated, consider abstracting it to a separate file.
 *************************************************************************/
function formatOutput(data) {
    //Write the csv report
    writeCsvReport(data);
    return Promise.resolve(data);
}


Promise
    .resolve()
    .then(getInput)
    .then((arrayWithCourseIdsAndBoundaryDate) => {
        var courseIdList = arrayWithCourseIdsAndBoundaryDate[0];
        var boundaryDate = arrayWithCourseIdsAndBoundaryDate[1];
        return courseIdList.map((course) => {
            return main(course.id, boundaryDate, course.course_name);
        });
    })
    .then(formatOutput)
    .then(console.log);