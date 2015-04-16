'use strict';

module.exports = function(ngModule) {

  ngModule.controller('modalInstanceController', [
    '$scope',
    '$modalInstance',
    function($scope, $modalInstance){

      $scope.returnLocation = function (obj) {
        $modalInstance.close(obj);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

  }]);

};
