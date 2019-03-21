#!/usr/bin/env node

/************************************************************************* 
 * Libraries / Requires / Constants
 *************************************************************************/
const main = require('../main.js');
const asyncLib = require('async');
/************************************************************************* 
 * Input Function
 * If it is complicated, consider abstracting it to a seperate file.
 *************************************************************************/
function getInput(data, callback) {
    //BYU-Idaho Online Master Courses Account
    const masterCoursesAccount = 5;

    //Get the account id parameter from the command line
    var accountId = (process.argv[2]) ? process.argv[2] : masterCoursesAccount;

    //Get the list of courses in the account given
    var coursesToValidate = [];

    var input;
    // How to get input, eg. from file, commandline, inquierer, etc.
    return callback(null, input);
}

/************************************************************************* 
 * Output Function
 * If it is complicated, consider abstracting it to a seperate file.
 *************************************************************************/
function formatOutput(data, callback) {
    // How to output data, eg. to csv, to json, to console, etc.
    return callback(null, data);
}

//Start here
asyncLib.waterfall([
    getInput,
    main,
    formatOutput,
], console.log);