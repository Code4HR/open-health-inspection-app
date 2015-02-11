openHealthDataAppControllers.controller('modalController',
  ['$scope', '$modalInstance', 'items', '$log', '$location', 
  function($scope, $modalInstance, items, $log, $location){

  $scope.ok = function () {
    // $log.info('http://code4hr.eventbrite.com/?aff=busapp');
    // $location.replace('http://eventbrite.com');
    $location.href="http://code4hr.eventbrite.com/?aff=busapp";
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);