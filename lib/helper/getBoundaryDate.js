const enquirer = require('enquirer');
const moment = require('moment');

module.exports = function getBoundaryDate() {
    return new Promise((resolve, reject) => {
        enquirer.prompt({
            type: 'select',
            name: 'boundaryDate',
            message: "Get Broken Links Data from Running Validator: ",
            choices: [{
                name: moment(),
                message: 'Now',
            }, {
                name: moment().subtract(7, 'days'),
                message: 'within past week',
            }, {
                name: moment().subtract(14, 'days'),
                message: 'within past two weeks',
            }, {
                name: moment().subtract(1, 'months'),
                message: 'within past month',
            }]
        }).then((answers) => {
            resolve(answers.boundaryDate);
        }).catch((err) => console.log(err));
    });

}