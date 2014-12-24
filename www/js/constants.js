(function(angular){
    'use strict';

    angular
        .module('App')
        .constant('FIREBASE_URL', 'https://incident-mapper.firebaseio.com')
        .constant('OFFICERS_URL', 'https://icma-officers.firebaseio.com/officers')
        .constant('STATION_ID', '04'); //TODO temporary. should be retrieved and saved in localStorage
})(window.angular);
