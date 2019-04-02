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

```
const linkValidator = require('canvas-link-validator-runner');

//TODO add the rest of how to use this function

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


