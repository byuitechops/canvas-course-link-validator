#!/usr/bin/env node

/************************************************************************* 
 * Libraries / Requires / Constants
 *************************************************************************/
const main = require('./main.js');
const asyncLib = require('async');
/************************************************************************* 
 * Input Function
 * If it is complicated, consider abstracting it to a seperate file.
 *************************************************************************/
function getInput(data, callback) {
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