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

'use strict';

var openHealthDataAppControllers =
  angular.module('openHealthDataAppControllers', []);

var openHealthDataApp = angular.module('openHealthDataApp', [
  'ngRoute',
  'ui.bootstrap',
  'openHealthDataAppControllers',
  'openHealthDataServices',
  'openHealthDataAppFilters',
  'ngTouch',
  'geocodeModule',
  'geolocationModule',
  'resultsModule',
  'geolocationModalModule'
]);

openHealthDataApp.config([
  '$routeProvider',
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

openHealthDataApp.run([
  '$rootScope',
  '$location',
  '$window',
  function($rootScope, $location, $window) {

    var calcHeight = $window.innerHeight - 100 + 64;
    if ($window.innerWidth < 776) {
      angular.element('.results').css('max-height' , calcHeight);
    } else {
      angular.element('.cityResults').css('max-height', calcHeight - 64);
    }

    $rootScope.$on('$locationChangeSuccess', function() {
        ga('send', 'pageview', $location.path());
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

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.directive('geocode', ['geocodeService', function(geocodeService) {

    var location,
    directive = {
      restrict: 'E',
      replace: false,
      scope: {
        callback: '='
      },
      templateUrl: '/templates/geocode.html',
      controllerAs: 'ctrl'
    };

    directive.link = function($scope) {

      $scope.invalidZip = false;

      $scope.resetZipValid = function() {
        $scope.invalidZip = false;
      };

      $scope.getLatLon = function() {

        geocodeService.getLatLon($scope.zipcode)
        .success(function(data) {

          if (data[0].zipcodes === undefined) {
            $scope.invalidZip = true;
            return;
          }

          location = {
            coords : {
              latitude: data[0].zipcodes[0].latitude,
              longitude: data[0].zipcodes[0].longitude
            }
          };

          if ($scope.callback) {
            $scope.callback(location);
          }

        })
        .error(function(data) {

        });
      };

    };

    return directive;

  }]);

  ngModule.run(['$templateCache', function($templateCache){
    $templateCache.put('/templates/geocode.html',
      require('./geocode--template.html'));
  }]);

};

},{"./geocode--template.html":3}],2:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('geocodeService', ['$http', '$q', function($http, $q) {

    return {
      getLatLon: function(zip) {

        // input validation here. If input is a zip code continue. Else fail;
        var url = 'https://us-zipcode.api.smartystreets.com/lookup' +
                  '?auth-id=3528212138785631906' +
                  '&zipcode=' + zip;

        return $http.get(url);

      }
    };
  }]);
};

},{}],3:[function(require,module,exports){
module.exports = "  <label>Zip Code</label>\n  <form name=\"geocodeForm\" ng-submit=\"getLatLon()\" novalidate >\n    <div class=\"input-group form-group input-group-lg\">\n      <input class=\"form-control\" name=\"zipcode\" ng-change=\"resetZipValid()\" ng-model=\"zipcode\" ng-minlength=\"5\" ng-maxlength=\"10\" ng-pattern=\"/^\\d{5}(?:[-\\s]\\d{4})?$/\" type=\"text\" placeholder=\"Zip Code\"/>\n      <span class=\"input-group-btn\">\n        <button class=\"btn btn-default\">\n          <span class=\"glyphicon glyphicon-search\"></span>\n        </button>\n      </span>\n    </div>\n\n    <p class=\"alert alert-danger\" ng-show=\"geocodeForm.zipcode.$error.pattern && !geocodeForm.zipcode.$error.minlength\">\n      Please enter a valid 5-digit VA ZIP code\n    </p>\n\n    <p class=\"alert alert-warning\" ng-show=\"invalidZip\">\n      Invalid ZIP code\n    </p>\n\n  </form>\n";

},{}],4:[function(require,module,exports){
'use strict';

var geocodeModule = angular.module('geocodeModule', []);

require('./geocode--service.js')(geocodeModule);
require('./geocode--directive.js')(geocodeModule);

},{"./geocode--directive.js":1,"./geocode--service.js":2}],5:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.directive('geolocation', ['geolocationService', function(geolocationService){

    var directive = {
      restrict: 'E',
      replace: false,
      scope: {
        callback: '='
      },
      templateUrl: '/templates/geolocation.html',
      controllerAs: 'ctrl'
    };

    directive.link = function($scope) {
      $scope.getLocation = function() {
        geolocationService.getLatLon()
        .then(function(position) {

          if ($scope.callback) {
            $scope.callback(position);
          }

        });
      };
    };

    return directive;

  }]);

  ngModule.run(['$templateCache', function($templateCache){
    $templateCache.put('/templates/geolocation.html',
      require('./geolocation--template.html'));
  }]);

};

},{"./geolocation--template.html":7}],6:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.factory('geolocationService', ['$q', '$timeout', function($q, $timeout) {
    return {

      getLatLon: function() {

        var thePosition = {
          coords: {
            latitude: null,
            longitude: null
          }
        },
        deferred = $q.defer();

        function countdown() {
          deferred.reject('The request to get user information timed out');
        }

        $timeout(countdown, 10000);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            $timeout.cancel(countdown);

            if (((position.coords.latitude > 36.533333 ) &&
                (position.coords.latitude < 39.466667 )) &&
                ((position.coords.longitude < -75.25 ) &&
                (position.coords.longitude > -83.683333 ))) {

              console.log('coordinates are within Virgina');
              thePosition = position;

            } else {

              console.log('Coming from out of state or geolocation unavailable.');
              thePosition.coords = {
                latitude: 36.84687,
                longitude: -76.29228710000001,
              };

            }

            deferred.resolve(thePosition);

          }, function(error) {

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
};

},{}],7:[function(require,module,exports){
module.exports = "<label>Using GPS</label>\n<form ng-submit=\"getLocation()\" class=\"input-group form-group\" novalidate>\n  <button class=\"btn btn-primary btn-lg\">GPS</button>\n</form>\n";

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function(ngModule) {

  ngModule.factory('Geosearch', [
    '$resource',
    '$rootScope',
    '$filter',
    'Toast',
    function($resource, $rootScope, $filter, Toast) {

      var service = {};
      service.results = {};
      service.index = 0;
      service.position = {};

      var searchRadii = [805, 1609, 3219, 4828, 6437, 8047, 9656];
      var searchRadiiLabel = ['½', '1', '2', '3', '4', '5' , '6'];

      var _doSearch = $resource('https://ohi-api.code4hr.org/' +
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

      service.get = function(position, index) {

        service.position = position;

        _doSearch.query({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          dist: searchRadii[index] || position.dist
        }, function(data) {

          if (service.index > 6) {
            console.log('not going to work');
            return;
          }

          Toast.searchAreaText = 'Within ' + searchRadiiLabel[index] + ' mi.';
          Toast.query = '';
          $rootScope.$broadcast('updateToast');

          service.index++;

          service.results = _.values(_.reject(data, function(el){
            return _.isUndefined(el.name);
          }));

          if (service.results.length < 20) {
            return service.get(
              service.position,
              service.index + 1
            );
          }

          service.results.forEach(function(el) {
            el.dist = el.dist * 0.000621371;
            el.score = el.score ? Math.round(el.score) : 'n/a';
          });

          service.results =
            $filter('orderBy')(service.results, 'dist', false);

          $rootScope.$broadcast('geosearchFire');

        });

      };

      return service;

    }]);

};

},{}],9:[function(require,module,exports){
'use strict';

var geolocationModule = angular.module('geolocationModule', []);

require('./geolocation--directive')(geolocationModule);
require('./geolocation--service')(geolocationModule);
require('./geosearch--service')(geolocationModule);

},{"./geolocation--directive":5,"./geolocation--service":6,"./geosearch--service":8}],10:[function(require,module,exports){
'use strict';

var modalModule = angular.module('geolocationModalModule', []);

require('./modal--controller.js')(modalModule);
require('./modal-instance--controller.js')(modalModule);

},{"./modal--controller.js":11,"./modal-instance--controller.js":12}],11:[function(require,module,exports){
'use strict';

module.exports = function(ngModule) {

  ngModule.factory('geolocationModal', [
    '$modal',
    function($modal) {

        var service = {};
        service.open = function(size) {

          var geoOptions;

          return $modal.open({
            templateUrl: 'partials/modal.html',
            controller: 'modalInstanceController',
            size: size,
            resolve: {
              geoOptions: function () {
                return geoOptions;
              }
            }
          }).result;

      };

      return service;

  }]);

};

},{}],12:[function(require,module,exports){
'use strict';

module.exports = function(ngModule) {

  ngModule.controller('modalInstanceController', [
    '$scope',
    '$modalInstance',
    '$location',
    function($scope, $modalInstance, $location){

      $scope.returnLocation = function (obj) {
        $modalInstance.close(obj);
        if ($location.url() !== '/' || $location.url() !== '') {
          $location.url('/');
        }
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

  }]);

};

},{}],13:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.factory('resultsService', [function() {

    return {

    };

  }]);

};

},{}],14:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.directive('result', [function() {

      var directive = {
        restrict: 'E',
        replace: false,
        templateUrl: '/templates/result.html',
        controllerAs: 'ctrl'
      };

      directive.link = function(scope, element, attrs) {
        scope.restaurant = scope.$eval(attrs.data);
      };

      return directive;

  }]);

  ngModule.run(['$templateCache', function($templateCache) {
    $templateCache.put('/templates/result.html',
    require('./../templates/result--template.html'));
  }]);

};

},{"./../templates/result--template.html":17}],15:[function(require,module,exports){
'use strict';

module.exports = function(ngModule) {

  ngModule.directive('results', [function() {

    var searchType, lastSearch,
    directive = {
      restrict: 'E',
      replace: false,
      scope: true,
      templateUrl: '/templates/results.html',
      controllerAs: 'ctrl'
    };

    directive.link = function(scope) {
      scope.hasResults = false;
    };

    directive.controller = [
      '$rootScope',
      '$location',
      '$scope',
      'Geosearch',
      'geolocationModal',
      'Search',
      function($rootScope, $location, $scope, Geosearch, geolocationModal, Search) {

        if (!lastSearch) {

          geolocationModal.open()
          .then(function(position) {
            Geosearch.get(position, 0);
          }, function(error) {
            Geosearch.get({
              coords: {
                latitude: 36.84687,
                longitude: -76.29228710000001
              }
            }, 0);
          });

        }

        $scope.$watch(function() {
          return Geosearch.results;
        }, function() {
          searchType = 'geosearch';
          $scope.results = Geosearch.results;
          lastSearch = Geosearch.results;

          if ($scope.results.length > 1) {
            $scope.hasResults = true;
          } else {
            $scope.hasResults = false;
          }

        });

        $rootScope.$on('searchFire', function() {
          searchType = 'search';
          $scope.results = Search.results;
          lastSearch = Search.results;
          if ($location.url() !== '/') {
            $location.url('/');
          }

          if ($scope.results.length > 1) {
            $scope.hasResults = true;
          } else {
            $scope.hasResults = false;
          }

        });

        $scope.loadMore = function() {
          if (searchType === 'search') {
            console.log('get more search results of that name?');
            $rootScope.$broadcast('moreSearch');

          } else if (searchType === 'geosearch') {
            console.log('get more search results around here.');
            Geosearch.get(Geosearch.position, Geosearch.index + 1);
          }

        };

      }];

    return directive;

  }]);

  ngModule.run(['$templateCache', function($templateCache) {
    $templateCache.put('/templates/results.html',
      require('./../templates/results--template.html'));
  }]);

};

},{"./../templates/results--template.html":18}],16:[function(require,module,exports){
'use strict';

var resultsModule = angular.module('resultsModule', []);

require('./directives/results--directive.js')(resultsModule);
require('./directives/result--directive.js')(resultsModule);

},{"./directives/result--directive.js":14,"./directives/results--directive.js":15}],17:[function(require,module,exports){
module.exports = "<div ng-if=\"$index % 2 === 0\" class=\"col-xs-12 visible-sm clearfix\"></div>\n<div ng-if=\"$index % 3 === 0\" class=\"col-xs-12 visible-md visible-lg clearfix\"></div>\n\n<div class=\"list-container col-sm-6 col-md-4\">\n  <div class=\"card clearfix drop-shadow {{restaurant.score | scoreBorder}}\">\n    <a href=\"#{{restaurant.url}}\">\n      <div class=\"title clearfix\">\n        <i class=\"{{restaurant.category | categoryIcon }} col-xs-2 category-icon\"></i>\n        <ul class=\"col-xs-7 info\">\n          <li class=\"name\">{{restaurant.name}}</li>\n          <li class=\"address\">{{restaurant.address}}</li>\n        </ul>\n        <p class=\"score col-xs-3 {{restaurant.score | scoreColor}}\">{{restaurant.score}}</p>\n      </div>\n      <div class=\"inspections visible-md visible-lg\"></div>\n      <p class=\"readMore visible-sm visible-md visible-lg\">Read this vendor's full report.</p>\n    </a>\n  </div>\n</div>\n";

},{}],18:[function(require,module,exports){
module.exports = "<section id=\"results\">\n  <ul>\n    <li ng-repeat=\"result in results\">\n      <result data=\"result\"></result>\n    </li>\n    <li class=\"clearfix\"></li>\n\n    <li class=\"container load-more-button\" ng-show=\"hasResults\">\n      <div class=\"row\">\n        <a class=\"col-xs-12\" ng-click=\"loadMore()\">Expand Search Radius</a>\n      </div>\n    </li>\n\n  </ul>\n</div>\n";

},{}],19:[function(require,module,exports){

},{}]},{},[1,2,4,5,6,8,9,10,11,12,13,14,15,16,19]);

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
    return $resource('https://ohi-api.code4hr.org/' +
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



openHealthDataServices.factory('Search', ['$resource',
  function($resource) {
    return $resource('https://ohi-api.code4hr.org/vendors', {}, {
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
openHealthDataAppControllers.controller('restaurantDetailCtrl', ['$scope',
 '$routeParams', '$http', '$location', '$rootScope', 'Geosearch',
 'Inspections', function($scope, $routeParams, $http, $location,
 $rootScope, Geosearch, Inspections) {

    $rootScope.isVisible = false;
    $rootScope.isCloseButtonVisible = true;
    $rootScope.toggleCityJump(false);

    $scope.results = Inspections.query({vendorid: $routeParams.id}, function(){
      var restaurant = $scope.results[$routeParams.id];
      $rootScope.restaurantName = restaurant.name;
      restaurant.score = !_.isUndefined(restaurant.score) ?
                         Math.round(restaurant.score) :
                         'n/a';

      restaurant.inspections = _.map(restaurant.inspections, function(i) {
        i.dateNum = Date.parse(i.date)
        return i
      });

      restaurant.inspections = _.sortBy(restaurant.inspections, ['dateNum'], ['desc']).reverse();
      $rootScope.restaurantPermalink = $location.absUrl();
    });

}]);

openHealthDataAppControllers.controller('searchCtrl',
  ['$scope',
   '$rootScope',
   '$timeout',
   'Search',
   'Geosearch',
   'geolocationModal',
   '$filter',
   'Toast',
   '$window',
   '$location',
   function($scope,
            $rootScope,
            $timeout,
            Search,
            Geosearch,
            geolocationModal,
            $filter,
            Toast,
            $window,
            $location) {

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

    $rootScope.goToResults = function(state) {
      $location.url('/');
    };

    $scope.getLocationButton = function() {
      geolocationModal.open().then(function(position) {
        Geosearch.get(position, 0);
      });
    };

    var currentIndex = 0;
    var searchRadii = [805, 1609, 3219, 4828, 6437, 8047, 9656];
    var searchRadiiLabel = ['½', '1', '2', '3', '4', '5' , '6'];

    $scope.nameSearch = function(index) {
      $rootScope.isSearchbarVisible = false;
      currentIndex = index;

      if (index > 6) {
        console.log('no more results to give nearby.');
      }

      if ($scope.query.length < 2) {
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
          lat: Geosearch.position.coords.latitude,
          lng: Geosearch.position.coords.longitude,
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
    $rootScope.isCloseButtonVisible = false;
}]);
