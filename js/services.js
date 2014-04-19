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
      query: { method: 'JSONP', params: {lat: '36', lon: '-72', dist: '1000', callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Search', ['$resource',
  function($resource) {
    return $resource('http://api.ttavenner.com/vendors/textsearch/:searchString', {}, {
      query: { method: 'JSONP', params: {searchString: '', callback: 'JSON_CALLBACK'} }
    });
  }]);


openHealthDataServices.factory('Data', ['$resource',
  function($resource) {
    return {query: "I'm data from a service."}
  }]);