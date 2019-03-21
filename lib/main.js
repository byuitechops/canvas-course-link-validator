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

    return course.get()
        .then(() => {
            //Get the information from the validator api
            return canvas.get(runValidatorLink);
        })
        .then((linkValidationInfo) => {
            // Create the brokenLinksObject
            return {
                id: courseId,
                /* Gets the title of the course */
                name: course.getTitle(),
                link: validationToolLink,
                brokenLinksCount: getBrokenLinksCount(linkValidationInfo),
                message: linkValidationInfo.workflow_state, //This will probably be changed to the message key of the linkValidationInfo object
                lastRun: moment(linkValidationInfo.updated_at)
            };
        })
        .then((brokenLinksObject) => {
            //If the last run date does not exist or is not within the boundary date, run the validator again right now
            // console.log(brokenLinksObject.lastRun);
            // console.log(boundaryDate);
            // console.log(brokenLinksObject.lastRun >= boundaryDate);
            if (brokenLinksObject.lastRun <= boundaryDate) {
                console.log('we are going to run again');

                //Run post request to run validator

                //Get the information from the object again

                //Once the validator is done, update the brokenLinksObject


            } else {
                return brokenLinksObject;
            }

        });
}

function getBrokenLinksCount(linkValidationInfoObject) {
    //Get the number of broken links from the returned object
    return linkValidationInfoObject.results.issues.reduce((totalSumBrokenLinks, currentIssue) => {
        totalSumBrokenLinks += currentIssue.invalid_links.length;
        return totalSumBrokenLinks;
    }, 0);
}

main(moment(), 80);