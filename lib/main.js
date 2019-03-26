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

function wait(secIn) {
    return new Promise((resolve) => {
        setTimeout(resolve, secIn * 1000);
    })
}

module.exports = function main(inputObject) {
    var boundaryDate = inputObject.boundaryDate;
    var courseId = inputObject.courseId;
    const runValidatorLink = `https://byui.instructure.com/api/v1/courses/${courseId}/link_validation`;
    const validationToolLink = `https://byui.instructure.com/courses/${courseId}/link_validator`;
    var course = canvas.getCourse(courseId);

    return course.get()
        .then(() => {
            //Get the information from the validator api
            return canvas.get(runValidatorLink);
        })
        .then((linkValidationInfo) => {
            //These console logs are good for debugging 
            // console.log(moment(linkValidationInfo.updated_at));
            // console.log(boundaryDate);
            // console.log(moment(linkValidationInfo.updated_at) <= boundaryDate);
            //If the last run date does not exist or is not within the boundary date, run the validator again right now
            return new Promise((resolve, reject) => {
                if (moment(linkValidationInfo.updated_at) <= boundaryDate) {
                    console.log('We need to run the validator again before we get the information!');
                    //Run post request to run validator
                    canvas.post(runValidatorLink)
                        .then(() => {
                            pollForBrokenLinkInformation(Promise.resolve(), 0, resolve);
                        });
                } else {
                    resolve(putTogetherBrokenLinksObject(course.getTitle(), linkValidationInfo));
                }
            });
        });

    //Functions used
    function pollForBrokenLinkInformation(promise, i, resolve) {
        promise.then(() => {
            canvas.get(runValidatorLink)
                .then((linkValidationInfo) => {
                    var done = linkValidationInfo.workflow_state === "completed";
                    i += 1;
                    if (!done && i < 20) {
                        pollForBrokenLinkInformation(wait(5), i, resolve);
                    } else {
                        resolve(putTogetherBrokenLinksObject(course.getTitle(), linkValidationInfo));
                    }
                });

        });
    }

    function putTogetherBrokenLinksObject(courseName, linkValidationInfo) {
        return {
            id: courseId,
            name: courseName,
            link: runValidatorLink,
            brokenLinksCount: getBrokenLinksCount(linkValidationInfo),
            message: linkValidationInfo.workflow_state, //This will probably be changed to the message key of the linkValidationInfo object
            lastRun: moment(linkValidationInfo.updated_at)
        };
    }

    function getBrokenLinksCount(linkValidationInfoObject) {
        //Get the number of broken links from the returned object
        return linkValidationInfoObject.results.issues.reduce((totalSumBrokenLinks, currentIssue) => {
            totalSumBrokenLinks += currentIssue.invalid_links.length;
            return totalSumBrokenLinks;
        }, 0);
    }

}