'use strict';

module.exports = function(ngModule) {

  ngModule.controller('modalController', [
    '$scope',
    '$modal',
    '$rootScope',
    function($scope, $modal, $rootScope) {

    $scope.openModal = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'partials/modal.html',
        controller: 'modalInstanceController',
        size: size,
        resolve: {
          geoOptions: function () {
            return $scope.geoOptions;
          }
        }
      });

      modalInstance.result.then(function (location) {
        $rootScope.showPosition(location);
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
        $rootScope.showPosition();
      });

    };

  }]);

};
