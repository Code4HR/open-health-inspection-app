module.exports = function(ngModule) {
  ngModule.factory('geocodeService', ['$http', '$q', function($http, $q) {

    return {
      getLatLon: function(zip) {

        var url = 'https://us-zipcode.api.smartystreets.com/lookup' +
                  '?auth-id=3528212138785631906' +
                  '&zipcode=' + zip;

        return $http.get(url);

      }
    };
  }]);
};
