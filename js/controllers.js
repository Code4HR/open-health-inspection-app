/******************
Controllers
******************/	

var openHealthDataAppControllers = angular.module('openHealthDataAppControllers', []);

openHealthDataAppControllers.controller('restaurantListCtrl', ['$scope', '$http', 'Geosearch', 'Data',
  function($scope, $http, Geosearch, Data) {

    $scope.query = Data;

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

    $scope.getLocation = function(callback){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
      } else {
        $scope.error = "Geolocation is not supported by this browser.";
      }
      callback();
    }

    $scope.getLocation(function(){
      $scope.restaurants = Geosearch.query({lat: $scope.map.center.latitude, lon: $scope.map.center.longitude, dist: 1000});
    });

  }]);

openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {

  	$http.jsonp('http://api.ttavenner.com/inspections/' + $routeParams.id + '?callback=JSON_CALLBACK').success(function(data) {
      $scope.restaurants = data;

      //console.log( $routeParams.id);
      console.log( $scope.restaurants);
    });

    $scope.map = {
        center: {
            latitude: 90.847010,
            longitude: 90.292430
        },
        zoom: 18
    };


  }]);

openHealthDataAppControllers.controller('searchCtrl', ['$scope', 'Search', 'Data'
  function($scope, Search, Data){

    $scope.nameSearch = function() {
      console.log("Searching for " + $scope.query + ".");
      var searchResults = Search.query({searchString: $scope.query});
      console.log(searchResults);
    }

    $scope.query = Data;

  }]);