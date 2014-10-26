/*
    The frontend for Code for Hampton Roads' Open Health Inspection Data.
    Copyright (C) 2014  Code for Hampton Roads contributors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/******************
Controllers
******************/

var openHealthDataAppControllers = angular.module('openHealthDataAppControllers', []);

openHealthDataAppControllers.controller('mapCtrl', ['$scope', '$rootScope', '$http', '$location', '$q', 'Geosearch', 'Search', '$filter', '$modal', 'localStorageService',
  function($scope, $rootScope, $http, $location, $q, Geosearch, Search, $filter, $modal, localStorageService) {

    $rootScope.$on('$locationChangeSuccess', function() {
        ga('send', 'pageview', $location.path());
    });

    console.log("Screen width", screen.width);

    var calcHeight = angular.element(window).height() - 100 + 64;
      if (screen.width < 776) {
        angular.element('.results').css('max-height' , calcHeight);
      }
      angular.element('.cityResults').css('max-height', calcHeight - 64);

    $rootScope.getLocation = function() {

      console.log('getting location');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          $scope.showPosition,
          $scope.showError
        );
      } else {
        $scope.error = "Geolocation is not supported by this browser.";
      }
    };

    $rootScope.showPosition = function(position) {

      var searchRadii = [500, 1000, 2000, 4000, 8000, 16000, 320000];

      //outside Virginia check.
      //- Latitude  36° 32′ N to 39° 28′ N
      // 36.533333 - 39.466667
      //- Longitude  75° 15′ W to 83° 41′ W
      // 75.25 - 83.683333

      if ( ((position.coords.latitude > 36.533333 ) &&
           (position.coords.latitude < 39.466667 ) )
          &&
          ((position.coords.longitude < -75.25 ) &&
           (position.coords.longitude > -83.683333 ))) {

        console.log('coordinates are within Virgina');

        // Position.coords is only avaible in this scope, share over 
        // Geosearch service
        Geosearch.coords = position.coords;

      } else {

        console.log('Coming from out of state or geolocation unavailable.');
        position.coords = {
          latitude: 36.84687,
          longitude: -76.29228710000001,
        }

      }

      function doSearch(index) {

        Geosearch.results = Geosearch.query({
          lat: position.coords.latitude, 
          lon: position.coords.longitude, 
          dist: searchRadii[index]
        }, function() {

          Geosearch.results = _.values(_.reject(Geosearch.results, function(el){
            return _.isUndefined(el.name);
          }));

          if (Geosearch.results.length < 20) {
            alert('Not many results found within ' + searchRadii[index] + ' Expanding search radius');
            return doSearch(index + 1);
          }

          Geosearch.results.forEach(function(el, index) { 
            el.dist = el.dist * 0.000621371;
            el.score = el.score ? Math.round(el.score) : "n/a";
          });

          Geosearch.results = 
            $filter('orderBy')(Geosearch.results, 'dist', false);

          $rootScope.$broadcast('geosearchFire');

        });
      }

      doSearch(0);

    };

    $scope.showError = function() {
      console.log("Geolocation is not supported by this browser. Fallback to Norfolk");
      $rootScope.showPosition();
    };

    $scope.getLocation();

    $rootScope.toRad = function(Value) {
        return Value * Math.PI / 180;
    };

  }]);

openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope', 'Geosearch', 'Inspections',
  function($scope, $routeParams, $http, $location, $rootScope, Geosearch, Inspections) {

    $rootScope.isVisible = false;

    $scope.results = Inspections.query({vendorid: $routeParams.id}, function(){
      var restaurant = $scope.results[$routeParams.id];
      $rootScope.restaurantName = restaurant.name;
      restaurant.score = !_.isUndefined(restaurant.score) ? Math.round(restaurant.score) : 'n/a';
      $rootScope.restaurantPermalink = $location.absUrl();
    });

}]);

openHealthDataAppControllers.controller('cityJumpCtrl', ['$scope', '$rootScope', 'Search', 'Geosearch', '$http',
  function($scope, $rootScope, Search, Geosearch, $http){

    $rootScope.isCityJumpVisible = false;

    $http.get('js/libs/vaPopCities.json').success(function(data){
      $scope.cities = data;
    });

    $scope.cityJump = function(city) {
      console.log(Search)
      console.log('city center is ', city);
      Search.city = city;
      $rootScope.isCityJumpVisible = false;
      $rootScope.$broadcast('cityJumpFire');
    };

}]);

openHealthDataAppControllers.controller('searchCtrl', ['$scope', '$rootScope', '$timeout', 'Search', 'Geosearch', '$filter',
  function($scope, $rootScope, $timeout, Search, Geosearch, $filter){

    var searchQuery;

    $scope.searchAreaText = 'This area';

    $rootScope.$on('cityJumpFire', function() {
      try {
        $scope.searchAreaText = Search.city.name;
      } 
      catch(e) {
        $scope.searchAreaText = 'Near me';
        Search.city = undefined;
      }
    });

    $rootScope.toggleList = function(){
      console.log('clicked toggleList');
      if ($rootScope.isVisible) {
        $rootScope.isVisible = false;
      } else {
        $rootScope.isCityJumpVisible = false;
        $rootScope.isVisible = true;
      }
    };

    $rootScope.toggleSearchField = function(){
      console.log('clicked search button');
      $rootScope.isSearchbarVisible = !$rootScope.isSearchbarVisible;
      if ($rootScope.isSearchbarVisible === false) {
        $rootScope.isCityJumpVisible = false;
      }
    };

    $rootScope.toggleCityJump = function() {
      $rootScope.isVisible = false;
      $rootScope.isCityJumpVisible = !$rootScope.isCityJumpVisible;
      $rootScope.resultsType = "Look at another city's inspections.";
    }


    var noResults = false;
    var searchRadius = 10000;

    $scope.nameSearch = function() {
      console.log("Searching for " + $scope.query + ".");
      $rootScope.isSearchbarVisible = false;

      if (!_.isUndefined(Search.city)) {
        searchQuery = {
          name: $scope.query,
          city: Search.city.name
        }
      } else if (noResults) {
        $scope.searchAreaText = 'Virginia';
        searchQuery = {
          name: $scope.query
        }
        noResults = false;
      } else {
        $scope.searchAreaText = '< 3 Miles';
        searchQuery = {
          name: $scope.query,
          lat: Geosearch.coords.latitude,
          lng: Geosearch.coords.longitude,
          dist: searchRadius
        }
      }

      Search.results = Search.query(searchQuery, function() {

        console.log(Search.results);

        Search.results = _.values(_.reject(Search.results, function(el){
          return _.isUndefined(el.name);
        }));

        if (Search.results.length === 0) {
          alert('no results');
          noResults = true;
          return $scope.nameSearch();
        }

        Search.results.forEach(function(el, index){
          if (!_.isUndefined(el.coordinates)) {
            
            // alert(JSON.stringify(Geosearch.coords));

            el.dist = $filter('distanceCalculation')(el.coordinates, Geosearch.coords);

            el.score = !_.isUndefined(el.score) &&
                       !_.isNull(el.score) ?
                       Math.round(el.score) : "n/a";
          } else {
            Search.results.splice(index,1);
          }
        });
        Search.results = $filter('orderBy')(Search.results, 'dist', false);
        $rootScope.$broadcast('searchFire');
      });

    };

  }]);

openHealthDataAppControllers.controller('searchResultsPreview',
  ['$scope', '$rootScope', 'Geosearch', 'Inspections', function($scope, $rootScope, Geosearch, Inspections) {

    $rootScope.isVisible = true;    

}]);

openHealthDataAppControllers.controller('searchResultsCtrl', ['$scope', '$rootScope', '$location', 'Search', 'Geosearch',
  function($scope, $rootScope, $location, Search, Geosearch){

    $rootScope.$on('searchFire', function() {
      console.log("Displaying the results of your search, along with our score.");
      $scope.results = Search.results;
      $rootScope.isVisible = true;
      $scope.resultsCount = Search.results.length;

    });

    $rootScope.alerts = [];

    $rootScope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $rootScope.$on('geosearchFire', function(){
      $scope.resultsType = "Displaying results near you, along with our score.";
      $scope.results = Geosearch.results;
      // if ($location.url() === '/') {
      //   $rootScope.isVisible = true;
      // }
    });

    $scope.map = Geosearch.map;

    // console.log("Geosearch map in search results" + Geosearch.map)

    $rootScope.isVisible = false;

  }]);
