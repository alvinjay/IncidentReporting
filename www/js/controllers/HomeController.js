(function(angular){
    'use strict';

    angular.module('App')
        .controller('HomeController', HomeController);
    HomeController.$inject = ['$scope', 'IonicPopupService', 'IonicLoadingService', 'IonicModalService',
                              'FirebaseService', '$cordovaDialogs', '$cordovaGeolocation', '$cordovaCamera',
                              '$cordovaSplashscreen', '$stateParams'];
    function HomeController($scope, IonicPopupService, IonicLoadingService, IonicModalService, FirebaseService,
                            $cordovaDialogs, $cordovaGeolocation, $cordovaCamera, $cordovaSplashscreen, $stateParams){

            $scope.assignment = {
                id: 1
            };

            $scope.incidents = [
                {
                    id: 1
                },
                {
                    id: 2
                }
            ];
           $scope.location = {};

            $scope.$on('$viewContentLoaded', function(){
                $('#settings').html("Name: " + window.localStorage.getItem("name") +
                    "</br>Contact: " + window.localStorage.getItem("contact"));
            });

            /* model Internet and Firebase Connection */
            $scope.isOnline = false;
            $scope.isConnected = false;

            /* input groups shown status */
            $scope.typeGroup = false;
            $scope.infoGroup = false;

            /* ref for firebase connection */
            $scope.firebaseConnection = FirebaseService.checkConnection();

            /* watch for Internet Connection status changes */
            $scope.$watch('online', function(newStatus) {
                $scope.isOnline = newStatus;
                $scope.firebaseConnection = FirebaseService.checkConnection();
                $scope.root = FirebaseService.getRef('/');
                // Create a new GeoFire instance, pulling data from the public transit data
                $scope.geoFire = new GeoFire($scope.root.child('station1/new'));
            });

            /* watch for changes in firebase connection value */
            $scope.firebaseConnection.on('value', function(snap) {
                if (snap.val() === true) {
                    $scope.isConnected = true;
                    $('#firebase').html('Firebase: Connected');
                    console.log(
                        'Internet:' + $scope.isOnline +
                            '\nFirebase: ' + $scope.isConnected
                    );
                }
                else
                {
                    $scope.isConnected = false;
                    $('#firebase').html('Firebase: Disconnected');
                }
            });

            // begin watching
            var watch = $cordovaGeolocation.watchPosition({ enableHighAccuracy: true });
            watch.promise.then(function() { /* Not  used */ },
                function(err) {
                    // An error occurred.
                    $('#geolocation').html('Error Code:' + err.code + '</br>Message:' + err.message);
                },
                function(position) {
                    $scope.location.latitude =  position.coords.latitude;
                    $scope.location.longitude =  position.coords.longitude;
                    var str = 'Latitude: '  + $scope.location.latitude  + '<br/>' +
                        ' Longitude: ' + $scope.location.longitude + '<br />';
                    $('#geolocation').html(str);
                });

            // clear watch
//            $cordovaGeolocation.clearWatch(watch.watchID)

            function onDeviceReady() {
                // Now safe to use device APIs
                // access multiple numbers in a string like: '0612345678,0687654321'
                $cordovaSplashscreen.show();
//                $cordovaDialogs.alert(isOnline);
            };


            /*
             * toggle accordion group shown
             */
            $scope.toggleGroup = function(group) {
                if (group == 'type') {
                    $scope.typeGroup = !$scope.typeGroup;
                } else {
                    $scope.infoGroup = !$scope.infoGroup;
                }
            };

            /* select incident type */
            $scope.selectType = function(typeSelected){
                $scope.type.name = $scope.input.type = typeSelected;
                $scope.typeGroup = false;
            };

            /* refresh UI bug in angular JS */
            $scope.refreshUI = function(){
                $scope.typeGroup = !$scope.typeGroup;
                $scope.typeGroup = !$scope.typeGroup;
            };



            /* process location before submitting report */
            $scope.submitReport = function(){
                IonicLoadingService.show('Submitting Report...');
//                newIncident.set($scope.input);
                //TO DO: add code to determine station number
//                console.log(new Date().getTime());
                $scope.input.timestamp = new Date().getTime();
                //station(N)/new ref
//                var station = $scope.root.child('station1/new');

                var temp = $scope.geoFire.ref().push();
                var key = temp.key();
                var obj = {}
                obj[key] = {
                    "location": [$scope.location.latitude,$scope.location.longitude],
                    "data": $scope.input
                };
//                console.log(obj);
                $scope.geoFire.set(obj).then(function() {
//                    $scope.geoFire.ref().child(key).update($scope.input);
                    console.log('inserted');
                }, function(error) {
                    console.log("Error: " + error);
                });

                var countRef = $scope.geoFire.ref().child('count');
//                var countRef = station.child('count');
                countRef.once('value', function(snapshot){
                    //get initial count;
                    var count = parseInt(snapshot.val());
                    //push new object to firebase
//                    station.push($scope.input);
                    //update count in firebase
                    $scope.geoFire.ref().update({ count: ++count + ''}, function(snapshot){
//                        console.log('new count:' + snapshot.val());
                    });
                    IonicLoadingService.hide();
                    IonicPopupService.showSuccess("Please wait for a text message/call from the police");
                });
            }

            $scope.takePicture = function() {
                var options = {
                    quality : 50,
                    destinationType : Camera.DestinationType.DATA_URL,
                    sourceType : Camera.PictureSourceType.CAMERA,
                    allowEdit : true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 600,
//                    targetWidth: 2048,
                    targetHeight: 480,
//                    targetHeight: 1536,
                    correctOrientation: true,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };

                $cordovaCamera.getPicture(options).then(function(imageData) {
                    // Success! Image data is here
                    var image = document.getElementById('attachmentImage');
                    image.src = "data:image/jpeg;base64," + imageData;
                    $scope.input.attachments.img = imageData;
                }, function(err) {
                    $('#firebase').html(err);
                    // An error occured. Show a message to the user
                });
            }

            $scope.openIncidentModal = function(id){
              var index = $scope.incidents.findIndex(function(element,index,array){
                     if (element.id == id)
                        return true;
              });
              //supposed to be $scope.incident.$getRecord(id);
              $scope.incident = $scope.incidents[index];
              IonicModalService.openIncidentModal($scope);
            };

            $scope.closeIncidentModal = function(){
              IonicModalService.closeModal($scope);
            };

        };
})(window.angular);