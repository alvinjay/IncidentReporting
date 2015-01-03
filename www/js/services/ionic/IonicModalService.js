(function(angular){
    angular
        .module('App')
        .service('IonicModalService', IonicModalService);

    IonicModalService.$inject = ['$rootScope', '$state', '$ionicModal', 'IncidentsService', 'MapService',
                                 'OfficerService', 'IonicPopupService', 'IonicLoadingService', 'ObjectHelper',
                                 'CameraService', '$ionicSlideBoxDelegate'];

    function IonicModalService($rootScope, $state, $ionicModal, IncidentsService, MapService,
                               OfficerService, IonicPopupService, IonicLoadingService, ObjectHelper,
                               CameraService, $ionicSlideBoxDelegate){

        var vm = this;
        vm.double = null;
        vm.scope = $rootScope.$new();


        vm.scope.requests = IncidentsService.requests;
        vm.scope.assignment = OfficerService.officer.assignment;

        vm.scope.closeModal = closeModal;
        vm.scope.openIncidentMapModal = openIncidentMapModal;
        vm.scope.openAttachmentModal = openAttachmentModal;
        vm.scope.confirmPassword = confirmPassword;
        vm.scope.isKeyInArray = ObjectHelper.isKeyInArray;
        vm.scope.isObjectEmpty = ObjectHelper.isObjectEmpty;

        var services = {
            openIncidentModal: openIncidentModal,
            openIncidentMapModal: openIncidentMapModal,
            openAttachmentModal: openAttachmentModal,
            openNotesModal: openNotesModal,
            openFinalizeModal: openFinalizeModal,
            openDocumentsModal: openDocumentsModal,
            closeModal: closeModal,
            confirmPassword: confirmPassword
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
            vm.scope.incident = incident || vm.scope.incident;

            $ionicModal.fromTemplateUrl('views/modal/attachment.html', {
                animation: 'slide-in-right',
                scope: vm.scope
            }).then(function(modal) {
                vm.double = vm.modal
                vm.modal = modal;
                vm.modal.show();
            });
        }
        /**
         * Opens a modal view for the officer's assignment displaying its notes
         */
        function openNotesModal(assignment) {
            //define assignment.notes in case it is not
            if (typeof  vm.scope.assignment.notes === 'undefined')
                vm.scope.assignment.notes = [];

            vm.scope.addAssignmentNote = OfficerService.addAssignmentNote;

            $ionicModal.fromTemplateUrl('views/assignment/modal/notes.html', {
                animation: 'slide-in-right',
                scope: vm.scope
            }).then(function(modal) {
                vm.double = vm.modal;
                vm.modal = modal;
                vm.modal.show();
            });
        }
        /**
         * Opens a modal view for the officer's assignment displaying its notes
         */
        function openFinalizeModal() {
            vm.scope.edit = false;
            $ionicModal.fromTemplateUrl('views/assignment/modal/finalize.html', {
                animation: 'slide-in-right',
                scope: vm.scope
            }).then(function(modal) {
                vm.double = vm.modal;
                vm.modal = modal;
                vm.modal.show();
            });
        }

        /**
         * Opens a modal view for the officer's assignment for capturing paper documents as images
         */
        function openDocumentsModal(){
            vm.scope.addDocument = function(){
                try{
                    CameraService.takePicture(Camera)
                        .then(function(imageData) {
//                            IonicPopupService.showAlert("image", imageData);
                            // Success! Image data is here
    //                        var image = document.getElementById('document');
    //                        image.src = "data:image/jpeg;base64," + imageData;
                            vm.scope.assignment.documents.push(imageData);
                            $ionicSlideBoxDelegate.update();
                        }, function(err) {
                            $('#firebase').html(err);
                            // An error occured. Show a message to the user
                        });
                } catch(e){
                    console.log(e);
                }
            };

            //define assignment.notes in case it is not
            if (typeof  vm.scope.assignment.documents === 'undefined')
                vm.scope.assignment.documents = [];

            $ionicModal.fromTemplateUrl('views/assignment/modal/documents.html', {
                animation: 'slide-in-right',
                scope: vm.scope
            }).then(function(modal) {
                vm.double = vm.modal;
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
                        if ($state.current.name === 'app.home'){
                            IncidentsService.submitRequest()
                                .then(function(ref){
                                    //Close Loading Modal
                                    IonicLoadingService.hide();
                                    //Close incident modal
                                    closeModal();
                                    //Show success Popup
                                    IonicPopupService.showSuccess('Request has been submitted');
                                });
                        } else {
                            IncidentsService.confirmAssignment()
                                .then(function(message){
                                    if (message !== 'success')
                                        console.log(message);
                                    //Close Loading Modal
                                    IonicLoadingService.hide();
                                    //Remove all about assignment in local
                                    OfficerService.removeAssignment();
                                    //Show success Popup
                                    IonicPopupService.showSuccess('Assignment has been recorded');
                                    $state.go("app.home");
                                });
                        }

                    }
                });
        }

    }
})(window.angular);