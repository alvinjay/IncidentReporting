(function(angular){
    'use strict';

    angular
        .module('App')
        .service('MapService', MapService);

    MapService.$inject = [];

    function MapService(){
        var vm = this;
        vm.map = {
            center: {
                lat: null,
                lng: null,
                zoom: 10
            },
            defaults: {
                minZoom: 13
            },
            tiles: {
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            },
            markers: []
        };

        var services = {
            map: vm.map,
            setCenter: setCenter,
            registerMarker: registerMarker,
            addMarker: addMarker
        }
        return services;

        /**
         * Sets the center of the map to the given location
         * @param location - {lat,lng}
         */
        function setCenter(location){
            vm.map.center.lat = location.lat;
            vm.map.center.lng = location.lng;
        }

        /**
         * Registers a marker of the incident focused
         * @param incident
         */
        function registerMarker(incident){
            //specify center of map based on incident location
            vm.map.center.lat = incident.l[0];
            vm.map.center.lng = incident.l[1];

            addMarker([vm.map.center]);
        }

        /**
         * Add a marker on the map
         * @param location - {lat,lng}
         */
        function addMarker(location){
            //make a marker for incident chosen
            vm.map.markers.push({
                lat: location.lat,
                lng: location.lng,
                draggable: false
            });
        }
    }

})(window.angular);