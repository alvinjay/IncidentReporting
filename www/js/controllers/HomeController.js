(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'IonicPopupService', 'IonicLoadingService', 'IonicModalService',
                              'FirebaseService', '$cordovaDialogs', '$cordovaGeolocation', '$cordovaCamera',
                              '$cordovaSplashscreen', '$stateParams', 'STATION_ID'];

    function HomeController($scope, IonicPopupService, IonicLoadingService, IonicModalService, FirebaseService,
                            $cordovaDialogs, $cordovaGeolocation, $cordovaCamera, $cordovaSplashscreen, $stateParams,
                            STATION_ID){
        //TODO: temporary
//        window.localStorage.removeItem('pendingRequest');

        //TODO retrieve id, name and password for
        window.localStorage.setItem("id", '1234567890');
        window.localStorage.setItem("name", 'Alvin Jay Cosare');
        window.localStorage.setItem("password", 'walakokabalo');

        $scope.officer = {
            id: window.localStorage.getItem("id"),
            name: window.localStorage.getItem("name"),
            password: window.localStorage.getItem("password"),
            confirmPassword: 'walakokabalo',
            pendingRequests: ((window.localStorage.getItem('pendingRequest') === null) ? {} : JSON.parse(window.localStorage.getItem('pendingRequest'))),
            assignment: null
        };

        $scope.defaults = {
            minZoom: 13
        }

        $scope.center = {
            zoom: 16
        }

        //DUMMY DATA
        $scope.assignment = {
            id: 1
        };

        $scope.pendingRequests = [];
        $scope.incidents = [];
        $scope.markers = [];

        //DUMMY DATA END

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
        $scope.hash = hash;
        $scope.getObjectLength = getObjectLength;
        $scope.isElementInObject = isElementInObject;

        // watch for Internet Connection status changes
        $scope.$watch('online', changeInternetStatus);

        // begin watching geolocation
        var watch = $cordovaGeolocation.watchPosition({ enableHighAccuracy: true });
        watch.promise.then(null,geolocationError,geolocationSuccess);

        function onDeviceReady() {
            // Now safe to use device APIs
            // access multiple numbers in a string like: '0612345678,0687654321'
            $cordovaSplashscreen.show();
        };

        /*
         * callback called when internet connection status has changed
         */
        function changeInternetStatus(newStatus){
            //record new status
            $scope.isOnline = newStatus;
            // watch for changes in firebase connection value
            $scope.firebaseConnection = FirebaseService.checkConnection();
            $scope.firebaseConnection.on('value', changeFirebaseStatus);
            // Create a new GeoFire instance, pulling data from the public transit data
            $scope.geoFire = new GeoFire(FirebaseService.getRef('/' + STATION_ID + '/new'));
        };

        /*
         * callback called when connection to firebase server is established
         */
        function changeFirebaseStatus(snap) {
            if (snap.val() === true) {
                $scope.isConnected = true;
                $('#firebase').html('Firebase: Connected');
                console.log(
                    'Internet:' + $scope.isOnline +
                        '\nFirebase: ' + $scope.isConnected
                );
                //initialize incidents firebase ref
                $scope.incidentsRef = FirebaseService.getRef('/' + STATION_ID + '/new');
                //Get Array
                $scope.incidentsFirebaseArray = FirebaseService.getArray($scope.incidentsRef);
                $scope.incidentsFirebaseArray.$watch(watchIncidents);
            }
            else
            {
                $scope.isConnected = false;
                $('#firebase').html('Firebase: Disconnected');
            }
        }

        /*
         * open incident modal
         * Params: id int
         */
        function openIncidentModal(key){
            //retrieve incident based on key
            $scope.incident = $scope.incidentsFirebaseArray.$getRecord(key);

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
            $scope.center.lat = $scope.incident.l[0];
            $scope.center.lng = $scope.incident.l[1];

            //make a marker for incident chosen
            $scope.markers.push({
                lat: $scope.center.lat,
                lng: $scope.center.lng,
                draggable: false
            });

            IonicModalService.openIncidentMapModal($scope);
        }

        /*
         * close incident map modal
         */
        function closeIncidentMapModal(){
            IonicModalService.closeModal($scope);
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
            if (typeof $scope.incident.request === 'undefined')
                $scope.incident.requests = {};
            // Insert new request
            $scope.incident.requests[$scope.officer.id] =  true;
            //3.) Do $scope.incidents($scope.incident).$save
            $scope.incidentsFirebaseArray.$save($scope.incident)
                .then(function(ref){
                    //4.) Save $scope.incident ID to window.localStorage and $scope.officer.pendingRequest
                    $scope.officer.pendingRequests[ref.key()] = true;
                    window.localStorage.setItem('pendingRequest', JSON.stringify($scope.officer.pendingRequests));
                    //5.) Close Loading Modal
                    IonicLoadingService.hide();
                    //6.) Close incident modal
                    IonicModalService.closeModal($scope);
                    //7.) Show success Popup
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
        /*
         * callback whenever changes are made to incidentsFirebaseArray
         */
        function watchIncidents(data) {
            console.log(data.event + ' ' + data.key);
            var incident = $scope.incidentsFirebaseArray.$getRecord(data.key);
            console.log($scope.incidents);
            //check if the incident is a pending request for the officer
            if (data.event === 'child_changed' || (Object.keys($scope.officer.pendingRequests).length !== 0 && $scope.officer.pendingRequests[data.key]))
            {
                console.log(data.key);
                $scope.pendingRequests.push(incident);
                try {
                    if ($scope.isElementInObject(incident, $scope.incidents))
                        removeObjectFromArray(incident, $scope.incidents);
                } catch(e){}
            }
            else if (data.event == "child_added" && data.key != "count" && ! alreadyExists(data.key, $scope.incidents))
            {
                try {
                    $scope.incidents.push(incident);
                    console.log(incident);
                } catch(e) {
                    console.log(e);
                }
                console.log('added');
            }

            function alreadyExists(key, list){
                for (var i = 0; i < list.length; i++)
                {
                    if (list[i].$id === key)
                    {
                        return true;
                    }
                    return false;
                }
            }

            function removeObjectFromArray(obj, list) {
                console.log('wa');
                console.log(list);
                list.splice(list.indexOf(obj), 1);
            }
        }
        /**************************************************/
                //TEMPORARY FUNCTIONS//
        /*
         * SHA-3 Encryption
         */
        function hash() {
            var hash1 = CryptoJS.SHA3($scope.officer.name+'\n'+$scope.officer.password, { outputLength: 256 }).toString()
            var hash2 = CryptoJS.SHA3($scope.officer.name+'\n'+$scope.officer.confirmPassword, { outputLength: 256 }).toString()
            if (hash1 === hash2)
            {
                console.log('yes');
            } else {
                console.log('no');
            }
        }
        
        /*
         * returns an object's length
         * params: obj - Object
         */
        function getObjectLength(obj){
            return Object.keys(obj).length;
        }

        /*
         *  returns true if the object is an element of the list
         *  params: obj - Object, list - Array
         */
        function isElementInObject(obj, list){
            for (var i = 0; i < list.length; i++) {
                if (list[i] === obj) {
                    return true;
                }
            }
            return false;
        }

    };
})(window.angular);