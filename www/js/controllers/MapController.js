(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('MapController', MapController);

    MapController.$inject = ['$scope', 'map', 'location', 'GeolocationService'];

    function MapController($scope, map, location, GeolocationService){
        $scope.map = map;
        $scope.location = location;
        console.log(location);

        // begin watching geolocation
        if (typeof location.lat === 'undefined')
            GeolocationService.watchStatus();


    };

})(window.angular);