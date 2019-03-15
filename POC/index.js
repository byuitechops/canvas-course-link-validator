// https://byui.instructure.com/api/v1/courses/80/link_validation
var canvas = require('canvas-api-wrapper'),
pretty = require('json-stringify-pretty-compact');

async function wait(secIn){
    return new Promise((resolve) =>{
        setTimeout(resolve, secIn *1000);
    })
}

async function main(courseId){
    var badLinks = await canvas.post(`https://byui.instructure.com/api/v1/courses/${courseId}/link_validation`)
    var done = false;
    var i = 0;
    while(!done && i < 20){
        var badLinks = await canvas.get(`https://byui.instructure.com/api/v1/courses/${courseId}/link_validation`)
        console.log(pretty(badLinks));
        done = badLinks.workflow_state === "completed";
        i += 1
        console.log("i:",i);
        await wait(5);
    }
    console.log(pretty(badLinks));
    
}
main(80);
