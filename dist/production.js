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

/*global angular */

/****************
App.js
****************/

'use strict';

var openHealthDataApp = angular.module('openHealthDataApp', ['ngRoute',
  'ui.bootstrap', 'openHealthDataAppControllers', 
  'openHealthDataServices', 'openHealthDataAppFilters', 'ngTouch']);

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

/*global _, angular, ga*/


/******************
Controllers
******************/

'use strict';

var openHealthDataAppControllers = 
  angular.module('openHealthDataAppControllers', []);

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
        // console.log('value=',value);
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

/*global angular*/

'use strict';

var openHealthDataServices = angular.module('openHealthDataServices',
['ngResource']);
 
openHealthDataServices.factory('Inspections', ['$resource',
  function($resource){
    return $resource('http://api.openhealthinspection.com/' +
      'inspections?vendorid=:vendorid', {}, {
      query: { 
        method: 'JSONP',
        params: {
          vendorid: '',
          callback: 'JSON_CALLBACK'
        } 
      }
    });
  }]);

openHealthDataServices.factory('Geolocation', ['$q', '$timeout', function($q, $timeout) {
  return {

    getPosition: function() {

      var deferred = $q.defer();

      $timeout(countdown, 10000);

      function countdown() {
        deferred.reject('The request to get user location timed out.');
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          $timeout.cancel(countdown);
          deferred.resolve(position);
        },
        function(error) {

          $timeout.cancel(countdown);

          var errorCode;
          switch(error.code) {
            case error.PERMISSION_DENIED:
                errorCode = 'User denied the request for Geolocation.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorCode = 'Location information is unavailable.';
                break;
            case error.TIMEOUT:
                errorCode = 'The request to get user location timed out.';
                break;
            case error.UNKNOWN_ERROR:
                errorCode = 'An unknown error occurred.';
                break;
          }

          deferred.reject(errorCode);
      
        });
        return deferred.promise;
      }
    }
  };
}]);

openHealthDataServices.factory('Geosearch', ['$resource',
  function($resource) {
    return $resource('http://api.openhealthinspection.com/' +
      'vendors?lat=:lat&lng=:lon&dist=:dist', {}, {
      query: {
        method: 'JSONP',
        params: {
          lat: '36',
          lon: '-72',
          dist: '1000',
          callback: 'JSON_CALLBACK'} 
        }
    });
  }]);

openHealthDataServices.factory('Search', ['$resource',
  function($resource) {
    return $resource('http://api.openhealthinspection.com/vendors', {}, {
      query: { 
        method: 'JSONP',
        params: {
          callback: 'JSON_CALLBACK'
        } 
      }
    });
  }]);

openHealthDataServices.factory('Toast', function() {
  return {
    query: '',
    searchAreaText: '',
  };
});




openHealthDataAppControllers.controller('cityJumpCtrl', ['$scope',
  '$rootScope', 'Search', 'Geosearch', '$http', function($scope, $rootScope,
  Search, Geosearch, $http) {

    $rootScope.isCityJumpVisible = false;

    $http.get('js/libs/vaPopCities.json').success(function(data){
      $scope.cities = data;
    });

    $scope.cityJump = function(city) {
      $rootScope.toggleCityJump(false);
      console.log(Search);
      console.log('city center is ', city);
      Search.city = city;
      $rootScope.isCityJumpVisible = false;
      $rootScope.$broadcast('cityJumpFire');
    };

}]);
openHealthDataAppControllers.controller('mapCtrl', ['$scope', '$rootScope',
 '$http', '$location', 'Geosearch', 'Search', '$filter', '$modal', '$log',
 'Toast', '$window', 'Geolocation', function($scope, $rootScope, $http,
 $location, Geosearch, Search, $filter, $modal, $log,
 Toast, $window, Geolocation) {

    var currentIndex;

    $rootScope.$on('$locationChangeSuccess', function() {
        ga('send', 'pageview', $location.path());
    });

    $scope.openModal = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'partials/modal.html',
        controller: 'modalController',
        size: size,
        resolve: { 
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

    $scope.openModal();

    var calcHeight = angular.element(window).height() - 100 + 64;
      if (screen.width < 776) {
        angular.element('.results').css('max-height' , calcHeight);
      }
      angular.element('.cityResults').css('max-height', calcHeight - 64);

    $rootScope.getLocationButton = function() {
      $scope.getLocation();
      $location.url('/#');
    };

    $rootScope.getLocation = function() {

      currentIndex = 0;
      console.log('getting location');

      Geolocation.getPosition().then(function(data) {
        $rootScope.showPosition(data);
      }).catch(function(error) {
        $rootScope.showPosition();
      });

    };

    $rootScope.showPosition = function(position) {

      //outside Virginia check.
      //- Latitude  36° 32′ N to 39° 28′ N
      // 36.533333 - 39.466667
      //- Longitude  75° 15′ W to 83° 41′ W
      // 75.25 - 83.683333

      if (!_.isUndefined(position) &&
         ((position.coords.latitude > 36.533333 ) &&
          (position.coords.latitude < 39.466667 )) &&
          ((position.coords.longitude < -75.25 ) &&
          (position.coords.longitude > -83.683333 ))) {

        console.log('coordinates are within Virgina');

        // Position.coords is only avaible in this scope, share over 
        // Geosearch service

        Geosearch.coords = position.coords;

      } else {

        console.log('Coming from out of state or geolocation unavailable.');
        Geosearch.coords = {
          latitude: 36.84687,
          longitude: -76.29228710000001,
        };

      }

      doSearch(currentIndex);

    };

    function doSearch(index) {

      var searchRadii = [805, 1609, 3219, 4828, 6437, 8047, 9656];
      var searchRadiiLabel = ['½', '1', '2', '3', '4', '5' , '6'];

      if (_.isUndefined(Geosearch.coords)) {
        return;
      }

      if (_.isUndefined(searchRadii[index])) {
        console.log('not going to work');
        return;
      }

      console.log('attempt to get results near ' +
      Geosearch.coords.latitude + ',' + Geosearch.coords.longitude);

      Toast.searchAreaText = 'Within ' + searchRadiiLabel[index] + ' mi.';
      Toast.query = '';
      $rootScope.$broadcast('updateToast');

      Geosearch.results = Geosearch.query({
        lat: Geosearch.coords.latitude, 
        lon: Geosearch.coords.longitude, 
        dist: searchRadii[index]
      }, function() {

        currentIndex++;

        Geosearch.results = _.values(_.reject(Geosearch.results, function(el){
          return _.isUndefined(el.name);
        }));

        if (Geosearch.results.length < 20) {
          return doSearch(index + 1);
        }

        Geosearch.results.forEach(function(el) { 
          el.dist = el.dist * 0.000621371;
          el.score = el.score ? Math.round(el.score) : 'n/a';
        });

        Geosearch.results = 
          $filter('orderBy')(Geosearch.results, 'dist', false);

        $rootScope.$broadcast('geosearchFire');

      });
    }

    $scope.showError = function() {
      console.log('Geolocation is not supported by this browser. ' +
                  'Fallback to Norfolk');
      $rootScope.showPosition();
    };

    $scope.getLocation();

    $rootScope.$on('moreGeosearch', function() {
      // debugger;
      doSearch(currentIndex);
    });

  }]);

openHealthDataAppControllers.controller('modalController',
  ['$scope', '$modalInstance', 'items', '$log', '$location', 
  function($scope, $modalInstance, items, $log, $location){

  $scope.ok = function () {
    // $log.info('http://code4hr.eventbrite.com/?aff=busapp');
    // $location.replace('http://eventbrite.com');
    $location.href="http://code4hr.eventbrite.com/?aff=busapp";
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);
openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope',
 '$routeParams', '$http', '$location', '$rootScope', 'Geosearch',
 'Inspections', function($scope, $routeParams, $http, $location, 
 $rootScope, Geosearch, Inspections) {

    $rootScope.isVisible = false;
    $rootScope.toggleCityJump(false);

    $scope.results = Inspections.query({vendorid: $routeParams.id}, function(){
      var restaurant = $scope.results[$routeParams.id];
      $rootScope.restaurantName = restaurant.name;
      restaurant.score = !_.isUndefined(restaurant.score) ?
                         Math.round(restaurant.score) :
                         'n/a';
      $rootScope.restaurantPermalink = $location.absUrl();
    });

}]);
openHealthDataAppControllers.controller('searchCtrl', ['$scope', '$rootScope',
 '$timeout', 'Search', 'Geosearch', '$filter', 'Toast', '$window', '$location',
  function($scope, $rootScope, $timeout, Search, Geosearch, $filter, Toast,
   $window, $location) {

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

    $rootScope.$on('updateToast', function() {
      $scope.searchQuery = Toast.query;
      $scope.searchAreaText = Toast.searchAreaText;
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
      $rootScope.toggleCityJump(false);
      $rootScope.isSearchbarVisible = !$rootScope.isSearchbarVisible;
      if ($rootScope.isSearchbarVisible === false) {
        $rootScope.isCityJumpVisible = false;
      }
    };

    $rootScope.toggleCityJump = function(state) {
      console.log('toggle city jump');
      $rootScope.isCityJumpVisible = state;

      if (state) {
        angular.element('body').css('overflow', 'hidden');
        angular.element('#dismissScreen').css('z-index', 1030);
      } else if (!state) {
        angular.element('body').css('overflow', 'auto');
        angular.element('#dismissScreen').css('z-index', -1);
      }

    };

    var currentIndex = 0;
    var searchRadii = [805, 1609, 3219, 4828, 6437, 8047, 9656];
    var searchRadiiLabel = ['½', '1', '2', '3', '4', '5' , '6'];

    $scope.nameSearch = function(index) {
      $rootScope.isSearchbarVisible = false;
      currentIndex = index;

      if (index > 6) {
        console.log('no more results to give nearby');
        return;
      }

      if ($scope.query.length < 4) {
        $window.alert('Please enter a longer search term.');
        return;
      }

      if (!_.isUndefined(Search.city)) {
        console.log("hide show more");
        $rootScope.showMore = false;
        console.log('search for ' + $scope.query + ' in ' + Search.city.name);
        searchQuery = {
          name: $scope.query,
          city: Search.city.name
        };
        Toast.searchAreaText = Search.city.name;
        Toast.query = $scope.query;
      } else if (searchRadii[index] === undefined &&
                 searchQuery.dist === undefined) {
        console.log('no results found anywhere');
        $window.alert('We weren\'t able to find any results for ' +
               $scope.query +' in the state of Virginia');
        return;
      } else if (searchRadii[index] === undefined) {
        console.log('unable to find any ' + $scope.query + ' nearby...');
        searchQuery = {
          name: $scope.query
        };
        Toast.searchAreaText = 'In Virginia';
        Toast.query = $scope.query;
      } else {
        console.log('searching for results within ' + searchRadii[index]);
        $rootScope.showMore = true;
        searchQuery = {
          name: $scope.query,
          lat: Geosearch.coords.latitude,
          lng: Geosearch.coords.longitude,
          dist: searchRadii[index]
        };
        Toast.searchAreaText = 'Within ' + searchRadiiLabel[index] + ' mi.';
        Toast.query = $scope.query;
      }

      $rootScope.$broadcast('updateToast');

      Search.results = Search.query(searchQuery, function() {

        console.log(Search.results);

        Search.results = _.values(_.reject(Search.results, function(el){
          return _.isUndefined(el.name);
        }));

        if (Search.results.length === 0) {

          if (searchQuery.city) {
            alert('No results for "' + searchQuery.name + '" in ' + searchQuery.city + '.');

            if ($location.url() === '/#') {
              return $rootScope.isVisible = true; 
            } else {
              return;
            }

          }

          return $scope.nameSearch(index + 1);
        }

        Search.results.forEach(function(el, index){
          if (!_.isUndefined(el.coordinates)) {
            
            el.score = !_.isUndefined(el.score) &&
                       !_.isNull(el.score) ?
                       Math.round(el.score) : 'n/a';

          } else {
            Search.results.splice(index,1);
          }
        });
        Search.results = $filter('orderBy')(Search.results, 'dist', false);
        $rootScope.$broadcast('searchFire');
      });

    };

    $rootScope.$on('moreSearch', function(){
      $scope.nameSearch(currentIndex + 1);
    });

  }]);

openHealthDataAppControllers.controller('searchResultsCtrl', ['$scope',
 '$rootScope', '$location', 'Search', 'Geosearch',
  function($scope, $rootScope, $location, Search, Geosearch) {

    var searchType; 

    $rootScope.showMore = false;

    $rootScope.$on('searchFire', function() {
      searchType = 'search';
      console.log('Displaying the results of your search,' +
                  'along with our score.');
      $scope.results = Search.results;
      $rootScope.isVisible = true;
      $scope.resultsCount = Search.results.length;
      $location.url('/#');
    });

    $rootScope.$on('geosearchFire', function(){
      searchType = 'geosearch';
      console.log('printing results to scope.');
      $scope.results = Geosearch.results;
      $rootScope.showMore = true;
      console.log('Display button: ' + $rootScope.showMore);
    });

    $scope.loadMore = function() {
      console.log("Clicked the button");
      if (searchType === 'search') {
        console.log('get more search results of that name?');
        $rootScope.$broadcast('moreSearch');
        
      } else if (searchType === 'geosearch') {
        console.log('get more search results around here.');
        $rootScope.$broadcast('moreGeosearch'); 
      }
    };

    $scope.map = Geosearch.map;
    $rootScope.isVisible = false;

  }]);

openHealthDataAppControllers.controller('searchResultsPreview',
  ['$scope', '$rootScope',
    function($scope, $rootScope) {
    $rootScope.isVisible = true;    
}]);