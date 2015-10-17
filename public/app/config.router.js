'use strict';
angular.module('app')
    .run(
    [
        '$rootScope', '$state', '$stateParams', '$location', '$window',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)
    .config(
    [
        '$stateProvider', '$urlRouterProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider
                .otherwise('/error404');
            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: 'views/layout.html'
                })
                .state('app.main', {
                    url: '/main',
                    templateUrl: 'views/main.html',
                    ncyBreadcrumb: {
                        label: 'Main',
                        description: ''
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'app/controllers/main.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state('app.adminUser', {
                    url: '/adminUser',
                    templateUrl: 'views/adminUser.html',
                    ncyBreadcrumb: {
                        label: 'Admin',
                        description: 'Admin User'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'app/controllers/adminUser.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state('app.adminML', {
                    url: '/adminML',
                    templateUrl: 'views/adminML.html',
                    ncyBreadcrumb: {
                        label: 'Admin',
                        description: 'Machine Learning'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'app/controllers/adminML.js'
                                    ]
                                });
                            }
                        ]
                    }
                })


                .state('app.tasks', {
                    url: '/tasks',
                    templateUrl: 'views/tasks.html',
                    ncyBreadcrumb: {
                        label: 'Tasks',
                        description: 'Tasks containers'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'ngTagsInput', 'vr.directives.slider', 'minicolors']).then(
                                    function() {
                                        return $ocLazyLoad.load(
                                            {
                                                serie: true,
                                                files: [
                                                    'app/controllers/tasks.js',
                                                    'lib/jquery/fuelux/spinbox/fuelux.spinbox.js',
                                                    'lib/jquery/knob/jquery.knob.js',
                                                    'lib/jquery/textarea/jquery.autosize.js'
                                                ]
                                            });
                                    }
                                );
                            }
                        ]
                    }
                })

                .state('app.performance', {
                    url: '/performance',
                    templateUrl: 'views/performance.html',
                    ncyBreadcrumb: {
                        label: 'Performance',
                        description: 'Tasks Performance'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'lib/jquery/charts/chartjs/chart.js',
                                        'app/controllers/performance.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state('app.presentation', {
                    url: '/presentation',
                    templateUrl: 'views/presentation.html',
                    ncyBreadcrumb: {
                        label: 'Presentation'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'app/controllers/presentation.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state('app.calendar', {
                    url: '/calendar',
                    templateUrl: 'views/calendar.html',
                    ncyBreadcrumb: {
                        label: 'Full Calendar'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.calendar']).then(
                                    function () {
                                        return $ocLazyLoad.load(
                                            {
                                                serie: true,
                                                files: [
                                                    'app/controllers/fullcalendar.js'
                                                ]
                                            });
                                    }
                                );
                            }
                        ]
                    }
                })

                .state('error404', {
                    url: '/error404',
                    templateUrl: 'views/error-404.html',
                    ncyBreadcrumb: {
                        label: 'Error 404 - The page not found'
                    }
                })
                .state('error500', {
                    url: '/error500',
                    templateUrl: 'views/error-500.html',
                    ncyBreadcrumb: {
                        label: 'Error 500 - something went wrong'
                    }
                })
                .state('welcome', {
                    url: '/welcome',
                    templateUrl: 'views/welcome.html',
                    ncyBreadcrumb: {
                        label: 'Welcome to BK Tasks'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(
                                    {
                                        serie: true,
                                        files: [
                                            'app/controllers/welcome.js'
                                        ]
                                    });
                            }
                        ]
                    }
                })
                .state('index', {
                    url: '/',
                    templateUrl: 'views/welcome.html',
                    ncyBreadcrumb: {
                        label: 'Welcome to BK Tasks'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(
                                    {
                                        serie: true,
                                        files: [
                                            'app/controllers/welcome.js'
                                        ]
                                    });
                            }
                        ]
                    }
                });

            $locationProvider.html5Mode(true);
        }
    ]
);
