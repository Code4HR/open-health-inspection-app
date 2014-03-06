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
    