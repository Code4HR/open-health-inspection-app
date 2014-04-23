/******************
Controllers
******************/	

var openHealthDataAppControllers = angular.module('openHealthDataAppControllers', []);

openHealthDataAppControllers.controller('restaurantListCtrl', ['$scope', '$rootScope', '$http', 'Geosearch', 'Data', 'Search',
  function($scope, $rootScope, $http, Geosearch, Data, Search) {

    $scope.query = Data.query;

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

    $scope.getLocation(function(){});

    $scope.restaurants = Geosearch.query({lat: $scope.map.center.latitude, lon: $scope.map.center.longitude, dist: 1000});


    $rootScope.$on('searchFire', function(){
      console.log('searchFire heard.');
      console.log('Searching for ' + Data.query);
      $scope.restaurants = Search.query({searchString: Data.query});
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

openHealthDataAppControllers.controller('searchCtrl', ['$scope', '$rootScope', 'Search', 'Data',
  function($scope, $rootScope, Search, Data){

    $scope.nameSearch = function() {
      console.log("Searching for " + $scope.query + ".");
      Data.query = $scope.query;
      $rootScope.$broadcast('searchFire');
    }

    $scope.query = Data.query;

  }]);