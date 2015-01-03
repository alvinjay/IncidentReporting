(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('MapController', MapController);

    MapController.$inject = ['$scope', 'map', 'location', 'connection',
                             'GeolocationService', 'IonicLoadingService', 'MapService', 'InternetService'];

    function MapController($scope, map, location, connection,
                           GeolocationService, IonicLoadingService, MapService, InternetService){
        $scope.map = map;
        $scope.location = location;
        $scope.connection = connection;

        MapService.setZoom(14);

        // watch for Internet Connection status changes
        $scope.$watch('online', InternetService.changeInternetStatus);
    };

})(window.angular);