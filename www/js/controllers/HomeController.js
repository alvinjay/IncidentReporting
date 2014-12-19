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
            console.log(data.event);
            if (data.event == "child_added" && data.key != "count")
            {
                try {
                    //TODO: error trap what if incident already exists in $scope.incidents
                    var incident = $scope.incidentsFirebaseArray.$getRecord(data.key);
                    $scope.incidents.push(incident);
                    console.log(incident);
                } catch(e) {
                    console.log(e);
                }
                console.log('added');
            }
        }


    };
})(window.angular);