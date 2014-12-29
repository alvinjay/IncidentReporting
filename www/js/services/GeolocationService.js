(function(angular){
    'use strict';

    angular
        .module('App')
        .service('GeolocationService', GeolocationService);

    GeolocationService.$inject = ['$q', '$cordovaGeolocation', 'MapService',
                                  'IonicLoadingService', 'IonicPopupService'];

    function GeolocationService($q, $cordovaGeolocation, MapService,
                                IonicLoadingService, IonicPopupService){
        var vm = this;

        vm.watch = $cordovaGeolocation.watchPosition({ enableHighAccuracy: true });
        vm.location = {};

        return {
            location: vm.location,
            watchStatus: function watchStatus(){
                vm.watch.promise.then(null,geolocationError,geolocationSuccess);
            }
        };

        /**
         * on geolocation error
         * @param err
         */
        function geolocationError(err) {
            IonicLoadingService.hide();
            // An error occurred.
//           IonicPopupService('Error Code:' + err.code + '</br>Message:' + err.message);
        }

        /**
         * on geolocation watch success
         * @param position
         */
        function geolocationSuccess(position) {
            vm.location.lat = position.coords.latitude;
            vm.location.lng = position.coords.longitude;
            vm.location.type = 'location';
            vm.location.zoom = 15;

            MapService.setCenter(vm.location);
            //make a marker for incident chosen
            MapService.addMarker(vm.location);

            IonicLoadingService.hide();
            $cordovaGeolocation.clearWatch(vm.watch);
        }
    }
})(window.angular);
