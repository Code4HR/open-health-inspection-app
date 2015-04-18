module.exports = function(ngModule) {

  ngModule.factory('geolocationService', ['$q', '$timeout', function($q, $timeout) {
    return {

      getLatLon: function() {

        var thePosition = {
          coords: {
            latitude: null,
            longitude: null
          }
        },
        deferred = $q.defer();

        function countdown() {
          deferred.reject('The request to get user information timed out');
        }

        $timeout(countdown, 10000);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            $timeout.cancel(countdown);

            if (((position.coords.latitude > 36.533333 ) &&
                (position.coords.latitude < 39.466667 )) &&
                ((position.coords.longitude < -75.25 ) &&
                (position.coords.longitude > -83.683333 ))) {

              console.log('coordinates are within Virgina');
              thePosition = position;

            } else {

              console.log('Coming from out of state or geolocation unavailable.');
              thePosition.coords = {
                latitude: 36.84687,
                longitude: -76.29228710000001,
              };

            }

            deferred.resolve(thePosition);

          }, function(error) {

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

          return deferred.promise;

        }
      }

    };
  }]);
};
