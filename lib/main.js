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

//TODO add note about courseName how you don't need to add it
//Also define each of the parameters
module.exports = function main(courseId, boundaryDate, courseName) {

    const runValidatorLink = `https://byui.instructure.com/api/v1/courses/${courseId}/link_validation`;
    const validationToolLink = `https://byui.instructure.com/courses/${courseId}/link_validator`;

    //Set up the course variable in case we need to get the course name.
    var course = canvas.getCourse(courseId);

    //Promises that could run
    var courseNamePromise = course.get();
    var runValidatorPromise = canvas.get(runValidatorLink);

    //Set up the array of promises to be added to the promise.all. The reason for this is to avoid an extra api call, when the courseName is provided.
    var promisesToRun = [runValidatorPromise];

    //If the courseName is not provided, then we'll need to get it, so add making that api call to the promise chain.
    if (courseName === undefined) {
        console.log("adding second api call to get the course name");
        promisesToRun.push(courseNamePromise);
    }

    return Promise.all(promisesToRun)
        .then((inputObject) => {
            var linkValidationInfo = inputObject[0];
            //For those times when the courseName is undefined (its not provided as a parameter), we need to fill that value once the async course.get has completed.
            if (courseName === undefined) {
                courseName = course.getTitle();
            }

            //If the last run date does not exist or is not within the boundary date, run the validator again right now
            return new Promise((resolve, reject) => {
                if (!linkValidationInfo.created_at || moment(linkValidationInfo.updated_at) <= boundaryDate) {
                    console.log('We need to run the validator again before we get the information! This could take some time.');
                    //Run post request to run validator
                    canvas.post(runValidatorLink)
                        .then(() => {
                            pollForBrokenLinkInformation(courseName, Promise.resolve(), 0, resolve);
                        });
                } else {
                    resolve(putTogetherBrokenLinksObject(courseName, linkValidationInfo));
                }
            });
        });

    //Functions used
    function pollForBrokenLinkInformation(courseName, promise, i, resolve) {
        promise.then(() => {
            canvas.get(runValidatorLink)
                .then((linkValidationInfo) => {
                    var done = linkValidationInfo.workflow_state === "completed";
                    i += 1;
                    if (!done && i < 200) {
                        pollForBrokenLinkInformation(courseName, wait(5), i, resolve);
                    } else if (done) {
                        resolve(putTogetherBrokenLinksObject(courseName, linkValidationInfo, false));
                    } else {
                        //If we are in here then the time has elapsed without us reaching the completion status, so we'll mark the timedOut parameter as true
                        resolve(putTogetherBrokenLinksObject(courseName, linkValidationInfo, true));
                    }
                });

        });
    }

    function putTogetherBrokenLinksObject(courseName, linkValidationInfo, timedOut) {
        return {
            id: courseId,
            name: courseName,
            link: validationToolLink,
            brokenLinksCount: (!timedOut) ? getBrokenLinksCount(linkValidationInfo) : "",
            message: (!timedOut) ? linkValidationInfo.workflow_state : "Validator Timed Out, Run again", //This could be changed to the message key of the linkValidationInfo object. I wasn't sure which key would be the most relevant to contain an error message.
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