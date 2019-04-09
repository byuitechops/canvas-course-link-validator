/*************************************************************************
 * This function takes a courseId (number), a date (moment.js), and optionally a courseObject
 * (which is any object that contains the 'course_code' and 'name' (course name) keys)
 * and returns an object that
 * looks like this:
 *
 * {
 *   id:
 *   name:
 *   courseCode:
 *   link:
 *   publishedBrokenLinksCount:
 *   brokenLinksCount:
 *   message:
 *   lastRun:
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

module.exports = function main(courseId, boundaryDate, courseObject) {

    //Define our links
    //When posting to this link, the validator is run. When getting from this link, the resulting broken links JSON is returned.
    const runValidatorLink = `https://byui.instructure.com/api/v1/courses/${courseId}/link_validation`;
    //This is the link to the UI which shows where all the broken links are. This link is included in the output object.
    const validationToolLink = `https://byui.instructure.com/courses/${courseId}/link_validator`;

    //Set up the course variable in case we need to get the course name.
    var course = canvas.getCourse(courseId);

    //Promises that could run
    var courseObjectPromise = course.get();
    var runValidatorPromise = canvas.get(runValidatorLink);

    //Set up the array of promises to be added to the promise.all. The reason for this is to avoid an extra api call, when the courseObject is provided.
    var promisesToRun = [runValidatorPromise];

    //If the courseObject is not provided, then we'll need to get a courseObject that contains the course_code and the name of the course.
    //So if it's not defined, add making that api call to the promise chain.
    if (courseObject === undefined) {
        console.log("adding second api call to get the course name");
        promisesToRun.push(courseObjectPromise);
    }

    return Promise.all(promisesToRun)
        .then((inputObject) => {
            var linkValidationInfo = inputObject[0];
            //For those times when the courseObject is undefined (its not provided as a parameter), we need to fill that value once the async course.get has completed.
            if (courseObject === undefined) {
                courseObject = course;
            }

            //Helpful for debugging the times
            // console.log(moment(linkValidationInfo.updated_at) <= boundaryDate);
            // console.log(moment(linkValidationInfo.updated_at));
            // console.log(boundaryDate);
            //If the last run date does not exist or is not within the boundary date, run the validator again right now
            return new Promise((resolve, reject) => {
                if (!linkValidationInfo.created_at || moment(linkValidationInfo.updated_at) <= boundaryDate) {
                    console.log(`Running the validator for ${courseObject.name}! This could take some time.`);
                    //Run post request to run validator
                    canvas.post(runValidatorLink)
                        .then(() => {
                            pollForBrokenLinkInformation(courseObject, Promise.resolve(), 0, resolve);
                        });
                } else {
                    resolve(putTogetherBrokenLinksObject(courseObject, linkValidationInfo));
                }
            });
        });

    /***********************************************
     * pollForBrokenLinkInformation
     * This function has the following inputs
     * @param courseObject (the object that has the course_code and name)
     * @param promise (this is the next promise to add to the chain)
     * @param i (this is an increment variable used so that we do not run forever (we eventually timeout))
     * @param resolve (As this function is called from within a new promise, the resolve method is passed to this
     * function to be called when we are done chaining promises)
     * 
     * @returns does not return any value, the way out of this function is through the resolve method.
     ***********************************************/
    function pollForBrokenLinkInformation(courseObject, promise, i, resolve) {
        //Starting with the promise provided as a parameter, chain to the next promise which is checking to 
        //see if the link validator has completed its checks and returned with the completed status
        promise.then(() => {
            canvas.get(runValidatorLink)
                .then((linkValidationInfo) => {
                    var done = linkValidationInfo.workflow_state === "completed";
                    //We increment and check to see if the incremented variable is under a certain threshold because we do not want
                    //to run forever if we somehow get into a state of not being able to be done.
                    i += 1;
                    if (!done && i < 200) {
                        //If we are not done, keep the process going. Wait for 5 seconds and try again.
                        pollForBrokenLinkInformation(courseObject, wait(5), i, resolve);
                    } else if (done) {
                        //If we are done, then resolve
                        resolve(putTogetherBrokenLinksObject(courseObject, linkValidationInfo, false));
                    } else {
                        //If we are in here then the time has elapsed without us reaching the completion status, so we'll mark the timedOut parameter as true
                        resolve(putTogetherBrokenLinksObject(courseObject, linkValidationInfo, true));
                    }
                });

        });
    }

    /***********************************************
     * putTogetherBrokenLinksObject
     * @param courseObject (an object with the course_code and name keys)
     * @param linkValidationInfo the object returned by sending a get request to the runValidatorLink url
     * @param timedOut (a boolean that lets us know if we have timed out or not)
     * 
     * @returns the output object that will eventually be used to generate reports, etc.
     ***********************************************/
    function putTogetherBrokenLinksObject(courseObject, linkValidationInfo, timedOut) {

        //Get the broken links count object. It looks like this:
        /*
            {
                totalBrokenLinks: <count>,
                publishedBrokenLinks: <count>
            }
        */
        var brokenLinksCountObject = getBrokenLinksCount(linkValidationInfo);

        //Return the object that will be used to generate a CSV (or could be used to generate any type of output)
        return {
            id: courseId,
            name: courseObject.name,
            courseCode: courseObject.course_code,
            link: validationToolLink,
            publishedBrokenLinksCount: brokenLinksCountObject.publishedBrokenLinks,
            brokenLinksCount: brokenLinksCountObject.totalBrokenLinks,
            message: (!timedOut) ? linkValidationInfo.workflow_state : "Validator Timed Out, Run again", //This could be changed to the message key of the linkValidationInfo object. I wasn't sure which key would be the most relevant to contain an error message.
            lastRun: moment(linkValidationInfo.updated_at)
        };
    }

    /***********************************************
     * getBrokenLinksCount
     * @param linkValidationInfoObject (the object returned by sending a get request to the runValidatorLink url)
     * @param timedOut (a boolean that lets us know if we have timed out or not)
     * 
     * @returns an object that contains the totalBrokenLinks and publishedBrokenLinks keys 
     * with their corresponding counts as their values
     ***********************************************/
    function getBrokenLinksCount(linkValidationInfoObject, timedOut) {
        //Get the count of broken links, but only get the count if we haven't timed out.
        //If we have timed out, we won't have the information we need to get the counts, so give an object whose
        //values indicate that we timed out.
        if (timedOut) {
            return {
                totalBrokenLinks: "timedOut",
                publishedBrokenLinks: "timedOut"
            };
        }

        //Get the number of broken links from the returned object
        return linkValidationInfoObject.results.issues.reduce((brokenLinksSumObject, currentIssue) => {
            //Get the total number of broken links for the course
            brokenLinksSumObject.totalBrokenLinks += currentIssue.invalid_links.length;

            //Filter to only the published broken links
            arrayOfPublishedInvalidLinks = currentIssue.invalid_links.filter((invalidLink) => {
                return (invalidLink.reason !== 'unpublished_item');
            });

            //Get the total number of published broken links
            brokenLinksSumObject.publishedBrokenLinks += arrayOfPublishedInvalidLinks.length;

            //Return the brokenLinksSumObject (only has two keys: totalBrokenLinks and publishedBrokenLinks)
            return brokenLinksSumObject;
        }, {
            totalBrokenLinks: 0,
            publishedBrokenLinks: 0
        });
    }




}