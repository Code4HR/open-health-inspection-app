/****************
App.js
****************/

"use strict";

var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute', 'openHealthDataAppControllers', 'ngAnimate', 'openHealthDataServices', 'google-maps']);

openHealthDataApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/listView.html',
        controller: 'restaurantListCtrl'
      }).
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

openHealthDataAppControllers.controller('restaurantListCtrl', ['$scope', '$http', 'Geosearch',
  function($scope, $http, Geosearch) {
    
    /*$http.jsonp('http://api.ttavenner.com/vendors?callback=JSON_CALLBACK').success(function(data) {
      $scope.restaurants = data;
		});*/

    $scope.map = {
        center: {
            latitude: 36.847010,
            longitude: -76.292430
        },
        zoom: 17
    };

    $scope.showPosition = function(position) {
      $scope.map.center.latitude = position.coords.latitude;
      $scope.map.center.longitude = position.coords.longitude;
    }

    $scope.showError = function() {
      console.log("error");
    }

    $scope.getLocation = function(callback){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
      } else {
        $scope.error = "Geolocation is not supported by this browser.";
      }
      callback();
    }

    $scope.getLocation(function(){
      $scope.restaurants = Geosearch.query({lat: $scope.map.center.latitude, lon: $scope.map.center.longitude, dist: 1000});
    });

  }]);

openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {

  	$http.jsonp('http://api.ttavenner.com/inspections/' + $routeParams.id + '?callback=JSON_CALLBACK').success(function(data) {
      $scope.restaurants = data;

      //console.log( $routeParams.id);
      console.log( $scope.restaurants);
    });

    $scope.map = {
        center: {
            latitude: 90.847010,
            longitude: 90.292430
        },
        zoom: 18
    };


  }]);

openHealthDataAppControllers.controller('searchCtrl', ['$scope', 'Search',
  function($scope, Search){

    $scope.nameSearch = function() {
      console.log("Searching for " + $scope.query + ".");
      var searchResults = Search.query({searchString: $scope.query});
      console.log(searchResults);
    }

  }]);
/******************
Models
******************/

var openHealthDataServices = angular.module('openHealthDataServices', ['ngResource']);
 
openHealthDataServices.factory('Vendors', ['$resource',
  function($resource){
    return $resource('http://api.ttavenner.com/vendors', {}, {
      query: { method: 'JSONP', params: {callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Geosearch', ['$resource',
  function($resource) {
    return $resource('http://api.ttavenner.com/vendors/geosearch/:lat/:lon/:dist', {}, {
      query: { method: 'JSONP', params: {lat: '36', lon: '-72', dist: '1000', callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Search', ['$resource',
  function($resource) {
    return $resource('http://api.ttavenner.com/vendors/textsearch/:searchString', {}, {
      query: { method: 'JSONP', params: {searchString: '', callback: 'JSON_CALLBACK'} }
    });
  }]);
/******************
Views
******************/

        
                             