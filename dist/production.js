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

    $scope.map =
    Geosearch.map = {
        center: {
            latitude: 36.847010,
            longitude: -76.292430
          },
        zoom: 18,
        options: {
            streetViewControl: false,
            panControl: true,
            panControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            styles: [{
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
            },{
                "featureType": "transit",
                "stylers": [{ "visibility": "off" }]
            }]
        }
    };

    // console.log(Geosearch.map);

    $scope.dist = 1000;

    $rootScope.showPosition = function(position) {

        //outside Virginia check.
        //- Latitude  36° 32′ N to 39° 28′ N
        // 36.533333 - 39.466667
        //- Longitude  75° 15′ W to 83° 41′ W
        // 75.25 - 83.683333

      if (_.isUndefined(position)) {

        console.log('Geolocation unavailable');

      } else {

        if ( ((position.coords.latitude > 36.533333 ) &&
             (position.coords.latitude < 39.466667 ) )
            &&
            ((position.coords.longitude < -75.25 ) &&
             (position.coords.longitude > -83.683333 ))) {

          console.log('coordinates are within Virgina');

          if (!_.isUndefined(position)) {
            Geosearch.map.center.latitude = position.coords.latitude;
            Geosearch.map.center.longitude = position.coords.longitude;
          }

        } else {
          console.log('Coming from out of state, so falling back to Norfolk.');
        }

      }

      $scope.results =
      Geosearch.results = Geosearch.query({lat: $scope.map.center.latitude, lon: $scope.map.center.longitude, dist: $scope.dist}, function(){

          Geosearch.results = _.values(_.reject(Geosearch.results, function(el){
            return _.isUndefined(el.name);
          }));

          Geosearch.results.forEach(function(el, index){
            el.dist = el.dist * 0.000621371;
            el.score = el.score ? Math.round(el.score) : "n/a";
          });

          Geosearch.results = $filter('orderBy')(Geosearch.results, 'dist', false);
          $rootScope.$broadcast('geosearchFire');

      });

    };

    $scope.showError = function() {
      console.log("Geolocation is not supported by this browser. Fallback to Norfolk");
      $rootScope.showPosition();

    };

    $rootScope.getLocation = function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
      } else {
        $scope.error = "Geolocation is not supported by this browser.";
      }
    };

    $rootScope.getLocation();

    $rootScope.toRad = function(Value) {
        return Value * Math.PI / 180;
    };

    $rootScope.distanceCalculation = function(input) {

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

    $rootScope.open = function (size) {

      // console.log('open modal');
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal.html',
        controller: ModalInstanceCtrl,
        size: size,
        windowClass: 'modalContainer',
        backdrop: false,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $rootScope.close = function(){
          modalInstance.close();
        }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };

    if ($location.url() === '/') {
      $scope.open();
    }

  }]);

var ModalInstanceCtrl = function ($rootScope, $scope, $modalInstance, items, localStorageService) {

  $scope.ok = function () {

    if ($rootScope.dontshow ) {
      localStorageService.set('Has Read', 'true');
      console.log(localStorageService.get('Has Read'));
    }
    $modalInstance.close();

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope', 'Geosearch', 'Inspections',
  function($scope, $routeParams, $http, $location, $rootScope, Geosearch, Inspections) {

    $rootScope.isVisible = false;

    $scope.results = Inspections.query({vendorid: $routeParams.id}, function(){
      var restaurant = $scope.results[$routeParams.id];
      Geosearch.map.center = restaurant.coordinates;
      $rootScope.restaurantName = restaurant.name;
      restaurant.score = restaurant.score ? Math.round(restaurant.score) : 'n/a';
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

    $scope.searchAreaText = 'my area';

    $rootScope.$on('cityJumpFire', function() {
      $scope.searchAreaText = Search.city.name;
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
    };

    $rootScope.toggleCityJump = function() {
      $rootScope.isVisible = false;
      $rootScope.isCityJumpVisible = !$rootScope.isCityJumpVisible;
      $rootScope.resultsType = "Look at another city's inspections.";
    }

    $scope.nameSearch = function() {
      console.log("Searching for " + $scope.query + ".");
      $rootScope.isSearchbarVisible = false;

      if (Search.city) {
        searchQuery = {
          name: $scope.query,
          city: Search.city.name
        }
      } else {
        searchQuery = {
          name: $scope.query,
          lat: Geosearch.map.center.latitude,
          lng: Geosearch.map.center.longitude,
          dist: 10000
        }
      }

      Search.results = Search.query(searchQuery, function() {

        console.log(Search.results);

        Search.results = _.values(_.reject(Search.results, function(el){
          return _.isUndefined(el.name);
        }));

        if (Search.results.length === 0) {
          $rootScope.alerts.push({type:'danger', msg:'Couldn\'t find any results!'});
          $timeout(function(){
            $rootScope.alerts.pop();
          }, 3000, true);
        }

        Search.results.forEach(function(el, index){
          if (!_.isUndefined(el.coordinates)) {
            el.dist = $rootScope.distanceCalculation(el.coordinates);
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


openHealthDataAppControllers.controller('searchResultsCtrl', ['$scope', '$rootScope', '$location', 'Search', 'Geosearch',
  function($scope, $rootScope, $location, Search, Geosearch){

    $rootScope.$on('searchFire', function(){
      $scope.resultsType = "Displaying the results of your search, along with our score."
      $scope.results = Search.results;
      $rootScope.isVisible = true;
    });

    $rootScope.alerts = [];

    $rootScope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $rootScope.$on('geosearchFire', function(){
      $scope.resultsType = "Displaying results near you, along with our score.";
      $scope.results = Geosearch.results;
      if ($location.url() === '/') {
        $rootScope.isVisible = true;
      }
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
  .filter('scoreBadge', function(){
    return function(score){
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

