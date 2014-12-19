(function(angular){
    'use strict';

    angular
        .module('App')
        .filter('checkIfNull', checkIfNull);

    function checkIfNull(){
        return function (item) {
            if (item == 'null')
            {
                return 'not available'
            }
            return item;
        };
    }
})(window.angular);