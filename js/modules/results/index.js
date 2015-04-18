'use strict';

var resultsModule = angular.module('resultsModule', []);

require('./directives/results--directive.js')(resultsModule);
require('./directives/result--directive.js')(resultsModule);
