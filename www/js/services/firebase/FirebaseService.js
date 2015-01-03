(function(angular){
    angular
        .module('App')
        .service('FirebaseService', FirebaseService);

    FirebaseService.$inject = ['$q', '$firebase', 'FIREBASE_URL', 'OFFICERS_URL'];

    function FirebaseService($q, $firebase, FIREBASE_URL, OFFICERS_URL){
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
            saveFirebaseArray: saveFirebaseArray,
            incrementCount: incrementCount,
            decrementCount: decrementCount
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
        function incrementCount(count){
            var q = $q.defer();
            q.resolve(++count);
            return q.promise;
        }
        function decrementCount(count){
            var q = $q.defer();
            q.resolve(--count);
            return q.promise;
        }
    }
})(window.angular);