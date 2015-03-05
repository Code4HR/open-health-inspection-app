/*
    The frontend for Code for Hampton Roads' Open Health Inspection Data.
    Copyright (C) 2014  Code for Hampton Roads contributors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*global angular*/

'use strict';

var openHealthDataServices = angular.module('openHealthDataServices',
['ngResource']);

openHealthDataServices.factory('Inspections', ['$resource',
  function($resource){
    return $resource('http://api.openhealthinspection.com/' +
      'inspections?vendorid=:vendorid', {}, {
      query: {
        method: 'JSONP',
        params: {
          vendorid: '',
          callback: 'JSON_CALLBACK'
        }
      }
    });
  }]);

openHealthDataServices.factory('Geolocation', ['$q', '$timeout', 'Smarty', function($q, $timeout, Smarty) {
  return {

    getPosition: function(geoOptions) {

      var deferred = $q.defer();

      $timeout(countdown, 5000);

      function countdown() {
        deferred.reject('The request to get user location timed out.');
      }

      if (geoOptions.useGeolocation && navigator.geolocation) {
          console.log('using geolocation');
        navigator.geolocation.getCurrentPosition(function(position) {
          $timeout.cancel(countdown);
          deferred.resolve(position);
        },
        function(error) {

          $timeout.cancel(countdown);

          var errorCode;
          switch(error.code) {
            case error.PERMISSION_DENIED:
                errorCode = 'User denied the request for Geolocation.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorCode = 'Location information is unavailable.';
                break;
            case error.TIMEOUT:
                errorCode = 'The request to get user location timed out.';
                break;
            case error.UNKNOWN_ERROR:
                errorCode = 'An unknown error occurred.';
                break;
          }

          deferred.reject(errorCode);

        });
      } else if (geoOptions.zip) {
          console.log('using smarty',geoOptions.zip);
        Smarty.query({ zip: geoOptions.zip }, function(data) {
            var lat = data[0].zipcodes[0].latitude;
            var lon = data[0].zipcodes[0].longitude;
            deferred.resolve({ coords: { latitude: lat, longitude: lon } });
        },
        function(err) {
            deferred.reject(err);
        });
      } else {
          deferred.resolve();
      }
      return deferred.promise;
    }
  };
}]);

openHealthDataServices.factory('Geosearch', ['$resource',
  function($resource) {
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
  }]);

openHealthDataServices.factory('Search', ['$resource',
  function($resource) {
    return $resource('http://api.openhealthinspection.com/vendors', {}, {
      query: {
        method: 'JSONP',
        params: {
          callback: 'JSON_CALLBACK'
        }
      }
    });
  }]);

openHealthDataServices.factory('Smarty', ['$resource',
  function($resource) {
    return $resource('https://api.smartystreets.com/zipcode' +
        '?auth-id=3528212138785631906' +
        '&city=&state=&zipcode=:zip', {}, {});
  }]);

openHealthDataServices.factory('Toast', function() {
  return {
    query: '',
    searchAreaText: '',
  };
});
