# Key Components Doc for Canvas Link Validator Runner
#### *Author: Ryan Gewondjan*
#### *Date: 2019 March 15, 05:15 PM*
  
## Magic Box Chart

![magic box chart](./images/magicboxes.JPG)


## Explanation of Design

Basically the process is as follows:
- give the CLI an account ID
- The getCourses function will get the list of courses from canvas based on the account id
- That list of ids will then be fed into the getAllBrokenLinks function
- The getAllBrokenLins function will spit out an array (called brokenLinksArray) filled with objects for each course that has a broken link.
    The object will contain: the course id, the course name, the link to the course link validator page, and the number of broken links.
- That brokenLinksArray will then be passed to generate CSV file using d3-csv which will spit out CSV with headers:
  Course Id, Course name (as a hyperlink to the link validation page for the course), and number of broken links.

### Used Libraries

- d3-csv
- canvas api wrapper

## Things to Consider Before Getting Project Approved
- Are there any approved libraries that I can use? [Link to Approved Library List]
- Are there design patterns that will help?  [Link to Design Patterns]
- Can I design it so that it is a general tool instead of a specific solution?
- How can it be easily expanded?
- What does the minimum viable product look like?

## Prep for Learning Phase
- What do I need to learn
- How will I learn it
- What will I do to learn it (prototypes/tutorials/research time limit?)
- What is the definition of done for my learning process
- How do I measure the progress of learning
- Is there a deliverable that can be created during the learning process?

-----

#### *Approved By:* 
#### *Approval Date:*

