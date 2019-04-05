# Canvas-Link-Validator-Runner

## Description
This tool can take a course id or an account id and returns a CSV report with the number of broken links for a single course or an account full of courses.

## Links to Other Docs

- [Project Capture](./docs/ProjectCaptureDoc.md)
- [Key Components](./docs/KeyComponentsDoc.md)

## SetUp / How to Install

Install as a global tool.  No additional set up necessary.

## Important Notes

None.

## How to Use

### API (require as a module)

To use the core logic ```require('canvas-link-validator-runner')```

This will return a method that accepts the following parameters: ```courseId, boundaryDate, courseName```

Here is an example:

Require the validator
```
const linkValidator = require('canvas-link-validator-runner');
```

Use the link validator function. The link validator function takes 3 parameters. 

- ```courseId``` - the courseId of the course you will be getting the broken links from. This will be an integer.
- ```boundaryDate``` - the date which is used to check if we should run the validator again, or if we should just get the results from the last validator. If the date of the boundaryDate is after the date of when the validator was last run for that course (we check the json object, *updated_at* key), then we will run the validator again. This will be a moment.js date.
- ```courseObject``` - any object that contains keys *courseObject.name* (string) for the course name and *courseObject.course_code* (string) for the course code. This is an optional parameter, but providing it will mean 1 less api call to get this information.

```
linkValidator(courseId, boundaryDate[, courseObject])
```

### Command Line

There are two commands that can be run: ```check-links-account``` and ```check-links-course```

#### check-links-account

```
check-links-account <subAccountId>
```

#### check-links-course

```
check-links-course <courseId>
```


