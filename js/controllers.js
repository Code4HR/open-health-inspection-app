/******************
Controllers
******************/	

var openHealthDataAppControllers = angular.module('openHealthDataAppControllers', []);

openHealthDataAppControllers.controller('mapCtrl', ['$scope', '$rootScope', '$http', '$q', 'Geosearch', 'Search',
  function($scope, $rootScope, $http, $q, Geosearch, Search) {

    $scope.map = {
        center: {
            latitude: 36.847010,
            longitude: -76.292430
        },
        zoom: 18
    };

    $scope.dist = 500;

    $scope.showPosition = function(position) {
      $scope.map.center.latitude = position.coords.latitude;
      $scope.map.center.longitude = position.coords.longitude;
      $scope.restaurants = Geosearch.query({lat: $scope.map.center.latitude, lon: $scope.map.center.longitude, dist: $scope.dist});
    }

    $scope.showError = function() {
      console.log("error");
    }

    $scope.getLocation = function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
      } else {
        $scope.error = "Geolocation is not supported by this browser.";
      }
    }

    $scope.getLocation();
    
    $scope.toRad = function(Value) {
        return Value * Math.PI / 180;
    };

    $scope.distanceCalculation = function(input) {

      var lat2 = input.latitude;
      var lon2 = input.longitude;

      var lat1 = $scope.map.center.latitude;
      var lon1 = $scope.map.center.longitude;

      var R = 6378.137; // km
      var dLat = $scope.toRad(lat2-lat1);
      var dLon = $scope.toRad(lon2-lon1);
      lat1 = $scope.toRad(lat1);
      lat2 = $scope.toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;

      return d * 0.62137;
      
    };

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

openHealthDataAppControllers.controller('searchCtrl', ['$scope', '$rootScope', 'Search',
  function($scope, $rootScope, Search){

    $scope.nameSearch = function() {
      console.log("Searching for " + $scope.query + ".");
      Search.results = Search.query({name: $scope.query});
      $rootScope.$broadcast('searchFire');
      
    };

  }]);


openHealthDataAppControllers.controller('searchResultsCtrl', ['$scope', '$rootScope', 'Search', 'Geosearch',
  function($scope, $rootScope, Search, Geosearch){

    $rootScope.$on('searchFire', function(){
      console.log('searchFire heard');
      console.log(Search.results);
      $scope.results = Search.results;
      $rootScope.isVisible = true;
      angular.element('#nottalink').trigger('focus');

    });

    $rootScope.isVisible = false;

    $scope.hasFocus = function(){
      console.log('has focus');
    };

    $scope.lostFocus = function() {
      console.log('lost focus');
      setTimeout( function(){
        console.log('waiting to turn off dropdown');
        $rootScope.isVisible = false;
        console.log($rootScope.isVisible);
        $scope.$apply();
      }, 100);
    };

    
  }]);