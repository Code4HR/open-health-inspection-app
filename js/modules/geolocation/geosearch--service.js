'use strict';

module.exports = function(ngModule) {

  ngModule.factory('Geosearch', [
    '$resource',
    '$rootScope',
    '$filter',
    'Toast',
    function($resource, $rootScope, $filter, Toast) {

      var service = {};
      service.results = {};
      service.index = 0;
      service.position = {};

      var searchRadii = [805, 1609, 3219, 4828, 6437, 8047, 9656];
      var searchRadiiLabel = ['½', '1', '2', '3', '4', '5' , '6'];

      function _doSearch(position) {
        return $resource('http://api.openhealthinspection.com/' +
          'vendors?lat=:lat&lng=:lon&dist=:dist', {}, {
          query: {
            method: 'JSONP',
            params: {
              lat: '36',
              lon: '-72',
              dist: '1000',
              callback: 'JSON_CALLBACK'}
            }
        });
      }

      service.get = function(position, index) {

        service.position = position;

        _doSearch.query({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          dist: searchRadii[index] || position.dist
        }, function(data) {

          if (service.index > 6) {
            console.log('not going to work');
            return;
          }

          Toast.searchAreaText = 'Within ' + searchRadiiLabel[index] + ' mi.';
          Toast.query = '';
          $rootScope.$broadcast('updateToast');

          service.index++;

          service.results = _.values(_.reject(data, function(el){
            return _.isUndefined(el.name);
          }));

          if (service.results.length < 20) {
            return service.get(
              service.position,
              service.index + 1
            );
          }

          service.results.forEach(function(el) {
            el.dist = el.dist * 0.000621371;
            el.score = el.score ? Math.round(el.score) : 'n/a';
          });

          service.results =
            $filter('orderBy')(service.results, 'dist', false);

          $rootScope.$broadcast('geosearchFire');

        });

      };

      return service;

    }]);

};
