(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('AssignmentController', AssignmentController);

    AssignmentController.$inject = ['$scope', 'assignment', 'connection', 'IonicModalService', 'ObjectHelper',
                                    'InternetService'];

    function AssignmentController($scope, assignment, connection, IonicModalService, ObjectHelper,
                                  InternetService){
        try{
            $scope.assignment = JSON.parse(assignment.toString());
        }catch(e){
            $scope.assignment = assignment;
        }

        $scope.connection = connection;
        $scope.hasAttachments =  (typeof $scope.assignment.attachments === 'undefined') ? false : true;

        $scope.openIncidentMapModal = IonicModalService.openIncidentMapModal;
        $scope.openAttachmentModal = IonicModalService.openAttachmentModal;
        $scope.openNotesModal = IonicModalService.openNotesModal;
        $scope.openDocumentsModal = IonicModalService.openDocumentsModal;
        $scope.confirmPassword = IonicModalService.confirmPassword;

        $scope.isObjectEmpty = ObjectHelper.isObjectEmpty;

        // watch for Internet Connection status changes
        $scope.$watch('online', InternetService.changeInternetStatus);

//        console.log($scope.assignment.attachments.img);
    }
})(window.angular);