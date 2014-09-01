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

/****************
App.js
****************/

"use strict";

var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute', 'openHealthDataAppControllers', 'ngAnimate', 'openHealthDataServices', 'openHealthDataAppFilters', 'google-maps']);

openHealthDataApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/vendor/:id', {
        templateUrl: 'partials/restaurantDetailView.html',
        controller: 'restaurantDetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
/******************
Controllers
******************/	

var openHealthDataAppControllers = angular.module('openHealthDataAppControllers', []);

openHealthDataAppControllers.controller('mapCtrl', ['$scope', '$rootScope', '$http', '$q', 'Geosearch', 'Search', '$filter',
  function($scope, $rootScope, $http, $q, Geosearch, Search, $filter) {

    $scope.map =
    Geosearch.map = {
        center: {
            latitude: 36.847010,
            longitude: -76.292430
        },
        zoom: 18, 
        options: { 
            streetViewControl: false,
            panControl: true,
            panControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            styles: [{
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
            },{
                "featureType": "transit",
                "stylers": [{ "visibility": "off" }]
            }]
        }
    };

    console.log(Geosearch.map);

    $scope.dist = 1000;

    $rootScope.showPosition = function(position) {
      Geosearch.map.center.latitude = position.coords.latitude;
      Geosearch.map.center.longitude = position.coords.longitude;
      $scope.results = 
      Geosearch.results = Geosearch.query({lat: $scope.map.center.latitude, lon: $scope.map.center.longitude, dist: $scope.dist}, function(){
        Geosearch.results = _.values(Geosearch.results);
        Geosearch.results.forEach(function(el, index){ 
          console.log(el.dist);
          el.dist = el.dist * 0.000621371;
        });
        Geosearch.results = $filter('orderBy')(Geosearch.results, 'dist');
        $rootScope.$broadcast('geosearchFire');
      });
    }

    $scope.showError = function() {
      console.log("error");
    }

    $rootScope.getLocation = function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
      } else {
        $scope.error = "Geolocation is not supported by this browser.";
      }
    }

    $rootScope.getLocation();
    
    $rootScope.toRad = function(Value) {
        return Value * Math.PI / 180;
    };

    $rootScope.distanceCalculation = function(input) {

      var lat2 = input.latitude;
      var lon2 = input.longitude;

      var lat1 = $scope.map.center.latitude;
      var lon1 = $scope.map.center.longitude;

      var R = 6378.137; // km
      var dLat = $scope.toRad(lat2-lat1);
      var dLon = $scope.toRad(lon2-lon1);
      lat1 = $scope.toRad(lat1);
      lat2 = $scope.toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;

      return d * 0.62137;
      
    };

  }]);

openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope', 'Geosearch', 'Inspections', 
  function($scope, $routeParams, $http, $location, $rootScope, Geosearch, Inspections) {

    $rootScope.isVisible = false;

    $scope.results = Inspections.query({vendorid: $routeParams.id}, function(){
      Geosearch.map.center = $scope.results[$routeParams.id].coordinates;
      setTimeout(function(){
        $scope.$watch(Geosearch.map.center, function(e){
            $location.path('/#');
          }, true);
        }, 1000); 
    });

}]);

openHealthDataAppControllers.controller('searchCtrl', ['$scope', '$rootScope', 'Search', '$filter',
  function($scope, $rootScope, Search, $filter){

    $scope.toggleList = function(){
      console.log('clicked toggleList');
      if ($rootScope.isVisible) {
        $rootScope.isVisible = false;
      } else {
        $rootScope.isVisible = true;
      }
    };

    $scope.toggleSearchField = function(){
      console.log('clicked search button');
      if ($rootScope.isSearchbarVisible) {
        $rootScope.isSearchbarVisible = false;
      } else {
        $rootScope.isSearchbarVisible = true;
      }
    };

    $scope.nameSearch = function() {
      console.log("Searching for " + $scope.query + ".");
      $rootScope.isSearchbarVisible = false;
      Search.results = Search.query({name: $scope.query}, function(){
        Search.results = _.values(Search.results);
        Search.results.forEach(function(el, index){
          if (!_.isUndefined(el.coordinates)) {
            el.dist = $rootScope.distanceCalculation(el.coordinates);
          } else {
            Search.results.splice(index,1);
          }
        });
        Search.results = $filter('orderBy')(Search.results, 'dist');
        $rootScope.$broadcast('searchFire');
      });
    };

  }]);


openHealthDataAppControllers.controller('searchResultsCtrl', ['$scope', '$rootScope', 'Search', 'Geosearch',
  function($scope, $rootScope, Search, Geosearch){

    $rootScope.$on('searchFire', function(){
      console.log('searchFire heard');
      console.log(Search.results);
      $scope.results = Search.results;
      $rootScope.isVisible = true;
      angular.element('#nottalink').trigger('focus');
    });

    $rootScope.$on('geosearchFire', function(){
      console.log('geosearchFire heard');
      console.log(Geosearch.results);
      $scope.results = Geosearch.results;
      $rootScope.isVisible = true;
      angular.element('#nottalink').trigger('focus');
    });

    $scope.map = Geosearch.map;

    // console.log("Geosearch map in search results" + Geosearch.map)

    $rootScope.isVisible = false;

    $scope.hasFocus = function(){

    };

    $scope.lostFocus = function() {
      // console.log('lost focus');
      setTimeout( function(){
        // console.log('waiting to turn off dropdown');
        $rootScope.isVisible = false;
        console.log($rootScope.isVisible);
        $scope.$apply();
      }, 100);
    };

    
  }]);

openHealthDataApp.directive('bindOnce', function() {
    return {
        scope: true,
        link: function( $scope, $element ) {
            setTimeout(function() {
                $scope.$destroy();
            }, 0);
        }
    }
});
angular.module('openHealthDataAppFilters', []).filter('was', function() {
	return function(input) {
		return input ? 'was' : 'wasn\'t';
	}
});
/******************
Models
******************/

var openHealthDataServices = angular.module('openHealthDataServices', ['ngResource']);
 
openHealthDataServices.factory('Inspections', ['$resource',
  function($resource){
    return $resource('http://api.openhealthinspection.com/inspections?vendorid=:vendorid', {}, {
      query: { method: 'JSONP', params: {vendorid: '', callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Geosearch', ['$resource',
  function($resource) {
    return $resource('http://api.openhealthinspection.com/vendors?lat=:lat&lng=:lon&dist=:dist', {}, {
      query: { method: 'JSONP', params: {lat: '36', lon: '-72', dist: '1000', callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Search', ['$resource',
  function($resource) {
    return $resource('http://api.openhealthinspection.com/vendors', {}, {
      query: { method: 'JSONP', params: {callback: 'JSON_CALLBACK'} }
    });
  }]);


/******************
Views
******************/
