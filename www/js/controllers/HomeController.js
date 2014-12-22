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
        console.log(CryptoJS.SHA3('walakokabalo', { outputLength: 256 }).toString());
        //TODO retrieve id, name and password for
//        window.localStorage.setItem("id", '1234567890');
//        window.localStorage.setItem("name", 'Alvin Jay Cosare');
//        window.localStorage.setItem("password", 'walakokabalo');

        window.localStorage.setItem("id", '0987654321');
        window.localStorage.setItem("name", 'Marie Beth Venice');
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
                //initialize 'new' incidents
                $scope.newIncidentsRef = FirebaseService.getRef('/' + STATION_ID + '/new');
                //initialize 'ongoing' incidents for this officer only
                $scope.ongoingIncidentsRef = FirebaseService.getRef('/' + STATION_ID + '/ongoing/' + $scope.officer.id);

                //Get 'new' incidents array
                $scope.incidentsFirebaseArray = FirebaseService.getArray($scope.newIncidentsRef);
                $scope.incidentsFirebaseArray.$watch(watchIncidents);

                //TODO check if request was denied or approved
                //TODO retrieve officer assignment if any
                $scope.assignmentFirebaseObject = FirebaseService.getObject($scope.ongoingIncidentsRef);
                $scope.assignmentFirebaseObject.$bindTo($scope, "officer.assignment").then(function() {
                    console.log($scope.officer.assignment);
//                    $scope.officer.assignment.foo = 'bar';
                });
                $scope.assignmentFirebaseObject.$watch(function(){
                    console.log('updated');
                });
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
            if (typeof $scope.incident.requests === 'undefined')
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

        /**
         * Event watcher for incidentsFirebaseArray
         * @param data
         */
        function watchIncidents(data) {
            console.log(data.event + ' ' + data.key);
            var incident = $scope.incidentsFirebaseArray.$getRecord(data.key);
            console.log($scope.incidents);

            //case: new incident is added to the area of this officer
            if (data.event == "child_added" && data.key != "count" && ! objectExistsInArray(data.key, $scope.incidents))
            {
                try {
                    //check if the incident is a pending request for the officer
                    if (checkIfPendingRequest(incident))
                        $scope.pendingRequests.push(incident);
                    else
                        $scope.incidents.push(incident);

                    console.log(incident);
                } catch(e) {
                    console.log(e);
                }
                console.log('added');
            }
            //case: if officer has submitted a request for an incident
            // OR other officers have submitted request for an incident
            else if (data.event === 'child_changed')
            {
                if (checkIfPendingRequest(incident) && !objectExistsInArray(incident.$id, $scope.pendingRequests))
                {
                    $scope.pendingRequests.push(incident);
                    try {
                        if ($scope.isElementInObject(incident, $scope.incidents))
                            removeObjectFromArray(incident, $scope.incidents);
                    } catch(e){}
                }
            }
            //case: if incident has been assigned to another officer
            // OR is ignored
            // OR is assigned to this officer
            else if (data.event === 'child_removed') {
                //check if the incident removed was a pending request for this officer
                if (objectExistsInArray(data.key, $scope.pendingRequests))
                {
                    removeObjectFromArray(getObjectFromArray(data.key, $scope.pendingRequests), $scope.pendingRequests);
                    console.log('request has been assigned to another officer');
                }
                else {
                    removeObjectFromArray(getObjectFromArray(data.key, $scope.incidents), $scope.incidents);
                }
            }

            /**
             * Checks if key corresponds to an object in the array
             * @param key
             * @param list
             * @returns {boolean}
             */
            function objectExistsInArray(key, list){
                for (var i = 0; i < list.length; i++)
                {
                    if (list[i].$id === key)
                    {
                        return true;
                    }
                }
                return false;
            }

            /**
             * Removes the object from the array
             * @param obj
             * @param list
             */
            function removeObjectFromArray(obj, list) {
                console.log(obj);
                list.splice(list.indexOf(obj), 1);
            }

            /**
             * Retrieves object element from array based on key
             * @param key - Object identifier
             * @param list
             * @returns {*} - Object element or null
             */
            function getObjectFromArray(key, list){
                for (var i = 0; i < list.length; i++)
                {
                    if (list[i].$id === key)
                    {
                        return list[i];
                    }
                }
                return null;
            }

            /**
             * Checks if the officer submitted a request for the incident
             * @param incident
             * @returns {boolean}
             */
            function checkIfPendingRequest(incident){
                //check if incident.requests exists
                if (typeof incident.requests !== 'undefined')
                {
                    if (typeof incident.requests[$scope.officer.id] !== 'undefined')
                        return true;
                    return false;
                }

                return false;
            }
        }
        /**************************************************/
                         //MISC METHODS//
        /**************************************************/

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
         * Returns an object's length
         * params: obj - Object
         */
        function getObjectLength(obj){
            return Object.keys(obj).length;
        }

        /*
         *  Returns true if the object is an element of the list
         *  @params: obj - Object
         *  @params: list - Array
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