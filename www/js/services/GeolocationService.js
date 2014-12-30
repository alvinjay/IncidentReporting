(function(angular){
    'use strict';

    angular
        .module('App')
        .service('GeolocationService', GeolocationService);

    GeolocationService.$inject = ['$q', '$cordovaGeolocation', 'ObjectHelper', 'MapService',
                                  'IonicLoadingService', 'IonicPopupService'];

    function GeolocationService($q, $cordovaGeolocation, ObjectHelper, MapService,
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
            var title = "LOCATION ERROR";
            var message = "";
            IonicLoadingService.hide();
            switch(err.code) {
                case 1: message = "Please turn on Location Services(GPS) in your settings and try again";
                        break;
                case 2: message = "Please make sure that you have fast/reliable Internet Connection and try again";
                        break;
            }
            // An error occurred.
           IonicPopupService.showAlert(title, message);
        }

        /**
         * on geolocation watch success
         * @param position
         */
        function geolocationSuccess(position) {

            if(ObjectHelper.isObjectEmpty(vm.location))
            {
                vm.location.lat = position.coords.latitude;
                vm.location.lng = position.coords.longitude;
                vm.location.type = 'location';
                vm.location.zoom = 15;

                MapService.setCenter(vm.location);
                //make a marker for incident chosen
                MapService.addMarker(vm.location);

                IonicLoadingService.hide();
//            vm.watch.clearWatch();
                $cordovaGeolocation.clearWatch();
            }


        }
    }
})(window.angular);
