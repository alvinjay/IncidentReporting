/* global Firebase */
(function(angular){
    angular.module('App')
        .service('IonicPopupService', function($ionicPopup){
            return{
                showConfirm: function showConfirm(title, message){
                        $ionicPopup.confirm({
                            title: title,
                            template: message,
                            scope: $scope,
                            okText: 'Confirm', // String (default: 'OK'). The text of the OK button.
                            okType: 'button-assertive' // String (default: 'button-positive'). The type of the OK button.
                        });
                },
                showAlert: function showAlert(title, message){
                    $ionicPopup.alert({
                        title: title,
                        template: message
                    });
                },
                showSuccess: function showSuccess(message){
                    $ionicPopup.show({
                        title: "Success&nbsp;<i class='fa fa-check-circle'></i>",
                        subTitle: message,
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-balanced'
                            }
                         ]
                    });
                }
          }
       });
})(window.angular);