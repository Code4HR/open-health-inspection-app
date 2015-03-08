module.exports = function(ngModule) {
  ngModule.factory('geocodeService', ['$http', '$q', function($http, $q){

    return {
      getLatLon: function(zip) {

        // input validation here. If input is a zip code continue. Else fail;

        var url = 'https://api.smartystreets.com/zipcode' +
                  '?auth-id=3528212138785631906' +
                  '&city=&state=&zipcode=' + zip;

        return $http.get(url);

      }
    };
  }]);
};
