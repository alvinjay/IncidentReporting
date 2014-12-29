(function(angular){
    'use strict';

    angular
        .module('App')
        .controller('AssignmentController', AssignmentController);

    AssignmentController.$inject = ['$scope', 'assignment'];

    function AssignmentController($scope, assignment){
        try{
            $scope.assignment = JSON.parse(assignment.toString());
        }catch(e){
            $scope.assignment = assignment;
        }
//        console.log($scope.assignment.attachments.img);
    }
})(window.angular);