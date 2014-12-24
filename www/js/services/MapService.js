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
            map: vm.map
        }
        return services;
    }

})(window.angular);