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