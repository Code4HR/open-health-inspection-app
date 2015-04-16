'use strict';

/*global angular */

openHealthDataAppControllers.controller('mapCtrl', [
  '$scope',
  '$rootScope',
  '$http',
  '$location',
  'Geosearch',
  'Search',
  '$filter',
  '$log',
  'Toast',
  '$window',
  'Geolocation',
  'geolocationModal',
  function($scope, $rootScope, $http, $location, Geosearch, Search, $filter,
           $log, Toast, $window, Geolocation, geolocationModal) {

    var currentIndex = 0;

    $rootScope.getLocationButton = function() {
      geolocationModal.open()
      .then(function(data) {
        $rootScope.showPosition(data);
      });
      $location.url('/#');
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

    $rootScope.$on('moreGeosearch', function() {
      // debugger;
      doSearch(currentIndex);
    });

  }]);
