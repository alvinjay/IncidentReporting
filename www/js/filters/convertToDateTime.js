(function(angular){
    'use strict';

    angular
        .module('App')
        .filter('convertToDateTime', convertToDateTime);

    function convertToDateTime(){
        return function (item) {
            return new Date(item).toString();
        };
    }
})(window.angular);