/* global Firebase */
(function(angular){
    angular.module('App')
        .service('FirebaseService', function($firebase, FIREBASE_URL, OFFICERS_URL){
            var CONNECTION_URL = FIREBASE_URL + '/.info/connected';
            return{
                getRef: function getRef(endpoint){
                    return new Firebase(FIREBASE_URL + endpoint);
                },
                getObject: function getObject(ref)
                {
                    return $firebase(ref).$asObject();
                },
                getArray: function getArray(ref)
                {
                    return $firebase(ref).$asArray();
                },
                getConnection: function getConnection(){
                    return new Firebase(CONNECTION_URL);
                },
                checkConnection: function checkConnection(){
                    return new Firebase(CONNECTION_URL);
                },
                getOfficerRef: function getOfficerRef(endpoint){
                    return new Firebase(OFFICERS_URL + endpoint);
                }
            }
        });
})(window.angular);