const getCoursesWithBrokenLinks = require('./getCoursesWithBrokenLinks.js');
const fs = require('fs');
//also include d3dsv

//BYU-Idaho Online Master Courses Account
const masterCoursesAccount = 5;

//Get the account id parameter from the command line
var accountId = (process.argv[2]) ? process.argv[2] : masterCoursesAccount;

//Get the list of courses in the account given
var coursesToValidate = [];

//Run the validator tool and get the array with objects containing information for each course that has broken links
/*
Each object in the array looks like this:
{
    id:
    name:
    link:
    numberOfBrokenLinks
}
*/
var coursesWithBrokenLinks = getCoursesWithBrokenLinks(coursesToValidate);

//Use the array of courses with broken links and convert it to a CSV file using d3csv

//Use FS to write the csv file