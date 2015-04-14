/*
    The frontend for Code for Hampton Roads' Open Health Inspection Data.
    Copyright (C) 2014  Code for Hampton Roads contributors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*global angular */

'use strict';

var openHealthDataAppControllers =
  angular.module('openHealthDataAppControllers', []);

var openHealthDataApp = angular.module('openHealthDataApp', [
  'ngRoute',
  'ui.bootstrap',
  'openHealthDataAppControllers',
  'openHealthDataServices',
  'openHealthDataAppFilters',
  'ngTouch',
  'geocodeModule',
  'geolocationModule',
  'resultsModule',
  'geolocationModal'
]);

openHealthDataApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/vendor/:id', {
        templateUrl: 'partials/restaurantDetailView.html',
        controller: 'restaurantDetailCtrl'
      }).
      when('/', {
        templateUrl: 'partials/searchResultsPreview.html',
        controller: 'searchResultsPreview'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

openHealthDataApp.run([
  '$rootScope',
  '$location',
  function($rootScope, $location) {

    $rootScope.$on('$locationChangeSuccess', function() {
        ga('send', 'pageview', $location.path());
    });

}]);
