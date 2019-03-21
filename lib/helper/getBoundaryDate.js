const enquirer = require('enquirer');
const moment = require('moment');

module.exports = function getBoundaryDate() {
    var today = moment();
    return new Promise((resolve, reject) => {
        enquirer.prompt({
            type: 'select',
            name: 'boundaryDate',
            message: "Get Broken Links Data from Running Validator: ",
            choices: [{
                name: today,
                message: 'Now',
            }, {
                name: today.subtract(7, 'days'),
                message: 'within past week',
            }, {
                name: today.subtract(14, 'days'),
                message: 'within past two weeks',
            }, {
                name: today.subtract(1, 'months'),
                message: 'within past month',
            }]
        }).then((answers) => {
            resolve(answers.boundaryDate);
        }).catch((err) => console.log(err));
    });

}