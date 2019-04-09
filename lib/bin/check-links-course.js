#!/usr/bin/env node

/************************************************************************* 
 * Libraries / Requires / Constants
 *************************************************************************/
const main = require('../main.js');
const questions = require('../helper/questions.js');
const writeCsvReport = require('../helper/writeCsvReport.js');
/************************************************************************* 
 * Input Function
 * If it is complicated, consider abstracting it to a separate file.
 *************************************************************************/
function getInput() {
    //Get courseId from command line
    //If the courseId was not defined on the command line, throw an error.
    if (process.argv[2] === undefined) {
        throw Error("ERROR: A courseId was not provided. Please add the course Id as the first command line argument.");
    }
    //Otherwise, just add the command line course Id to the courseId variable.
    var courseId = process.argv[2];
    //Get boundary date from enquirer prompt function
    return questions.askQuestions([questions.boundaryDateQuestion]).then((answers) => {
        //return object with courseId and boundaryDate
        return {
            boundaryDate: answers.boundaryDate,
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

/************************************************************************* 
 * START HERE
 *************************************************************************/
Promise
    .resolve()
    .then(getInput)
    .then((inputObject) => {
        var boundaryDate = inputObject.boundaryDate;
        var courseId = inputObject.courseId;

        return main(courseId, boundaryDate);
    })
    .then(formatOutput)
    .then(console.log)
    .catch(e => {
        console.log(e.message);
    });