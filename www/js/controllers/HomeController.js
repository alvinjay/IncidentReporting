(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'officer', 'map', 'incidents', 'requests',
                              'ObjectHelper',
                              'IonicPopupService', 'IonicLoadingService', 'IonicModalService','FirebaseService', 'IncidentsService',
                              '$cordovaGeolocation','$cordovaSplashscreen', '$cordovaDevice'];

    function HomeController($scope, officer, map, incidents, requests,
                            ObjectHelper,
                            IonicPopupService, IonicLoadingService, IonicModalService, FirebaseService, IncidentsService,
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
        $scope.incidents = incidents;
        $scope.requests = requests;

        $scope.location = {};

        // model Internet and Firebase Connection
        $scope.isOnline = false;
        $scope.isConnected = false;

        $scope.openIncidentModal = openIncidentModal;
        $scope.closeIncidentModal = closeIncidentModal;
        $scope.openIncidentMapModal = openIncidentMapModal;
        $scope.closeIncidentMapModal = closeIncidentMapModal;

        $scope.confirmPassword = confirmPassword;
        $scope.submitRequest = submitRequest;

        //misc methods
        $scope.getObjectLength = ObjectHelper.getObjectLength;
        $scope.isObjectInArray = ObjectHelper.isObjectInArray;

        // watch for Internet Connection status changes
        $scope.$watch('online', changeInternetStatus);

        // begin watching geolocation
        var watch = $cordovaGeolocation.watchPosition({ enableHighAccuracy: true });
        watch.promise.then(null,geolocationError,geolocationSuccess);

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
            if (typeof $scope.firebaseConnection === 'undefined' && newStatus)
            {
                console.log('waaaaaa');
                // watch for changes in firebase connection value
                $scope.firebaseConnection = FirebaseService.checkConnection();
                $scope.firebaseConnection.on('value', changeFirebaseStatus);
            }
        };
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
        /*
         * open incident modal
         * Params: id int
         */
        function openIncidentModal(key){
            //retrieve incident based on key
            $scope.incident = IncidentsService.getIncident(key);
            //open modal
            IonicModalService.openIncidentModal($scope);
        }
        /*
         * close incident modal
         */
        function closeIncidentModal(){
            IonicModalService.closeModal($scope);
        }
        /*
         * locate incident in a map modal
         */
        function openIncidentMapModal(){
            //specify center of map based on incident location
            $scope.map.center.lat = $scope.incident.l[0];
            $scope.map.center.lng = $scope.incident.l[1];

            //make a marker for incident chosen
            $scope.map.markers.push({
                lat: $scope.map.center.lat,
                lng: $scope.map.center.lng,
                draggable: false
            });
            IonicModalService.openIncidentMapModal($scope);
        }
        /*
         * close incident map modal
         */
        function closeIncidentMapModal(){
            IonicModalService.closeModal($scope);
            $scope.map.markers.splice(0, 1);
        }
        /*
         * confirm password for security purposes
         */
        function confirmPassword(){
            IonicPopupService.showConfirmPassword($scope)
                .then(function(result){
                    if (result)
                    {
                        //if passwords match then call this
                        $scope.submitRequest();
                    }
                });
        }
        /*
         * submit request for assignment
         */
        function submitRequest(){
            //1.) Show Loading Modal (Submitting request...)
            IonicLoadingService.show('Submitting request...');
            //2.) Edit $scope.incident (add 'requests' node)
            //Check if requests has not been defined YET
            if (typeof $scope.incident.requests === 'undefined')
                $scope.incident.requests = {};
            // Insert new request
            $scope.incident.requests[$scope.officer.id] =  true;
            //3.) Do $scope.incidents($scope.incident).$save
            $scope.incidentsFirebaseArray.$save($scope.incident)
                .then(function(ref){
                    //4.) Close Loading Modal
                    IonicLoadingService.hide();
                    //5.) Close incident modal
                    IonicModalService.closeModal($scope);
                    //6.) Show success Popup
                    IonicPopupService.showSuccess('Request has been submitted');
                });
        }
        /*
         * on gelocation watch error
         */
        function geolocationError(err) {
            // An error occurred.
            $('#geolocation').html('Error Code:' + err.code + '</br>Message:' + err.message);
        }
        /*
         * on geolocation watch success
         */
        function geolocationSuccess(position) {
            $scope.location.lat =  position.coords.latitude;
            $scope.location.lng =  position.coords.longitude;

            var str = 'Latitude: '  + $scope.location.latitude  + '<br/>' +
                ' Longitude: ' + $scope.location.longitude + '<br />';
            $('#geolocation').html(str);

            // clear watch
            $cordovaGeolocation.clearWatch(watch.watchID);
        }
        /**
         * retrieve assignment and incidents from Firebase
         */
        function retrieveFromFirebase(){
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