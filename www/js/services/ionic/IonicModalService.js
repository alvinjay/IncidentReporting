(function(angular){
    angular
        .module('App')
        .service('IonicModalService', IonicModalService);

    IonicModalService.$inject = ['$ionicModal', 'IncidentsService', 'MapService', 'ObjectHelper'];

    function IonicModalService($ionicModal, IncidentsService, MapService, ObjectHelper){

        var vm = this;
        vm.double = null;
        vm.scope = null;

        var services = {
            openIncidentModal: openIncidentModal,
            openIncidentMapModal: openIncidentMapModal,
            closeModal: closeModal
        };
        
        return services;

        /**
         * Opens a modal view for the incident selected displaying its details
         * @param key
         * @param $scope
         */
        function openIncidentModal(key, $scope) {
            vm.scope = $scope;
            IncidentsService.setCurrentIncident(key)
                .then(function(){
                    $ionicModal.fromTemplateUrl('views/home/modal/incident.html', {
                        animation: 'slide-in-right',
                        scope: vm.scope
                    }).then(function(modal) {
                        vm.modal = vm.double = modal;
                        vm.modal.show();
                    });
                });
        }
        /**
         * Opens a modal view for the incident selected displaying its location on a map
         */
        function openIncidentMapModal() {
            MapService.registerMarker(IncidentsService.incident);
            $ionicModal.fromTemplateUrl('views/home/modal/incidentMap.html', {
                animation: 'slide-in-right',
                scope: vm.scope
            }).then(function(modal) {
                vm.modal = modal;
                vm.modal.show();
            });
        }
        /**
         * Closes active modals
         */
        function closeModal(){
            if(vm.double !== null) {
                vm.modal.hide();
                vm.modal = vm.double;
                vm.double = null;
            } else {
                vm.modal.hide();
                vm.modal.remove();
            }
        }
    }
})(window.angular);