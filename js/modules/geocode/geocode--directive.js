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

      $scope.getLatLon = function() {
        geocodeService.getLatLon($scope.zipcode)
        .success(function(data) {

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
