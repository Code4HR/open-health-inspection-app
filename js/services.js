var openHealthDataServices = angular.module('openHealthDataServices', ['ngResource']);
 
openHealthDataServices.factory('Inspections', ['$resource',
  function($resource){
    return $resource('http://api.openhealthinspection.com/inspections?vendorid=:vendorid', {}, {
      query: { method: 'JSONP', params: {vendorid: '', callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Geosearch', ['$resource',
  function($resource) {
    return $resource('http://api.openhealthinspection.com/vendors?lat=:lat&lng=:lon&dist=:dist', {}, {
      query: { method: 'JSONP', params: {lat: '36', lon: '-72', dist: '1000', callback: 'JSON_CALLBACK'} }
    });
  }]);

openHealthDataServices.factory('Search', ['$resource',
  function($resource) {
    return $resource('http://api.openhealthinspection.com/vendors', {}, {
      query: { method: 'JSONP', params: {callback: 'JSON_CALLBACK'} }
    });
  }]);

