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
