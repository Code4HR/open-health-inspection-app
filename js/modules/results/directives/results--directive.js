module.exports = function(ngModule) {

  ngModule.directive('results', [function() {

    var searchType, lastSearch,
    directive = {
      restrict: 'E',
      replace: false,
      // scope: true,
      templateUrl: '/templates/results.html',
      controllerAs: 'ctrl'
    };

    directive.controller = [
      '$rootScope',
      '$location',
      '$scope',
      'Geosearch',
      'geolocationModal',
      'Search',
      function($rootScope, $location, $scope, Geosearch, geolocationModal, Search) {

      $scope.results = [];
      for (var i = 0; i < 20; i++) {
        $scope.results.push({});
      }

      if (!lastSearch) {

        geolocationModal.open()
        .then(function(position) {
          Geosearch.get(position, 0);
        }, function(error) {
          Geosearch.get({
            coords: {
              latitude: 36.84687,
              longitude: -76.29228710000001,
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
      });

      $rootScope.$on('searchFire', function() {
        searchType = 'search';
        $scope.results = Search.results;
        lastSearch = Search.results;
        if ($location.url() !== '/') {
          $location.url('/');
        }
      });

      $scope.loadMore = function() {
        console.log("Clicked the button");
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
