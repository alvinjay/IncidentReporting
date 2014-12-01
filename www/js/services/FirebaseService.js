/* global Firebase */
(function(angular){
    angular.module('App')
        .service('FirebaseService', function($firebase, FIREBASE_URL){
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
//                    connectionRef.on('value', function(snap) {
//                        if (snap.val() === true) {
//                            // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
//                            // add this device to my connections list
//                            // this value could contain info about the device or a timestamp too
////                    var con = myConnectionsRef.push(true);
//                            // when I disconnect, remove this device
////                    con.onDisconnect().remove();
//                            // when I disconnect, update the last time I was seen online
////                    lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
//                            IonicLoadingService.show();
//                            return true;
//                        }
//                        else
//                           return false;
//                    });
                    return new Firebase(CONNECTION_URL);

                }
            }
        });
})(window.angular);