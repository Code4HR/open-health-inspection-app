/******************
Controllers
******************/	

var openHealthDataApp = angular.module('openHealthDataApp', [
	
]);

openHealthDataApp.controller('restaurantListCtrl', function ($scope, $http) {
    
	$http.get('js/restaurants.json').success(function(data) {
		$scope.restaurants = data;
	});

});


/******************
Models
******************/
/******************
Views
******************/

        
                             