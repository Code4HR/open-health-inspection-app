openHealthDataAppControllers.controller('searchCtrl',
  ['$scope',
   '$rootScope',
   '$timeout',
   'Search',
   'Geosearch',
   '$filter',
   'Toast',
   '$window',
   '$location',
   function($scope,
            $rootScope,
            $timeout,
            Search,
            Geosearch,
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
