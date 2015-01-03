(function(angular){
    'use strict';

    angular
        .module('App')
        .service('IonicPopupService', IonicPopupService);

    IonicPopupService.$inject = ['$rootScope', '$ionicPopup', 'OfficerService', 'PopupFactory'];

    function IonicPopupService($rootScope, $ionicPopup, OfficerService, PopupFactory){
        var vm = this;

        vm.scope = $rootScope.$new();

        vm.scope.officer = OfficerService.officer;

        var templates = PopupFactory.templates;

        var services = {
            showConfirm: showConfirm,
            showAlert: showAlert,
            showSuccess: showSuccess,
            showConfirmPassword: showConfirmPassword
        };

        return services;

        function showConfirm(title, message){
            templates.confirm.title = title;
            templates.confirm.template = template;
            $ionicPopup.confirm(templates.confirm);
        }
        function showAlert(title, message){
            templates.alert.title = title;
            templates.alert.template = message;

            $ionicPopup.alert(templates.alert);
        }
        function showSuccess(message){
            templates.success.subTitle = message;

            $ionicPopup.show(templates.success);
        }
        function showConfirmPassword(){
            templates.confirmPassword.scope = vm.scope;
            templates.confirmPassword.buttons = [
                { text: 'Cancel' },
                {
                    text: '<b>Confirm</b>',
                    type: 'button-balanced',
                    onTap: function(e) {
                        if (!vm.scope.officer.confirmPassword) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            if (vm.scope.officer.password !== vm.scope.officer.confirmPassword)
                            {
                                templates.alert.title = '<p style="font-family: copperplate; color: whitesmoke;">Incorrect Password</p>';
                                templates.alert.buttons = [
                                    { text: 'Try Again' }
                                ];
                                $ionicPopup.alert(templates.alert);
                                e.preventDefault();
                            } else {
                                return true;
                            }
                        }
                    }
                }
            ];
            return $ionicPopup.confirm(templates.confirmPassword);
        }
   }
})(window.angular);