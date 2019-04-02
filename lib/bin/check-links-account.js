#!/usr/bin/env node

/************************************************************************* 
 * Libraries / Requires / Constants
 *************************************************************************/
const main = require('../main.js');
const questions = require('../helper/questions.js');
const writeCsvReport = require('../helper/writeCsvReport.js');
const canvas = require('canvas-api-wrapper');
/************************************************************************* 
 * Input Function
 * If it is complicated, consider abstracting it to a separate file.
 *************************************************************************/
function getInput() {

    //BYU-Idaho Online Master Courses Account
    const masterCoursesAccount = 42;
    //Get the account id parameter from the command line
    var accountId = (process.argv[2]) ? process.argv[2] : masterCoursesAccount;

    //Promise to get the list of courses for a given account
    var courseListPromise = canvas.get(`https://byui.instructure.com/api/v1/accounts/${accountId}/courses`, {
        sort: 'course_name'
    }).then((arrayOfCourseIdsInAccount) => {
        return arrayOfCourseIdsInAccount;
    });

    //Promise that asks the questions
    var questionsPromise = questions.askQuestions([questions.subAccountsQuestion, questions.boundaryDateQuestion]);


    //Will generate the array with an array of course objects and the boundaryDate
    return Promise.all([courseListPromise, questionsPromise])
        .then((courseListAndDetails) => {
            //If the answer to the enquirer question asking if we want sub accounts is no (false), then we don't want sub accounts, so we need to filter.
            if (!courseListAndDetails[1].subAccount) {
                courseListAndDetails[0] = courseListAndDetails[0].filter(course => course.account_id === parseInt(accountId, '10'));
            }
            return courseListAndDetails;

        });
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

        //For debugging. Gives the number of courses that come through
        // console.log(arrayWithCourseIdsAndBoundaryDate[0].map((item) => item.account_id).length)

        var courseIdList = arrayWithCourseIdsAndBoundaryDate[0];
        var boundaryDate = arrayWithCourseIdsAndBoundaryDate[1];
        courseIdList.forEach((item) => {
            console.log(item.id + " " + " " + item.name);
        });
        var listOfPromisesToRun = courseIdList.map((course) => {
            return main(course.id, boundaryDate, course.name);
        });
        return Promise.all(listOfPromisesToRun);
    })
    .then(formatOutput)
    .then(console.log);