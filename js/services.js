var openHealthDataServices = angular.module('openHealthDataServices', ['ngResource']);
 
openHealthDataServices.factory('Vendors', ['$resource',
  function($resource){
    return $resource('http://api.ttavenner.com/vendors', {}, {
      query: { method: 'JSONP', params: {callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Geosearch', ['$resource',
  function($resource) {
    return $resource('http://api.ttavenner.com/vendors/geosearch/:lat/:lon/:dist', {}, {
      query: { method: 'JSONP', params: {lat: '36', lon: '-23', dist: '1000', callback: 'JSON_CALLBACK'} }
    });
  }]);