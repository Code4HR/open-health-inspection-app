openHealthDataAppControllers.controller('modalController',
  ['$scope', '$modalInstance', 'geoOptions', '$log', '$location', 
  function($scope, $modalInstance, geoOptions, $log, $location){

  $scope.geoOptions = geoOptions;

  $scope.ok = function () {
    // $log.info('http://code4hr.eventbrite.com/?aff=busapp');
    // $location.replace('http://eventbrite.com');
    // $location.href="http://code4hr.eventbrite.com/?aff=busapp";
    $modalInstance.close($scope.geoOptions);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);