(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'officer', 'map', 'incident', 'incidents', 'requests', 'connection', 'location',
                              'ObjectHelper',
                              'IonicPopupService', 'IonicModalService',
                              'OfficerService', 'InternetService',
                              '$cordovaSplashscreen', '$cordovaDevice'];

    function HomeController($scope, officer, map, incident, incidents, requests, connection, location,
                            ObjectHelper,
                            IonicPopupService, IonicModalService,
                            OfficerService, InternetService,
                            $cordovaSplashscreen, $cordovaDevice){

        //TODO retrieve id, name and password for
//        window.localStorage.removeItem('assignment');
        window.localStorage.setItem("areaCode", '04');
//        window.localStorage.setItem("id", '1234567890');
//        window.localStorage.setItem("name", 'Alvin Jay Cosare');
//        window.localStorage.setItem("password", 'walakokabalo');
        window.localStorage.setItem("id", '0987654321');
        window.localStorage.setItem("name", 'Marie Beth Venice');
        window.localStorage.setItem("password", 'walakokabalo');
//        console.log(window.localStorage.getItem('assignment'));
        $scope.officer = officer;
        $scope.assignment = officer.assignment;

        $scope.location = location;
        $scope.map = map;
        $scope.incident = incident;
        $scope.incidents = incidents;
        $scope.requests = requests;

        $scope.location = {};

        // model Internet and Firebase Connection
        $scope.connection = connection;

        $scope.openIncidentModal = IonicModalService.openIncidentModal;

        $scope.submitRequest = OfficerService.submitRequest;

        //misc methods
        $scope.getObjectLength = ObjectHelper.getObjectLength;
        $scope.isObjectInArray = ObjectHelper.isObjectInArray;
        $scope.isKeyInArray = ObjectHelper.isKeyInArray;
        $scope.isObjectEmpty = ObjectHelper.isObjectEmpty;

        // watch for Internet Connection status changes
        $scope.$watch('online', InternetService.changeInternetStatus);

        function onDeviceReady() {
            IonicPopupService.showAlert($cordovaDevice.getUUID());
            // Now safe to use device APIs
            // access multiple numbers in a string like: '0612345678,0687654321'
            $cordovaSplashscreen.show();
        }
    }
})(window.angular);