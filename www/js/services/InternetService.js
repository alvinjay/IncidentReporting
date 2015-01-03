(function(angular){
    'use strict';

    angular
        .module('App')
        .service('InternetService', InternetService);

    InternetService.$inject = ['$rootScope', '$state',
                               'FirebaseService', 'IncidentsService', 'GeolocationService',
                                'IonicPopupService', 'IonicLoadingService'];

    function InternetService($rootScope, $state,
                             FirebaseService, IncidentsService, GeolocationService,
                             IonicPopupService, IonicLoadingService){
        var vm = this;

        vm.connection = {
            isOnline: $rootScope.online,
            isConnected: false
        };

        var disconnectMessage = "Please check your network connection and try again";

        var services = {
            connection: vm.connection,
            changeInternetStatus: changeInternetStatus,
            changeFirebaseStatus: changeFirebaseStatus
        };

        return services;

        /**
         * Watcher: Internet connection
         * @param newStatus - 'online' | 'offline'
         */
        function changeInternetStatus(newStatus){
            var firebaseConnection = FirebaseService.firebaseConnection;
            //record new status
            vm.connection.isOnline = newStatus;
            if (newStatus)
            {
                if ($state.current.name === 'app.map')
                    IonicLoadingService.show('Retrieving your location');

                // begin watching geolocation
                GeolocationService.watchStatus();
                // watch for changes in firebase connection value
                firebaseConnection = FirebaseService.checkConnection();
                firebaseConnection.on('value', changeFirebaseStatus);
            }
            else
                IonicPopupService.showAlert("NO INTERNET CONNECTION", disconnectMessage);
        }
        /**
         * watcher: Firebase connection
         * @param snap
         */
        function changeFirebaseStatus(snapshot) {
            if (snapshot.val()) {
                vm.connection.isConnected = true;
                console.log('Firebase: Connected');
                IncidentsService.retrieveFromFirebase();
            }
            else
            {
                vm.connection.isConnected = false;
                console.log('Firebase: Disconnected');
            }
        }
    }
})(window.angular);
