# Project Capture Document for Canvas Link Validator Runner
#### *Author: Ryan Gewondjan*
#### *Stakeholder(s): Corey Moore*
#### *Date: 2019 March 15, 04:30 PM*

## Background

Currently to check for broken links in courses, Corey's team needs to click into each course, navigate to the course link validator tool, run the tool and view the results.  Getting a report of all broken links in all courses will take a long time. This tool is to automate that process.

-----

## Definition of Done

A tool will exist that searches all the courses in the BYU-Idaho Online Master Courses Account (sub account Master Courses) for broken links and returns a CSV report with the number of broken links per each course.


-----

# Requirements

### General Requirements

A report generated that has the number of broken links in each course (for BYU-Idaho Online Master Courses Account, Master Courses Sub Account).

### Input Requirements

#### Source of Inputs

Getting the inputs directly from canvas (api call to get the list of courses).

#### Definition of Inputs

A JSON object with a list of all courses.

---

### Output Requirements
#### Destination

The tool will be given to Corey Moore to use to generate CSV's at will.

#### Definition of Outputs

CSV document with column headers:

Course Code, Course Name (which will be a link to the course validator tool page for that course), number of broken links.

---

### User Interface

#### Type:

CLI with no flags.

-----

## Expectations

### Timeline

No rush, but should have within two weeks tentative deadline (March 29th)

### Best Mode of Contact

Slack/In Person

### Next Meeting

Not set.

### Action Items
<!-- Recap Meeting -->
#### TechOps
Nothing outside of normal design process.

#### Stakeholder
Nothing
-----

#### *Approved By:* 
#### *Approval Date:*
