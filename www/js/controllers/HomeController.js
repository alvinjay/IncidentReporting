(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'officer', 'map', 'incident', 'incidents', 'requests', 'connection', 'location',
                              'ObjectHelper',
                              'IonicPopupService', 'IonicModalService','IonicLoadingService',
                              'IncidentsService', 'OfficerService', 'InternetService', 'GeolocationService',
                              '$cordovaSplashscreen', '$cordovaDevice'];

    function HomeController($scope, officer, map, incident, incidents, requests, connection, location,
                            ObjectHelper,
                            IonicPopupService, IonicModalService, IonicLoadingService,
                            IncidentsService, OfficerService, InternetService, GeolocationService,
                            $cordovaSplashscreen, $cordovaDevice){

        //TODO retrieve id, name and password for
        window.localStorage.removeItem('assignment');
        window.localStorage.setItem("areaCode", '04');
        window.localStorage.setItem("id", '1234567890');
        window.localStorage.setItem("name", 'Alvin Jay Cosare');
        window.localStorage.setItem("password", 'walakokabalo');
//        window.localStorage.setItem("id", '0987654321');
//        window.localStorage.setItem("name", 'Marie Beth Venice');
//        window.localStorage.setItem("password", 'walakokabalo');

        $scope.officer = officer;
        try{
            $scope.assignment = JSON.parse(officer.assignment.toString());
        }catch(e){
            $scope.assignment = null
        }

        $scope.location = location;
        $scope.map = map;
        $scope.incident = incident;
        $scope.incidents = incidents;
        $scope.requests = requests;

        $scope.location = {};

        // model Internet and Firebase Connection
        $scope.connection = connection;

        $scope.openIncidentModal = IonicModalService.openIncidentModal;

        $scope.confirmPassword = confirmPassword;
        $scope.submitRequest = OfficerService.submitRequest;

        //misc methods
        $scope.getObjectLength = ObjectHelper.getObjectLength;
        $scope.isObjectInArray = ObjectHelper.isObjectInArray;
        $scope.isKeyInArray = ObjectHelper.isKeyInArray;

        // watch for Internet Connection status changes
        $scope.$watch('online', InternetService.changeInternetStatus);

        function onDeviceReady() {
            IonicPopupService.showAlert($cordovaDevice.getUUID());
            // Now safe to use device APIs
            // access multiple numbers in a string like: '0612345678,0687654321'
            $cordovaSplashscreen.show();
        };
        /**
         * Displays a popup for confirming officer's password
         */
        function confirmPassword(){
            IonicPopupService.showConfirmPassword($scope)
                .then(function(result){
                    if (result) { //if passwords match
                        IncidentsService.submitRequest()
                            .then(function(ref){
                                console.log('wa');
                                //4.) Close Loading Modal
                                IonicLoadingService.hide();
                                //5.) Close incident modal
                                IonicModalService.closeModal();
                                //6.) Show success Popup
                                IonicPopupService.showSuccess('Request has been submitted');
                        });
                    }
                });
        }
    }
})(window.angular);