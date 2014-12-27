(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'officer', 'map', 'incident', 'incidents', 'requests',
                              'ObjectHelper',
                              'IonicPopupService', 'IonicModalService','IonicLoadingService',
                              'FirebaseService', 'IncidentsService', 'OfficerService',
                              '$cordovaGeolocation','$cordovaSplashscreen', '$cordovaDevice'];

    function HomeController($scope, officer, map, incident, incidents, requests,
                            ObjectHelper,
                            IonicPopupService, IonicModalService, IonicLoadingService,
                            FirebaseService, IncidentsService, OfficerService,
                            $cordovaGeolocation, $cordovaSplashscreen, $cordovaDevice){

        //TODO retrieve id, name and password for
//        window.localStorage.setItem("id", '1234567890');
//        window.localStorage.setItem("name", 'Alvin Jay Cosare');
//        window.localStorage.setItem("password", 'walakokabalo');

        window.localStorage.setItem("id", '0987654321');
        window.localStorage.setItem("areaCode", '04');
        window.localStorage.setItem("name", 'Marie Beth Venice');
        window.localStorage.setItem("password", 'walakokabalo');

        $scope.officer = officer;
        $scope.map = map;
        $scope.incident = incident;
        $scope.incidents = incidents;
        $scope.requests = requests;

        $scope.location = {};

        // model Internet and Firebase Connection
        $scope.isOnline = false;
        $scope.isConnected = false;

        $scope.openIncidentModal = openIncidentModal;
        $scope.closeIncidentModal = $scope.closeIncidentMapModal = IonicModalService.closeModal;
        $scope.openIncidentMapModal = IonicModalService.openIncidentMapModal;
//        $scope.closeIncidentMapModal = IonicModalService.closeModal;

        $scope.confirmPassword = confirmPassword;
        $scope.submitRequest = OfficerService.submitRequest;

        //misc methods
        $scope.getObjectLength = ObjectHelper.getObjectLength;
        $scope.isObjectInArray = ObjectHelper.isObjectInArray;
        $scope.isKeyInArray = ObjectHelper.isKeyInArray;

        // watch for Internet Connection status changes
        $scope.$watch('online', changeInternetStatus);

        function onDeviceReady() {
            IonicPopupService.showAlert($cordovaDevice.getUUID());
            // Now safe to use device APIs
            // access multiple numbers in a string like: '0612345678,0687654321'
            $cordovaSplashscreen.show();
        };
        /**
         * watcher: Internet connection
         * @param newStatus - 'online' | 'offline'
         */
        function changeInternetStatus(newStatus){
            //record new status
            $scope.isOnline = newStatus;
            console.log($scope.isOnline);
            if (typeof $scope.firebaseConnection === 'undefined' && newStatus)
            {
                console.log('waaaaaa');
                // watch for changes in firebase connection value
                $scope.firebaseConnection = FirebaseService.checkConnection();
                $scope.firebaseConnection.on('value', changeFirebaseStatus);
            }
        }
        /**
         * watcher: Firebase connection
         * @param snap
         */
        function changeFirebaseStatus(snapshot) {
            if (snapshot.val()) {
                $scope.isConnected = true;
                console.log('Firebase: Connected');
                retrieveFromFirebase();
            }
            else
            {
                $scope.isConnected = false;
                console.log('Firebase: Disconnected');
            }
        }
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
        /**
         * Opens an incident modal
         * @param key
         */
        function openIncidentModal(key){
            IonicModalService.openIncidentModal(key,$scope);
        }
        /*
         * on gelocation watch error
         */
        /**
         * retrieve assignment and incidents from Firebase
         */
        function retrieveFromFirebase(){
            IonicLoadingService.show();
            //Retrieve assignmentFirebaseObject
            IncidentsService.retrieveOfficerAssignment($scope.officer.id)
                .then(function(assignment){
                    $scope.assignmentFirebaseObject = assignment;
                    $scope.assignmentFirebaseObject.$bindTo($scope, "officer.assignment")
                        .then(function(){
                            //Retrieve incidentsFirebaseArray
                            return IncidentsService.retrieveNewIncidents(watchIncidents, $scope.officer.areaCode);
                        })
                        .then(function(incidents) {
                            $scope.incidentsFirebaseArray = incidents;
                            IonicLoadingService.hide();
                        });
                });
        }
        /**
         * watcher: incidentsFirebaseArray
         * @param data
         */
        function watchIncidents(data) {
            console.log(data.event + ' ' + data.key);
            var incident = IncidentsService.getIncident(data.key);
            IncidentsService.processIncident(data,incident);
        }

    }
})(window.angular);