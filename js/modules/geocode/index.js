'use strict';

var geocodeModule = angular.module('geocodeModule', []);

require('./geocode--service.js')(geocodeModule);
require('./geocode--directive.js')(geocodeModule);
