/* global Firebase */
(function(angular){
    'use strict';

    angular
        .module('App')
        .service('IonicPopupService', function($ionicPopup){
            var templates = {
                confirm: {
                    title: null,
                    template: null,
                    scope: null,
                    okText: 'Confirm', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive' // String (default: 'button-positive'). The type of the OK button.
                },
                alert: {
                    title: null,
                    template: null
                },
                success: {
                    title: "Success&nbsp;<i class='fa fa-check-circle'></i>",
                    subTitle: null,
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-balanced'
                        }
                    ]
                },
                confirmPassword: {
                    template: '<input type="password" ng-model="officer.confirmPassword">',
                    title: '<p>Confirm Password</p>',
                    subTitle: 'Enter your password',
                    scope: null,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<b>Confirm</b>',
                            type: 'button-balanced',
                            onTap: function(e) {
                                if (!$scope.officer.confirmPassword) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    if ($scope.officer.password === $scope.officer.confirmPassword)
                                    {
                                        return true;
                                    }
                                    return false;
                                }
                            }
                        }
                    ]
                }
            };

            return{
                showConfirm: function showConfirm(title, message){
                    templates.confirm.title = title;
                    templates.confirm.template = template;
                    $ionicPopup.confirm(templates.confirm);
                },
                showAlert: function showAlert(title, message){
                    templates.alert.title = title;
                    templates.alert.template = message;

                    $ionicPopup.alert(templates.alert);
                },
                showSuccess: function showSuccess(message){
                    templates.success.subTitle = message;

                    $ionicPopup.show(templates.success);
                },
                showConfirmPassword: function showConfirmPassword($scope){
                    templates.confirmPassword.scope = $scope;
                    templates.confirmPassword.buttons = [
                        { text: 'Cancel' },
                        {
                            text: '<b>Confirm</b>',
                            type: 'button-balanced',
                            onTap: function(e) {
                                if (!$scope.officer.confirmPassword) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    if ($scope.officer.password !== $scope.officer.confirmPassword)
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
       });
})(window.angular);