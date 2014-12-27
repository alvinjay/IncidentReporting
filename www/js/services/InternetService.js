(function(angular){
    'use strict';

    angular
        .module('App')
        .service('InternetService', InternetService);

    InternetService.$inject = ['FirebaseService'];

    function InternetService(FirebaseService){
        var vm = this;

        vm.isOnline = false;
        vm.isConnected = false;

        return {
            watchStatus: function watchStatus($scope){
                /* ref for firebase connection */
                $scope.firebaseConnection = FirebaseService.checkConnection();

                /* watch for Internet Connection status changes */
                $scope.$watch('online', function(newStatus) {
                    $scope.isOnline = newStatus;
                    $scope.firebaseConnection = FirebaseService.checkConnection();
                    $scope.root = FirebaseService.getRef('/');
                });
            },
            onFirebaseConnection: function onFirebaseConnection($scope){
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
            }
        }
    };
})(window.angular);
