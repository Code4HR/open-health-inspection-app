module.exports = function(ngModule) {
  ngModule.factory('geocodeService', ['$http', '$q', function($http, $q) {

    return {
      getLatLon: function(zip) {

        // input validation here. If input is a zip code continue. Else fail;
        var url = 'https://maps.googleapis.com/maps/api/geocode/json' +
                  '?key=AIzaSyCxE9VT08-CfQcE1II_xy2l3JNQECBly44' +
                  '&address=' + zip;

        return $http.get(url);

      }
    };
  }]);
};
