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
                            controller: "HomeController"
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