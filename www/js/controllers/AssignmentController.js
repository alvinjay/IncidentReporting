(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('AssignmentController', AssignmentController);

    AssignmentController.$inject = ['$scope', 'assignment', 'IonicModalService'];

    function AssignmentController($scope, assignment, IonicModalService){
        try{
            $scope.assignment = JSON.parse(assignment.toString());
        }catch(e){
            $scope.assignment = assignment;
        }

        $scope.hasAttachments =  (typeof $scope.assignment.attachments === 'undefined') ? false : true;

        $scope.openIncidentMapModal = IonicModalService.openIncidentMapModal;
        $scope.openAttachmentModal = IonicModalService.openAttachmentModal;
//        console.log($scope.assignment.attachments.img);
    }
})(window.angular);