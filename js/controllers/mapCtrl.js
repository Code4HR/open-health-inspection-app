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
  'geolocationModal',
  function($scope, $rootScope, $http, $location, Geosearch, Search, $filter,
           $log, Toast, $window, geolocationModal) {

    var currentIndex = 0;

    $rootScope.getLocationButton = function() {
      geolocationModal.open()
      .then(function(data) {
        $rootScope.showPosition(data);
      });
      $location.url('/#');
    };

    $rootScope.showPosition = function(position) {

      Geosearch.get({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        dist: 1000
      }, function(data) {
        debugger;
      });

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
