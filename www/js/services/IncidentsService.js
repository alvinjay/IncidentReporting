(function(angular){
    'use strict';

    angular
        .module('App')
        .service('IncidentsService', IncidentsService);

    IncidentsService.$inject = ['$q', 'ObjectHelper', 'FirebaseService', 'OfficerService', 'MapService',
                                'IonicLoadingService'];

    function IncidentsService($q, ObjectHelper, FirebaseService, OfficerService, MapService,
                              IonicLoadingService){

        var vm = this;

        vm.scope = null;

        vm.incident = {};
        vm.incidents = [];
        vm.requests = [];

        vm.incidentsFirebaseArray = null;
        vm.ongoingFirebaseArray = null;

        vm.assignment = null;
        vm.assignmentFirebaseObject = null;

        var services = {
            incident: vm.incident,
            incidents: vm.incidents,
            requests: vm.requests,
            incidentsFirebaseArray: vm.incidentsFirebaseArray,
            ongoingFirebaseArray: vm.ongoingFirebaseArray,
            assignmentFirebaseObject: vm.assignmentFirebaseObject,
            retrieveFromFirebase: retrieveFromFirebase,
            retrieveNewIncidents: retrieveNewIncidents,
            retrieveOngoingIncidents: retrieveOngoingIncidents,
            retrieveOfficerAssignment: retrieveOfficerAssignment,
            getIncident: getIncident,
            setCurrentIncident: setCurrentIncident,
            processIncident: processIncident,
            submitRequest: submitRequest
        }

        return services;

        /**
         * Retrieve assignment and incidents from Firebase
         */
        function retrieveFromFirebase(){
            var officer = OfficerService.officer;
            IonicLoadingService.show('Retrieving data from server');
            //Retrieve assignmentFirebaseObject
            retrieveOfficerAssignment(officer.id)
                .then(function(assignment){
                    vm.assignment.$watch(watchAssignment);
                    vm.assignment.$loaded(function(data){
                        //Retrieve incidentsFirebaseArray
                        retrieveNewIncidents(officer.areaCode)
                            .then(function(incidents) {
                                vm.incidentsFirebaseArray.$watch(watchIncidents);
                                vm.incidentsFirebaseArray.$loaded(function(data){
                                    IonicLoadingService.hide();
                                });
                        });
                    });
                });
        }
        /**
         * Retrieve available incidents from firebase
         * @param fn
         * @returns {.watchHeading.promise|*|.watchPosition.promise|.watchAcceleration.promise|e.promise|promise}
         */
        function retrieveNewIncidents(areaCode){
            var q = $q.defer();
            //initialize 'new' incidents
            var ref = FirebaseService.getRef('/' + areaCode + '/new');
            //Get 'new' incidents array
            vm.incidentsFirebaseArray = FirebaseService.getArray(ref);

            q.resolve(vm.incidentsFirebaseArray);
            return q.promise;
        }
        /**
         * Retrieve ongoing incidents from firebase
         * @param areaCode
         * @returns {.watchHeading.promise|*|.watchPosition.promise|.watchAcceleration.promise|e.promise|promise}
         */
        function retrieveOngoingIncidents(){
            var q = $q.defer();
            var areaCode = OfficerService.officer.areaCode;
            //initialize 'new' incidents
            var ref = FirebaseService.getRef('/' + areaCode + '/ongoing');
            //Get 'new' incidents array
            vm.ongoingFirebaseArray = FirebaseService.getArray(ref);
            q.resolve(vm.ongoingFirebaseArray);
            return q.promise;
        }
        /**
         * retrieve officer assignment from firebase
         * @param id
         * @returns {.watchHeading.promise|*|.watchPosition.promise|.watchAcceleration.promise|e.promise|promise}
         */
        function retrieveOfficerAssignment(id){
            var q = $q.defer();
            //initialize 'new' incidents
            var ref = FirebaseService.getOfficerRef('/' + id + '/assignment');
            //Get 'new' incidents array
            vm.assignment = FirebaseService.getObject(ref);

            q.resolve(vm.assignment);
            return q.promise;
        }
        /**
         * returns the incident with the $id == key
         * @param key - incident $id
         * @returns {*|Object|null}
         */
        function getIncident(key){
            return vm.incidentsFirebaseArray.$getRecord(key);
        }
        /**
         * sets vm.incident to current incident focused
         * @param key
         */
        function setCurrentIncident(key){
            var q = $q.defer();

            var incident = vm.incidentsFirebaseArray.$getRecord(key);
            ObjectHelper.copyObjectProperties(incident, vm.incident);

            q.resolve(true);
            return q.promise;
        }
        /**
         * decides whether to put an incident in the 'incidents' or 'requests'
         * @param data
         * @param incident
         */
        function processIncident(data, incident){
            var officer = OfficerService.officer;

            //case: new incident is added to the area of this officer
            if (data.event == "child_added" && data.key != "count" && !ObjectHelper.isKeyInArray(data.key, vm.incidents))
            {
                var marker = {
                    lat: incident.l[0],
                    lng: incident.l[1],
                    message: incident.$id
                };

                //check if the incident is a pending request for the officer
                if (checkIfPendingRequest(incident, officer.id) && !ObjectHelper.isKeyInArray(data.key, vm.requests))
                    vm.requests.push(incident);
                else if (officer.assignment === null) //check if assignment is undefined
                {
                    vm.incidents.push(incident);
                }
                else {
                    if (officer.assignment.$id !== incident.$id && !ObjectHelper.isKeyInArray(data.key, vm.requests)) //check if incident is the assignment of the officer
                    {
                        vm.incidents.push(incident);
//                        else if(officer.assignment.$value == incident.$id) //TODO change marker icon for assignment
//                        marker.message = 'assignment';
                    }
                }
                //include incident to map.markers
                MapService.addMarker(marker);
                //console.log(incident);
                console.log('added');
            }
            //case: if officer has submitted a request for an incident
            // OR other officers have submitted request for an incident
            else if (data.event === 'child_changed')
            {
                if (checkIfPendingRequest(incident, officer.id) && !ObjectHelper.isKeyInArray(incident.$id, vm.requests))
                {
                    vm.requests.push(incident);
                    try {
                        if (ObjectHelper.isObjectInArray(incident, vm.incidents))
                            ObjectHelper.removeObjectFromArray(incident, vm.incidents);
                    } catch(e){}
                }
            }
            //case: if incident has been assigned to another officer
            // OR is ignored
            // OR is assigned to this officer
            else if (data.event === 'child_removed')
            {
                console.log('deleted');

                MapService.removeMarker(data.key);

                //check if the incident removed was a pending request for vm officer
                if (ObjectHelper.isKeyInArray(data.key, vm.requests))
                {
                    ObjectHelper.removeObjectFromArray(ObjectHelper.getObjectFromArray(data.key, vm.requests), vm.requests);
                    console.log('request has been assigned to another officer');
                }
                else
                {
                    if (ObjectHelper.isKeyInArray(data.key, vm.incidents))
                    {
                        ObjectHelper.removeObjectFromArray(ObjectHelper.getObjectFromArray(data.key, vm.incidents), vm.incidents);
                    }
                }
            }
        }
        /**
         * Checks if the officer submitted a request for the incident
         * @param incident
         * @returns {boolean}
         */
        function checkIfPendingRequest(incident, id){
            //check if incident.requests exists
            if (typeof incident.requests !== 'undefined')
            {
                if (typeof incident.requests[id] !== 'undefined')
                    return true;
                return false;
            }

            return false;
        }
        /**
         * Submits a assignment request for an incident
         */
        function submitRequest(){
            var officer = OfficerService.officer;
            //retrieve new record of the incident from the array because vm.incident is not an exact copy from the array
            var incident = vm.incidentsFirebaseArray.$getRecord(vm.incident.$id);
            //1.) Show Loading Modal (Submitting request...)
            IonicLoadingService.show('Submitting request...');
            //2.) Edit $scope.incident (add 'requests' node)
            //Check if requests has not been defined YET
            if (typeof incident.requests === 'undefined')
                incident.requests = {};
            // Insert new request
            incident.requests[officer.id] =  true;
            //3.) Do $scope.incidents($scope.incident).$save
            console.log('fin');
            return FirebaseService.saveFirebaseArray(vm.incidentsFirebaseArray,incident);
        }

        /**
         * Watcher: incidentsFirebaseArray
         * @param data
         */
        function watchIncidents(data) {
            console.log(data.event + ' ' + data.key);
            var incident = getIncident(data.key);
            processIncident(data, incident);
        }

        /**
         * Watcher: assignementFirebaseObject
         * @param data
         */
        function watchAssignment() {
            var key = vm.assignment.$value;
            if (key !== null){ //officer has assignment
                console.log("You have an assignment");
                retrieveOngoingIncidents()
                    .then(function(ongoing){
                        return vm.ongoingFirebaseArray.$loaded();
                    })
                    .then(function(){
                        vm.assignmentFirebaseObject = vm.ongoingFirebaseArray.$getRecord(key);
                        OfficerService.setOfficerAssignment(vm.assignmentFirebaseObject);
                    });
            }
            else
               console.log("No assignment");

//            OfficerService.setOfficerAssignment(vm.assignment);
        }
    }

})(window.angular);