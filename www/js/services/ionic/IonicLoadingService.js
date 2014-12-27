(function(angular){
    'use strict';

    angular
        .module('App')
        .service('IonicLoadingService', function($ionicLoading){
            var template = 'Loading Data';

            return{
                show: function showLoading(message){
                    $ionicLoading.show({
                        template:  (message || template) + '&nbsp;<i class="fa fa-spinner fa fa-spin"></i>',
                        delay: 180
                    });
                },
                hide: function hideLoading(){
                    $ionicLoading.hide();
                }
         }
    });
})(window.angular);