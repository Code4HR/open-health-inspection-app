/****************
App.js
****************/

var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute', 'openHealthDataAppControllers', 'google-maps']);

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
    
    $scope.mapHeight = "innerHeight" in window 
      ? window.innerHeight
      : document.documentElement.offsetHeight; 

  }]);

openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
  	$http.get('restaurants/' + $routeParams.id + '.json').success(function(data) {
      $scope.restaurant = data;
    });
                                                               
    $scope.map = {
        center: {
            latitude: 35.154343,
            longitude: -81.862407
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

        
                             