open-health-inspection-app
==========================

The reference app built against Code for Hampton Roads' Open Health Inspection API.  Built using AngularJS.  Open Health Inspection allows users to quickly find health inspection information for their favorite restaurants.

The app lives at:
http://openhealthinspection.com/

The prerelease branch (next) lives at;
http://next.openhealthinspection.com/

How to get up and running
---
```
git clone git@github.com:c4hrva/open-health-inspection-app.git
cd open-health-inspection-app
npm install -g grunt-cli
npm install
grunt
```

Grunt is being used to run a local hosting environment, which opens a browser and watches the project folder for changes.

OHI follows [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/).  When you're ready to submit your changes, please open a pull request to the 'next' branch for review.

Our Strider CD instance is [here](http://cd.ttavenner.com/c4hrva/open-health-inspection-app/).

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
