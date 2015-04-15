'use strict';

var modalModule = angular.module('geolocationModalModule', []);

require('./modal--controller.js')(modalModule);
require('./modal-instance--controller.js')(modalModule);
