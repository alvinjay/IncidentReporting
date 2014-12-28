(function(angular){
    angular
        .module('App')
        .service('FirebaseService', FirebaseService);

    FirebaseService.$inject = ['$firebase', 'FIREBASE_URL', 'OFFICERS_URL'];

    function FirebaseService($firebase, FIREBASE_URL, OFFICERS_URL){
        var vm = this;

        vm.firebaseConnection = null;

        var CONNECTION_URL = FIREBASE_URL + '/.info/connected';

        var services = {
            firebaseConnection: vm.firebaseConnection,
            getRef: getRef,
            getObject: getObject,
            getArray: getArray,
            getConnection: getConnection,
            checkConnection: checkConnection,
            getOfficerRef: getOfficerRef,
            saveFirebaseArray: saveFirebaseArray
        };

        return services;

        function getRef(endpoint){
            return new Firebase(FIREBASE_URL + endpoint);
        }
        function getObject(ref){
            return $firebase(ref).$asObject();
        }
        function getArray(ref){
            return $firebase(ref).$asArray();
        }
        function getConnection(){
            return new Firebase(CONNECTION_URL);
        }
        function checkConnection(){
            return new Firebase(CONNECTION_URL);
        }
        function getOfficerRef(endpoint){
            return new Firebase(OFFICERS_URL + endpoint);
        }
        function saveFirebaseArray(array, record){
            return array.$save(record);
        }
    }
})(window.angular);