(function(angular){
    angular
        .module('App')
        .service('IonicModalService', IonicModalService);

    IonicModalService.$inject = ['$rootScope', '$ionicModal', 'IncidentsService', 'MapService',
                                 'OfficerService', 'IonicPopupService', 'IonicLoadingService', 'ObjectHelper'];

    function IonicModalService($rootScope, $ionicModal, IncidentsService, MapService,
                               OfficerService, IonicPopupService, IonicLoadingService, ObjectHelper){

        var vm = this;
        vm.double = null;
        vm.scope = $rootScope.$new();

        vm.scope.requests = IncidentsService.requests;
        vm.scope.closeIncidentModal = vm.scope.closeIncidentMapModal  = closeModal;
        vm.scope.openIncidentMapModal = openIncidentMapModal;
        vm.scope.openAttachmentModal = openAttachmentModal;
        vm.scope.confirmPassword = confirmPassword;
        vm.scope.isKeyInArray = ObjectHelper.isKeyInArray;
        vm.scope.isObjectEmpty = ObjectHelper.isObjectEmpty;

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
            IncidentsService.setCurrentIncident(incident);

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
        function openIncidentMapModal(incident) {
            vm.scope.incident = incident || vm.scope.incident;
            MapService.registerMarker(vm.scope.incident);
            vm.scope.map = MapService.map;
            $ionicModal.fromTemplateUrl('views/modal/incidentMap.html', {
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
            $ionicModal.fromTemplateUrl('views/modal/attachment.html', {
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

        /**
         * Displays a popup for confirming officer's password
         */
        function confirmPassword(){
            IonicPopupService.showConfirmPassword()
                .then(function(result){
                    if (result) { //if passwords match
                        IncidentsService.submitRequest()
                            .then(function(ref){
                                //4.) Close Loading Modal
                                IonicLoadingService.hide();
                                //5.) Close incident modal
                                closeModal();
                                //6.) Show success Popup
                                IonicPopupService.showSuccess('Request has been submitted');
                            });
                    }
                });
        }
    }
})(window.angular);