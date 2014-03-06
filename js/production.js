/****************
App.js
****************/

var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute', 'openHealthDataAppControllers']);

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
    $http.get('js/restaurants.json').success(function(data) {
      $scope.restaurants = data;
    });

  }]);

openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.id = $routeParams.id;
  }]);
/******************
Models
******************/
/******************
Views
******************/

        
                             