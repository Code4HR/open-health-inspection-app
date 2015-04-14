'use strict';

var modalModule = angular.module('geolocationModal', []);

require('./modal--controller.js')(modalModule);
require('./modal-instance--controller.js')(modalModule);
