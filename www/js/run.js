(function(angular){
    'use strict';

    angular
        .module('App')
        .run(function($ionicPlatform, $window, $rootScope, $location) {
            $ionicPlatform.ready(function() {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if(window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if(window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.backgroundColorByHexString('#000000');
                    StatusBar.styleBlackOpaque();
//                StatusBar.hide();
                }
            });

            $rootScope.online = navigator.onLine;
            $window.addEventListener("offline", function () {
                $rootScope.$apply(function() {
                    $rootScope.online = false;
                });
            }, false);

            $window.addEventListener("online", function () {
                $rootScope.$apply(function() {
                    $rootScope.online = true;
                });
            }, false);

            $location.path('/');
        });

})(window.angular);