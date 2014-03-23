/****************
App.js
****************/

var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute', 'openHealthDataAppControllers', 'ngAnimate', 'google-maps']);

openHealthDataApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/listView.html',
        controller: 'restaurantListCtrl'
      }).
      when('/restaurants/:id', {
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

openHealthDataAppControllers.controller('restaurantListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('restaurants/restaurants.json').success(function(data) {
      $scope.restaurants = data;
		});

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

    $scope.distanceCalculation = function(input) {

      console.log(input.latitude);
      var lat2 = input.latitude;
      console.log(input.longitude);
      var lon2 = input.longitude;
      console.log($scope.map.center.latitude);
      var lat1 = $scope.map.center.latitude;
      console.log($scope.map.center.longitude);
      var lon2 = $scope.map.center.longitude;

      /*
      var R = 6371; // km
      var dLat = (lat2-lat1).toRad();
      var dLon = (lon2-lon1).toRad();
      var lat1 = lat1.toRad();
      var lat2 = lat2.toRad();

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      */
    };

  }]);

openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
  	$http.get('restaurants/' + $routeParams.id + '.json').success(function(data) {
      $scope.restaurant = data;
      $scope.map.center = $scope.restaurant.center;
    });

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
Views
******************/

        
                             