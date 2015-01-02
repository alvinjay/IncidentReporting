(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('AssignmentController', AssignmentController);

    AssignmentController.$inject = ['$scope', 'assignment', 'IonicModalService', 'ObjectHelper'];

    function AssignmentController($scope, assignment, IonicModalService, ObjectHelper){
        try{
            $scope.assignment = JSON.parse(assignment.toString());
        }catch(e){
            $scope.assignment = assignment;
        }

        $scope.hasAttachments =  (typeof $scope.assignment.attachments === 'undefined') ? false : true;

        $scope.openIncidentMapModal = IonicModalService.openIncidentMapModal;
        $scope.openAttachmentModal = IonicModalService.openAttachmentModal;
        $scope.openNotesModal = IonicModalService.openNotesModal;
        $scope.openDocumentsModal = IonicModalService.openDocumentsModal;
        $scope.confirmPassword = IonicModalService.confirmPassword;

        $scope.isObjectEmpty = ObjectHelper.isObjectEmpty;
//        console.log($scope.assignment.attachments.img);
    }
})(window.angular);