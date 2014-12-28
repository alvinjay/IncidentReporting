(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('MapController', MapController);

    MapController.$inject = ['$scope', 'map', 'location', 'connection',
                             'GeolocationService', 'InternetService'];

    function MapController($scope, map, location, connection,
                           GeolocationService, InternetService){
        $scope.map = map;
        $scope.location = location;
        $scope.connection = connection;

        // watch for Internet Connection status changes
        $scope.$watch('online', InternetService.changeInternetStatus);


        // begin watching geolocation
        if (typeof location.lat === 'undefined')
            GeolocationService.watchStatus();


    };

})(window.angular);