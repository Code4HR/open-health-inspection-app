var openHealthDataServices = angular.module('openHealthDataServices', ['ngResource']);
 
openHealthDataServices.factory('Vendor', ['$resource',
  function($resource){
    return $resource('http://api.ttavenner.com/vendors', {}, {
      query: { method: 'JSONP', params: {callback: 'JSON_CALLBACK'} }
    });
  }]);

