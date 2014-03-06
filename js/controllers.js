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