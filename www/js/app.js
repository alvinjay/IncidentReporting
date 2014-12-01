angular.module('App', ['ionic','firebase','ngCordova'])
    .run(function($ionicPlatform,$window, $rootScope) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.backgroundColorByHexString('#000000');
                StatusBar.styleBlackOpaque();
//                StatusBar.hide();
            }
        });

        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function () {
            $rootScope.$apply(function() {
                $rootScope.online = false;
            });
        }, false);

        $window.addEventListener("online", function () {
            $rootScope.$apply(function() {
                $rootScope.online = true;
            });
        }, false);
    })
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
