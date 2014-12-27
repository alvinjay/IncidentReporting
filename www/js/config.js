(function(angular){
    'use strict';

    angular
        .module('App')
        .config(function($stateProvider, $urlRouterProvider, $ionicTabsConfig) {


            /* Android tabs color fix */
            $ionicTabsConfig.type = '';

            $stateProvider
                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "views/tabs.html"
                })
                .state('app.home', {
                    url: "/home",
                    views: {
                        'home-tab': {
                            templateUrl: "views/home/index.html",
                            controller: "HomeController",
                            resolve: {
                                officer: function(OfficerService){
                                    return OfficerService.officer;
                                },
                                map: function(MapService){
                                    return MapService.map;
                                },
                                incident: function(IncidentsService){
                                    return IncidentsService.incident;
                                },
                                incidents: function(IncidentsService){
                                    return IncidentsService.incidents;
                                },
                                requests: function(IncidentsService){
                                    return IncidentsService.requests;
                                }
                            }
                        }
                    }
                })
                .state('app.assignment', {
                    url: "/assignment",
                    views: {
                        'assignment-tab': {
                            templateUrl: "views/assignment/index.html",
                            controller: "AssignmentController"
                        }
                    }
                })
                .state('app.map', {
                    url: "/map",
                    views: {
                        'map-tab': {
                            templateUrl: "views/map/index.html",
                            controller: "MapController"
                        }
                    }
                })
                .state('app.map-incident', {
                    url: "/map/:id",
                    views: {
                        'map-tab': {
                            templateUrl: "views/map/index.html",
                            controller: "MapController"
                        }
                    }
                });

            $urlRouterProvider.otherwise("/app/home");
        });
})(window.angular);