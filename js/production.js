var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute', 'openHealthDataApp']);

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

openHealthDataApp.controller('restaurantListCtrl', function ($scope, $http) {
    
	$http.get('js/restaurants.json').success(function(data) {
		$scope.restaurants = data;
	});

});

openHealthDataApp.controller('restaurantDetailCtrl', ['$scope', '$http', function($scope, $routeParams) {
    $scope.id = $routeParams.id;
}]);
    
/******************
Models
******************/
/******************
Views
******************/

        
                             