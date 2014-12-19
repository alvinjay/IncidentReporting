/* global Firebase */
(function(angular){
    angular.module('App')
        .service('IonicModalService', function($ionicModal){
            var double = null;
            return{
                openIncidentModal: function openIncidentModal($scope) {
                    $ionicModal.fromTemplateUrl('views/home/modal/incident.html', {
                        scope: $scope,
                        animation: 'slide-in-right'
                    }).then(function(modal) {
                        $scope.modal = double = modal;
                        $scope.modal.show();
                    });
                },
                openIncidentMapModal: function openIncidentMapModal($scope) {
                    $ionicModal.fromTemplateUrl('views/home/modal/incidentMap.html', {
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
                    if(double !== null) {
                        $scope.modal.hide();
                        $scope.modal = double;
                        double = null;
                    } else {
                        $scope.modal.hide();
                        $scope.modal.remove();
                    }

                }
         }
    });
})(window.angular);