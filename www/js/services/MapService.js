(function(angular){
    'use strict';

    angular
        .module('App')
        .service('MapService', MapService);

    MapService.$inject = [];

    function MapService(){
        var vm = this;
        vm.map = {
            defaults: {
                minZoom: 13
            },
            tiles: {
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            },
            center: {
                zoom: 16
            },
            markers: []
        };

        var services = {
            map: vm.map,
            registerMarker: registerMarker
        }
        return services;

        /**
         * Registers a marker of the incident focused
         * @param incident
         */
        function registerMarker(incident){
            //specify center of map based on incident location
            vm.map.center.lat = incident.l[0];
            vm.map.center.lng = incident.l[1];

            //make a marker for incident chosen
            vm.map.markers.push({
                lat: vm.map.center.lat,
                lng: vm.map.center.lng,
                draggable: false
            });
        }
    }

})(window.angular);