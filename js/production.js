/****************
App.js
****************/

"use strict";

var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute', 'openHealthDataAppControllers', 'openHealthDataAppServices', 'ngAnimate', 'google-maps']);

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

openHealthDataAppControllers.controller('restaurantListCtrl', ['$scope', 'Vendors',
  function($scope, Vendors) {

    $scope.restaurants = Vendors.query();

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

    $scope.getLocation = function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError)
      } else {
        $scope.error = "Geolocation is not supported by this browser.";
      }
    }

    $scope.getLocation();

    //distance calculation

    $scope.toRad = function(Value) {
       return Value * Math.PI / 180;
    };

    $scope.distanceCalculation = function(input) {

      var lat2 = input.latitude;
      var lon2 = input.longitude;
      //var lat2 = input[0];
      //var lon2 = input[1];
      var lat1 = $scope.map.center.latitude;
      var lon1 = $scope.map.center.longitude;

      var R = 6371; // km
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

openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope', '$routeParams', 'Vendor',
  function($scope, $routeParams, Vendor) {

    $scope.restaurants = Vendor.query({vendor_id: $routeParams.id});

    $scope.map = {
        center: {
            latitude: 90.847010,
            longitude: 90.292430
        },
        zoom: 18
    };

  }]);
/******************
Models
******************/

/******************
Services
******************/

var openHealthDataAppServices = angular.module('openHealthDataAppServices', ['ngResource']);
 
//Get a list of all vendors     
openHealthDataAppServices.factory('Vendors', ['$resource', '$routeParams', function($resource){
	return $resource('http://api.ttavenner.com/vendors/', {}, {
		query: { method:'JSONP', params: {callback: 'JSON_CALLBACK'} },
	});
}]);

//get violation information specific to a vendor
openHealthDataAppServices.factory('Vendor', ['$resource', '$routeParams', function($resource){
	return $resource('http://api.ttavenner.com/vendor/:vendor_id', {}, {
		query: { method:'JSONP', params: {vendor_id: '/', callback: 'JSON_CALLBACK'} },
	});
}]);

//make search by search string
openHealthDataAppServices.factory('Search', ['$resource', '$routeParams', function($resource){
	return $resource('http://api.ttavenner.com/vendors/:search_string', {}, {
		query: { method:'JSONP', params: {search_string: '/', callback: 'JSON_CALLBACK'} },
	});
}]);

//get inspections by vendor.
openHealthDataAppServices.factory('Inspections', ['$resource', '$routeParams', function($resource){
	return $resource('http://api.ttavenner.com/inspections/:vendor_id', {}, {
		query: { method:'JSONP', params: {vendor_id: '/', callback: 'JSON_CALLBACK'} },
	});
}]);

//get inspections by location.
openHealthDataAppServices.factory('Geosearch', ['$resource', '$routeParams', function($resource){
	return $resource('http://api.ttavenner.com/vendors/geosearch/:lng/:lat/:dist', {}, {
		query: { method:'JSONP', params: {lat: '36.847010', lng: '-76.292430', dist: '5000', callback: 'JSON_CALLBACK'} },
	});
}]);
/******************
Views
******************/

        
                             