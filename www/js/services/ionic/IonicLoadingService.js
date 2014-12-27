/* global Firebase */
(function(angular){
    angular.module('App')
        .service('IonicLoadingService', function($ionicLoading){
            return{
                show: function showLoading(message){
                    $ionicLoading.show({
                        template:  message||'Loading Data...',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200
                    });
                },
                hide: function hideLoading(){
                    $ionicLoading.hide();
                }
         }
    });
})(window.angular);