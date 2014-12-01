/* global Firebase */
(function(angular){
    angular.module('App')
        .controller('MapController', function($scope, IonicModalService){
            $('input').blur();

            $scope.info = {
                name: window.localStorage.getItem("name"),
                contact: window.localStorage.getItem("contact")
            }

            $scope.openPersonalInfoModal = function(){
                IonicModalService.openPersonalInfoModal($scope);
            }

            $scope.closePersonalInfoModal = function(){
                IonicModalService.closeModal($scope);
            }

            $scope.setPersonalInfo = function(){
                try{
                    window.localStorage.setItem("name", $scope.info.name);
                    window.localStorage.setItem("contact", $scope.info.contact);
                    console.log('yey');
                    IonicModalService.closeModal($scope);

                } catch(e) {
                    console.log('error');
                }
            }
        });
})(window.angular);