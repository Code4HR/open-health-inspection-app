var openHealthDataServices = angular.module('openHealthDataServices', ['ngResource']);
 
openHealthDataServices.factory('Vendors', ['$resource',
  function($resource){
    return $resource('http://api.ttavenner.com/vendors', {}, {
      query: { method: 'JSONP', params: {callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Geosearch', ['$resource',
  function($resource){
    return $resource('http://api.ttavenner.com/vendors/geosearch/:lng/:lat/:dist', {}, {
      query: { method: 'JSONP', params: {lng: '36', lat: '-76', dist: '5000', callback: 'JSON_CALLBACK'} }
    });
  }]);