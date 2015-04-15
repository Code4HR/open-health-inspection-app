'use strict';

module.exports = function(ngModule) {

  ngModule.factory('geolocationModal', [
    '$modal',
    function($modal) {

        var service = {};
        service.open = function(size) {

          var geoOptions;

          return $modal.open({
            templateUrl: 'partials/modal.html',
            controller: 'modalInstanceController',
            size: size,
            resolve: {
              geoOptions: function () {
                return geoOptions;
              }
            }
          }).result;

      };

      return service;

  }]);

};
