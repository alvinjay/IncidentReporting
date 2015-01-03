(function(angular){
    'use strict';

    angular
        .module('App')
        .service('IonicLoadingService', IonicLoadingService);

    IonicLoadingService.$inject = ['$ionicLoading'];

    function IonicLoadingService($ionicLoading){
        var template = 'Loading Data';

        var services = {
            show: show,
            hide: hide
        };

        /**
         * Displays a loading modal over the current UI with a message displayed
         * @param message
         */
        function show(message){
            $ionicLoading.show({
                template:  (message || template) + '&nbsp;<i class="fa fa-spinner fa fa-spin"></i>',
                delay: 180
            });
        }

        /**
         * Hides current loading modal displayed
         */
        function hide(){
            $ionicLoading.hide();
        }

        return services;
    }
})(window.angular);