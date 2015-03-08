openHealthDataAppControllers.controller('modalController',
  ['$scope', '$modalInstance', 'geoOptions', '$log', '$location', 'geocodeService',
  function($scope, $modalInstance, geoOptions, $log, $location, geocodeService){

  $scope.returnLocation = function (obj) {
    $modalInstance.close(obj);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);
