(function(angular){
    'use strict';

    angular
        .module('App')
        .service('InternetService', InternetService);

    InternetService.$inject = ['$rootScope', 'FirebaseService', 'IncidentsService'];

    function InternetService($rootScope, FirebaseService, IncidentsService){
        var vm = this;

        vm.connection = {
            isOnline: $rootScope.online,
            isConnected: false
        }

        var services = {
            connection: vm.connection,
            changeInternetStatus: changeInternetStatus,
            changeFirebaseStatus: changeFirebaseStatus
        };

        return services;

        /**
         * watcher: Internet connection
         * @param newStatus - 'online' | 'offline'
         */
        function changeInternetStatus(newStatus){
            var firebaseConnection = FirebaseService.firebaseConnection;
            //record new status
            vm.connection.isOnline = newStatus;
            if (typeof firebaseConnection === 'undefined' && newStatus)
            {
                console.log('waaaaaa');
                // watch for changes in firebase connection value
                firebaseConnection = FirebaseService.checkConnection();
                firebaseConnection.on('value', changeFirebaseStatus);
            }
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
    };
})(window.angular);
