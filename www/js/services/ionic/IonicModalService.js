(function(angular){
    angular
        .module('App')
        .service('IonicModalService', IonicModalService);

    IonicModalService.$inject = ['$rootScope', '$ionicModal', 'IncidentsService', 'MapService', 'OfficerService'];

    function IonicModalService($rootScope, $ionicModal, IncidentsService, MapService, OfficerService){

        var vm = this;
        vm.double = null;
        vm.scope = $rootScope.$new();

        vm.scope.closeIncidentModal = vm.scope.closeIncidentMapModal  = closeModal;
        vm.scope.openIncidentMapModal = openIncidentMapModal;
        vm.scope.openAttachmentModal = openAttachmentModal;

        var services = {
            openIncidentModal: openIncidentModal,
            openIncidentMapModal: openIncidentMapModal,
            openAttachmentModal: openAttachmentModal,
            closeModal: closeModal
        };
        
        return services;

        /**
         * Opens a modal view for the incident selected displaying its details
         * @param key
         * @param $scope
         */
        function openIncidentModal(incident) {
            vm.scope.incident = incident;
            vm.scope.hasAttachments = (typeof incident.attachments === 'undefined') ? false : true;
            try{
                vm.scope.assignment = JSON.parse(OfficerService.officer.assignment.toString());
            } catch(e) {
                vm.scope.assignment = null;
            }

            $ionicModal.fromTemplateUrl('views/home/modal/incident.html', {
                animation: 'slide-in-right',
                scope: vm.scope
            }).then(function(modal) {
                vm.modal = modal;
                vm.modal.show();
            });
        }
        /**
         * Opens a modal view for the incident selected displaying its location on a map
         */
        function openIncidentMapModal() {
            MapService.registerMarker(vm.scope.incident);
            vm.scope.map = MapService.map;
            $ionicModal.fromTemplateUrl('views/home/modal/incidentMap.html', {
                animation: 'slide-in-right',
                scope: vm.scope
            }).then(function(modal) {
                vm.double = vm.modal;
                vm.modal = modal;
                vm.modal.show();
            });
        }
        /**
         * Opens a modal view for the incident selected displaying its attachment if any
         * @param incident
         */
        function openAttachmentModal(incident){
            var scope = $rootScope.$new();
            scope.incident = incident;
            scope.closeAttachmentModal = closeModal;
            $ionicModal.fromTemplateUrl('views/home/modal/attachment.html', {
                animation: 'slide-in-right',
                scope: scope
            }).then(function(modal) {
                vm.double = vm.modal
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
                MapService.resetMarker();
            }
        }
    }
})(window.angular);