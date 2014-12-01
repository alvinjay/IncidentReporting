/* global Firebase */
(function(angular){
    angular.module('App')
        .service('IonicModalService', function($ionicModal){

            return{
                openIncidentModal: function openIncidentModal($scope) {
                    $ionicModal.fromTemplateUrl('views/home/modal/incident.html', {
                        scope: $scope,
                        animation: 'slide-in-right'
                    }).then(function(modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
                },
                openPersonalInfoModal: function openPersonalInfoModal($scope) {
                    $ionicModal.fromTemplateUrl('views/settings/modal/personal.html', {
                        scope: $scope,
                        animation: 'slide-in-right'
                    }).then(function(modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
                },
                closeModal: function closeTypeModal($scope){
                    $scope.modal.hide();
                    $scope.modal.remove();
                }
         }
    });
})(window.angular);