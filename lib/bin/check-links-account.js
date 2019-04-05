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

            //Create an object that is easier to understand (without array indices)
            courseListAndDetails = {
                courseList: courseListAndDetails[0],
                boundaryDate: courseListAndDetails[1].boundaryDate,
                subAccount: courseListAndDetails[1].subAccount
            };

            //If the answer to the enquirer question asking if we want sub accounts is no (false), then we don't want sub accounts, so we need to filter.
            if (!courseListAndDetails.subAccount) {
                courseListAndDetails.courseList = courseListAndDetails.courseList.filter(course => course.account_id === parseInt(accountId, '10'));
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
    .then((courseListAndDetails) => {
        //For debugging. Gives the number of courses that come through
        // console.log(arrayWithCourseIdsAndBoundaryDate[0].map((item) => item.account_id).length)
        var listOfPromisesToRun = courseListAndDetails.courseList.map((course) => {
            return main(course.id, courseListAndDetails.boundaryDate, course);
        });
        return Promise.all(listOfPromisesToRun);
    })
    .then(formatOutput)
    .then(console.log);