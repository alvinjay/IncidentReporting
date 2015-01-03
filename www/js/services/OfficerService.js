(function(angular){
    'use strict';

    angular
        .module('App')
        .service('OfficerService', OfficerService);

    OfficerService.$inject = ['ObjectHelper', 'FirebaseService'];

    function OfficerService(ObjectHelper, FirebaseService){
        var vm = this;

        vm.officer = {
            id: window.localStorage.getItem("id"),
            areaCode: window.localStorage.getItem("areaCode"),
            name: window.localStorage.getItem("name"),
            password: window.localStorage.getItem("password"),
            confirmPassword: 'walakokabalo'
        };

        try{
            vm.officer.assignment =  JSON.parse(window.localStorage.getItem('assignment').toString())
        } catch(e){
            vm.officer.assignment = {};
        }

        var services = {
            officer: vm.officer,
            getOfficerId: getOfficerId,
            getOfficerAreaCode: getOfficerAreaCode,
            getOfficerName: getOfficerName,
            getOfficerPassword: getOfficerPassword,
            getOfficerAssignment: getOfficerAssignment,
            setOfficerAssignment: setOfficerAssignment,
            addAssignmentNote: addAssignmentNote,
            removeAssignment: removeAssignment
        };

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
        /**
         * Sets the value of officer.assignment
         * @param assignment
         */
        function setOfficerAssignment(assignment){
            ObjectHelper.copyObjectProperties(assignment, vm.officer.assignment);
            console.log(vm.officer.assignment);
        }
        /**
         * Adds a new assignment note to officer.assignment.notes
         * @param note
         */
        function addAssignmentNote(note){
           //update officer.assignment
           vm.officer.assignment.notes.push({text: note});
           //update local copy of assignment
           window.localStorage.setItem('assignment', JSON.stringify(vm.officer.assignment));
        }
        /**
         * Removes all instances of the officer's assignment
         */
        function removeAssignment(){
            //remove from service
            vm.officer.assignment = {};
            //remove from local storage
            window.localStorage.removeItem('assignment');
            //remove in icma-officers firebase
            var assignment = FirebaseService.getOfficerRef('/' + vm.officer.id + '/assignment');
            assignment.remove(function(error){
                if (error)
                    console.log("problem removing assignment in icma-officers");
                else
                    console.log("assignment removed");
            });
        }
    }

})(window.angular);