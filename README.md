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
