(function(angular){
    'use strict';

    angular
        .module('App')
        .service('OfficerService', OfficerService);

    OfficerService.$inject = [];

    function OfficerService(){
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
            getOfficerId: function getOfficerId(){
                return vm.officer.id;
            },
            getOfficerAreaCode: function getOfficerAreaCode(){
                return vm.officer.areaCode;
            },
            getOfficerName: function getOfficerName(){
                return vm.officer.name;
            },
            getOfficerPassword: function getOfficerPassword(){ //TODO To be hashed
                return vm.officer.password;
            },
            getOfficerAssignment: function getOfficerAssignment(){
                return vm.officer.assignment;
            }
        }
        return services;
    }

})(window.angular);