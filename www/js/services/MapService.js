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
            marker: [],
            markers: []

        };

        var services = {
            map: vm.map,
            setCenter: setCenter,
            setZoom: setZoom,
            registerMarker: registerMarker,
            addMarker: addMarker,
            resetMarker: resetMarker,
            removeMarker: removeMarker
        };

        return services;

        /**
         * Sets the center of the map to the given location
         * @param location - {lat,lng}
         */
        function setCenter(location){
            vm.map.center.lat = location.lat;
            vm.map.center.lng = location.lng;
            vm.map.center.zoom = location.zoom || vm.map.center.zoom;
        }

        /**
         * Sets the zoom level of the map
         * @param value
         */
        function setZoom(value){
            vm.map.center.zoom = value;
        }

        /**
         * Registers a marker of the incident focused
         * @param incident
         */
        function registerMarker(incident){
            var marker = {
                lat: incident.l[0],
                lng: incident.l[1],
                draggable: false
            };

            var center = {
                lat: marker.lat,
                lng: marker.lng,
                zoom: 16
            };
            //specify center of map based on incident location
            setCenter(center);

            vm.map.marker.push(marker);
        }

        /**
         * Add a marker on the map
         * @param location - {lat,lng}
         */
        function addMarker(location){
            var marker = {
                lat: location.lat,
                lng: location.lng,
                message: location.message,
                draggable: false
            };

            if (location.type === "location"){
                marker.focus = true;
                marker.message = "You are here";
            }

            if (!markerAlreadyExists(marker)) //make a marker for incident chosen
                vm.map.markers.push(marker);

        }

        /**
         * Resets the marker focused
         */
        function resetMarker(){
            vm.map.marker = [];
        }

        /**
         * Returns true if the marker already exists in the markers array
         * @param marker
         * @returns {boolean}
         */
        function markerAlreadyExists(marker){
            for (var i in vm.map.markers){
                if(vm.map.markers[i].message === marker.message)
                    return true;
            }
            return false;
        }

        /**
         * Removes a marker from map.markers
         * @param key
         */
        function removeMarker(key){
            var markers = vm.map.markers;
            for(var i in markers){
                if (markers[i].message === key){
                    markers.splice(i, 1);
                    break;
                }
            }
            console.log('markers');
            console.log(markers);
        }
    }

})(window.angular);