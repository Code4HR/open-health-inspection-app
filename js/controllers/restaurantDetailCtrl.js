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
