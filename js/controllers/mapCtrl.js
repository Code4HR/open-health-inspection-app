openHealthDataAppControllers.controller('mapCtrl', ['$scope', '$rootScope',
 '$http', '$location', 'Geosearch', 'Search', '$filter', '$modal', '$log',
 'Toast', '$window', 'Geolocation', function($scope, $rootScope, $http,
 $location, Geosearch, Search, $filter, $modal, $log,
 Toast, $window, Geolocation) {

    var currentIndex = 0;

    $rootScope.$on('$locationChangeSuccess', function() {
        ga('send', 'pageview', $location.path());
    });

    $scope.openModal = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'partials/modal.html',
        controller: 'modalController',
        size: size,
        resolve: {
          geoOptions: function () {
            return $scope.geoOptions;
          }
        }
      });

      modalInstance.result.then(function (location) {
        $rootScope.showPosition(location);
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
        $rootScope.showPosition();
      });

    };

    // if ($location.path() === '/' || $location.path() === '') {
    //   $scope.openModal();
    // }

    var calcHeight = angular.element(window).height() - 100 + 64;
      if (screen.width < 776) {
        angular.element('.results').css('max-height' , calcHeight);
      }
      angular.element('.cityResults').css('max-height', calcHeight - 64);

    $rootScope.getLocationButton = function() {
      $scope.openModal();
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
