'use strict';

module.exports = function(ngModule) {

  ngModule.controller('modalInstanceController', [
    '$scope',
    '$modalInstance',
    '$location',
    function($scope, $modalInstance, $location){

      $scope.returnLocation = function (obj) {
        $modalInstance.close(obj);
        if ($location.url() !== '/' || $location.url() !== '') {
          $location.url('/');
        }
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

  }]);

};
