/*************************************************************************
 * This function takes a date and a courseId and returns an object that
 * looks like this:
 *
 * {
 *   id:
 *   name:
 *   link:
 *   brokenLinksCount:
 *   message:
 * }
 * 
 *************************************************************************/

const moment = require('moment');
const canvas = require('canvas-api-wrapper');

function main(boundaryDate, courseId) {

    const runValidatorLink = `https://byui.instructure.com/api/v1/courses/${courseId}/link_validation`;
    const validationToolLink = `https://byui.instructure.com/courses/${courseId}/link_validator`;
    var course = canvas.getCourse(80);

    return course.get().then(() => {
        var courseTitle = course.getTitle();



    });




    //Get request to get the data to fill the brokenLinkObject and last run date
    var brokenLinksObject = {
        id: courseId,
        name: "placeholder",
        link: validationToolLink,
        brokenLinksCount:


    };
    var lastRunDate;

    //If the last run date does not exist or is not within the boundary date, run the validator again
    if (lastRunDate >= boundaryDate) {
        //Run Post Request and Poll every 2 seconds or so until the validator is done running

        //Once the validator is done, get a new copy of the brokenLinksObject
        brokenLinksObject = "";

    }

};

main(null, 80);