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
            //These console logs are good for debugging 
            // console.log(moment(linkValidationInfo.updated_at));
            // console.log(boundaryDate);
            // console.log(moment(linkValidationInfo.updated_at) <= boundaryDate);
            //If the last run date does not exist or is not within the boundary date, run the validator again right now
            return new Promise((resolve, reject) => {
                if (!linkValidationInfo.created_at || moment(linkValidationInfo.updated_at) <= boundaryDate) {
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
            link: validationToolLink,
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