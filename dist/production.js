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

/****************
App.js
****************/

"use strict";

var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute', 'ui.bootstrap', 'openHealthDataAppControllers', 'ngAnimate', 'openHealthDataServices', 'openHealthDataAppFilters', 'LocalStorageModule']);

openHealthDataApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/vendor/:id', {
        templateUrl: 'partials/restaurantDetailView.html',
        controller: 'restaurantDetailCtrl'
      }).
      when('/', {
        templateUrl: 'partials/searchResultsPreview.html',
        controller: 'searchResultsPreview'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

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

      Geosearch.results = Geosearch.query({
        lat: position.coords.latitude, 
        lon: position.coords.longitude, 
        dist: 300
      }, function() {

        Geosearch.results = _.values(_.reject(Geosearch.results, function(el){
          return _.isUndefined(el.name);
        }));

        Geosearch.results.forEach(function(el, index){
          el.dist = el.dist * 0.000621371;
          el.score = el.score ? Math.round(el.score) : "n/a";
        });

        Geosearch.results = 
          $filter('orderBy')(Geosearch.results, 'dist', false);

        $rootScope.$broadcast('geosearchFire');

      });

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

    $scope.nameSearch = function() {
      console.log("Searching for " + $scope.query + ".");
      $rootScope.isSearchbarVisible = false;

      if (!_.isUndefined(Search.city)) {
        searchQuery = {
          name: $scope.query,
          city: Search.city.name
        }
      } else {
        $scope.searchAreaText = 'This area';
        searchQuery = {
          name: $scope.query,
          lat: Geosearch.coords.latitude,
          lng: Geosearch.coords.longitude,
          dist: 10000
        }
      }

      Search.results = Search.query(searchQuery, function() {

        console.log(Search.results);

        Search.results = _.values(_.reject(Search.results, function(el){
          return _.isUndefined(el.name);
        }));

        if (Search.results.length === 0) {
          alert('no results');
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

openHealthDataApp.directive('bindOnce', function() {
    return {
        scope: true,
        link: function( $scope, $element ) {
            setTimeout(function() {
                $scope.$destroy();
            }, 0);
        }
    }
}).directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        console.log('value=',value);
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
    }
  };
}).directive('twitter', [
  function() {
    return {
      link: function(scope, element, attr) {
        setTimeout(function() {
            twttr.widgets.createShareButton(
            attr.url,
            element[0],
            function(el) {}, {
              count: 'none',
              text: attr.text
            }
          );
        });
      }
    }
  }
]);

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

angular.module('openHealthDataAppFilters', [])
  .filter('was', function() {
  	return function(input) {
  		return input ? 'was' : 'wasn\'t';
  	}
  })
  .filter('categoryIcon', function(){
    return function(input) {
      switch (input) {
        case "Education":
          return "fa fa-graduation-cap";
        case "Hospitality":
          return "fa fa-building";
        case "Restaurant":
          return "fa fa-cutlery";
        case "Grocery":
          return "fa fa-shopping-cart";
        case "Government":
          return "fa fa-university";
        case "Medical":
          return "fa fa-plus-square";
        case "Mobile Food":
          return "fa fa-truck";
        case "Other":
          return "fa fa-spoon";
        default:
          return "fa fa-cutlery";
      }
    };
  })
  .filter('scoreColor', function(){
    return function(score) {
      if (score >= 90) {
        //Green
        return "greenText";
      } else if (score >= 80 && score < 90) {
        //Yellow-Green
        return "yellowGreenText";
      } else if (score >= 70 && score < 80) {
        //Yellow
        return "yellowText";
      } else if (score < 70) {
        //Red
        return "redText";
      } else if (score === 'n/a') {
        return "grayText";
      } else {
        return "grayText";
      }
    }
  })
  .filter('scoreBorder', function(){
    return function(score) {
      if (score >= 90) {
        //Green
        return "greenBorder";
      } else if (score >= 80 && score < 90) {
        //Yellow-Green
        return "yellowGreenBorder";
      } else if (score >= 70 && score < 80) {
        //Yellow
        return "yellowBorder";
      } else if (score < 70) {
        //Red
        return "redBorder";
      } else if (score === 'n/a') {
        return "grayBorder";
      } else {
        return "grayBorder";
      }
    }
  })
  .filter('scoreBadge', function(){
    return function(score) {
      if (score >= 90) {
        //Green
        return "greenBadge";
      } else if (score >= 80 && score < 90) {
        //Yellow-Green
        return "yellowGreenBadge";
      } else if (score >= 70 && score < 80) {
        //Yellow
        return "yellowBadge";
      } else if (score < 70) {
        //Red
        return "redBadge";
      } else if (score === 'n/a') {
        return "grayBadge";
      } else {
        return "grayBadge";
      }
    }
  }).filter('distanceCalculation', function() {

    function toRad(value, position) {
      return value * Math.Pi / 180;
    }

    return function(input, position) {

      // alert(JSON.stringify(input, position));

      var lat2 = input.latitude;
      var lon2 = input.longitude;

      var lat1 = position.latitude;
      var lon1 = position.longitude;

      var R = 6378.137; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      lat1 = toRad(lat1);
      lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;

      return d * 0.62137;
    }
  });

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

var openHealthDataServices = angular.module('openHealthDataServices', ['ngResource']);
 
openHealthDataServices.factory('Inspections', ['$resource',
  function($resource){
    return $resource('http://api.openhealthinspection.com/inspections?vendorid=:vendorid', {}, {
      query: { method: 'JSONP', params: {vendorid: '', callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Geosearch', ['$resource',
  function($resource) {
    return $resource('http://api.openhealthinspection.com/vendors?lat=:lat&lng=:lon&dist=:dist', {}, {
      query: { method: 'JSONP', params: {lat: '36', lon: '-72', dist: '1000', callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Search', ['$resource',
  function($resource) {
    return $resource('http://api.openhealthinspection.com/vendors', {}, {
      query: { method: 'JSONP', params: {callback: 'JSON_CALLBACK'} }
    });
  }]);

