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
module.exports = function main(boundaryDate, courseId, callback) {

    //Get request to get the data to fill the brokenLinkObject and last run date
    var brokenLinksObject = "";
    var lastRunDate;

    //If the last run date does not exist or is not within the boundary date, run the validator again
    if (lastRunDate >= boundaryDate) {
        //Run Post Request and Poll every 2 seconds or so until the validator is done running

        //Once the validator is done, get a new copy of the brokenLinksObject
        brokenLinksObject = "";

    }

    return Promise.resolve();
};