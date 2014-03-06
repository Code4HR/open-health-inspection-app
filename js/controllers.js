/******************
Controllers
******************/	

var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute']);

openHealthDataApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('#/', {
        templateUrl: 'index.html',
        controller: 'restaurantListCtrl'
      }).
      when('#/restaurants/', {
        templateUrl: 'restaurantview.html',
        controller: 'restaurantDetailCtrl'
      }).
      otherwise({
        redirectTo: '#/'
      });
  }]);

openHealthDataApp.controller('restaurantListCtrl', function ($scope, $http) {
    
	$http.get('js/restaurants.json').success(function(data) {
		$scope.restaurants = data;
	});

});

openHealthDataApp.controller('restaurantDetailCtrl', function ($scope, $http) {
    


});