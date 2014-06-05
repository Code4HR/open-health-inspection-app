open-health-inspection-app
==========================

The frontend for Code for Hampton Roads' Open Health Inspection Data app.  Built using AngularJS and Bootstrap.

__How to contribute__
* You'll need to install NodeJS, which can be found [here](nodejs.org).  
* Run these commands in the project root directory for initial setup:
  * npm install -g grunt-cli
  * npm install
* Run these commands everytime you start work
  * grunt watch 

Now when you make edits to CSS or JS in css/ and js/ folders, they are automatically concatenated and minified in css/build/ and js/build/, respectively.  Images placed in img folder are losslessly optimized and saved to img/build/. 

__Other Stuff__
* gh-pages is the live site.  When issuing a pull request, please ask to merge with the develop branch.

live demo
=========
http://openhealthinspection.com/
