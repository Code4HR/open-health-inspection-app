open-health-inspection-app
==========================

The frontend for Code for Hampton Roads' Open Health Inspection Data app.  Built using Angular, Bootstrap, and jQuery.

__How to contribute__
* You'll need to install NodeJS, which can be found [here](nodejs.org).  
* Run these commands in the project root directory for initial setup:
  * npm install -g grunt-cli
  * npm install
* Run these commands everytime you start work
  * grunt watch

Now when you make edits to CSS or JS in css/ and js/ folders, they are automatically concatenated and minified in css/build/ and js/build/, respectively.  Images placed in img folder are losslessly optimized and saved to img/build/.

live demo
=====
a live demo of the app

http://openhealthinspection.com/

Installation
---

```
git clone git@github.com:c4hrva/open-health-inspection-app.git
npm install -g grunt-cli
npm install
grunt server
#navigate to http://localhost:9090
```
Scoring System
===
First the fine print:
This scoring system was designed by volunteers at Code for Hampton Roads. It was not provided by the Virginia Department of Health and should not be considered official. These scores are for informational purposes only.

Now the nitty gritty:
---
Each inspection contains a score based on the number of violations found during that inspection. An inspection starts with a maximum score of 100. For each violation found points are deducted or added based on the following criteria:

- 2 points minimum for the violation
- an additional 1.5 points if it is a critical violation
- an additional 1.5 points if it is a repeat violation
- Finally 1/2 a point is added to the score if a violation is corrected during the inspection.

The total score for each vendor is made up of the scores for each of their three most recent inspections.
- 60% of the score comes from the most recent
- 30% of the score comes from the second most recent
- 10% of the score comes from the third most recent
