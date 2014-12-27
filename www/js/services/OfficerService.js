(function(angular){
    'use strict';

    angular
        .module('App')
        .service('OfficerService', OfficerService);

    OfficerService.$inject = ['IonicPopupService'];

    function OfficerService(IonicPopupService){
        var vm = this;

        vm.officer = {
            id: window.localStorage.getItem("id"),
            areaCode: window.localStorage.getItem("areaCode"),
            name: window.localStorage.getItem("name"),
            password: window.localStorage.getItem("password"),
            confirmPassword: 'walakokabalo',
            assignment: null
        };

        var services = {
            officer: vm.officer,
            getOfficerId: getOfficerId,
            getOfficerAreaCode: getOfficerAreaCode,
            getOfficerName: getOfficerName,
            getOfficerPassword: getOfficerPassword,
            getOfficerAssignment: getOfficerAssignment,
            confirmPassword: confirmPassword,
            submitRequest: submitRequest
        }
        return services;

        /**
         * Returns officer id
         * @returns {*}
         */
        function getOfficerId(){
            return vm.officer.id;
        }
        /**
         * Returns officer area code
         * @returns {*}
         */
        function getOfficerAreaCode(){
            return vm.officer.areaCode;
        }
        /**
         * Returns officer full name
         * @returns {*}
         */
        function getOfficerName(){
            return vm.officer.name;
        }
        /**
         * Returns officer's hashed password
         * @returns {*}
         */
        function getOfficerPassword(){ //TODO To be hashed
            return vm.officer.password;
        }
        /**
         * Returns officer's assignment if any
         * @returns {null}
         */
        function getOfficerAssignment(){
            return vm.officer.assignment;
        }

        function confirmPassword(){
            IonicPopupService.showConfirmPassword($scope)
                .then(function(result){
                    if (result) //if passwords match
                        vm.submitRequest();
                });
        }
    }

})(window.angular);