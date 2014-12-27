(function(angular){
    'use strict';

    angular
        .module('App')
        .service('GeolocationService', GeolocationService);

    GeolocationService.$inject = ['$cordovaGeolocation', 'MapService',
                                  'IonicLoadingService', 'IonicPopupService'];

    function GeolocationService($cordovaGeolocation, MapService,
                                IonicLoadingService, IonicPopupService){
        var vm = this;

        vm.watch = $cordovaGeolocation.watchPosition({ enableHighAccuracy: true });
        vm.location = {};

        return {
            location: vm.location,
            watchStatus: function watchStatus(){
                IonicLoadingService.show('Preparing Map');
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

            MapService.setCenter(vm.location);
            //make a marker for incident chosen
            MapService.addMarker(vm.location);

            // clear watch
//            $cordovaGeolocation.clearWatch(watch.watchID);
            IonicLoadingService.hide();
        }
    }
})(window.angular);
