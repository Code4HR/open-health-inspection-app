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
