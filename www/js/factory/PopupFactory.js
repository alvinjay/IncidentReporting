/**
 * Created by alvinjay on 1/3/15.
 */
(function(angular){
    'use strict';

    angular
        .module('App')
        .service('PopupFactory', PopupFactory);

    PopupFactory.$inject = [];

    function PopupFactory() {

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
                        onTap: function (e) {
                            if (!$scope.officer.confirmPassword) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                if ($scope.officer.password === $scope.officer.confirmPassword) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    }
                ]
            }
        };

        var services = {
            templates: templates
        };

        return services;

    }
})(window.angular);