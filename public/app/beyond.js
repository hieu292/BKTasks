'use strict';

angular.module('app')
    .controller('AppCtrl',
    function ($rootScope, $localStorage, $state, $location, Auth) {
        Auth.getUser()
            .then(function (data) {
                $rootScope.name = data.data.name;
                $rootScope.username = data.data.username;
                $rootScope.email = data.data.email;
                $rootScope.images = data.data.images;
                $rootScope.idUser = data.data.idUser;
            });
        $rootScope.$on('$stateChangeStart', function () {

            Auth.getUser()
                .then(function (data) {
                    $rootScope.name = data.data.name;
                    $rootScope.username = data.data.username;
                    $rootScope.email = data.data.email;
                    $rootScope.images = data.data.images;
                    $rootScope.idUser = data.data.idUser;
                });
        });
        $rootScope.doLogout = function () {
            Auth.logout();
            alert('You just logout. Please login if you want to use !');
            $location.path('/welcome');
        };


        $rootScope.settings = {
            skin: '',
            color: {
                themeprimary: '#2dc3e8',
                themesecondary: '#fb6e52',
                themethirdcolor: '#ffce55',
                themefourthcolor: '#a0d468',
                themefifthcolor: '#e75b8d'
            }
        };
        if (angular.isDefined($localStorage.settings))
            $rootScope.settings = $localStorage.settings;
        else
            $localStorage.settings = $rootScope.settings;

        $rootScope.$on('$viewContentLoaded',
            function (event, toState, toParams, fromState, fromParams) {
                var hovered = $(".sidebar-menu").find("li:hover");
                hovered.trigger('mouseover');

                if ($state.current.name == 'error404') {
                    $('body').addClass('body-404');
                }
                if ($state.current.name == 'welcome') {
                    $('body').addClass('body-404');
                }
                if ($state.current.name == 'index') {
                    $('body').addClass('body-404');
                }
                if ($state.current.name == 'error500') {
                    $('body').addClass('body-500');
                }
            });
    }
)
    .controller('navbarCtrl', function ($rootScope, $scope, $modal, $log, $location, User, Auth, AuthToken, Calendar, Task) {

        $scope.user = {
            name: '',
            username: '',
            password: '',
            email: '',
            images: ''
        };
        $scope.user.name = $rootScope.name;
        $scope.user.username = $rootScope.username;
        $scope.user.email = $rootScope.email;
        $scope.user.images = $rootScope.images;
        Calendar.getTodayEvents().success(function (data) {
            $scope.todayEvents = data;
            $scope.todayEventsLength = data.length;
        });
        $scope.nowdate = new Date();
        Task.getTodayTasks().success(function (data) {
            $scope.todaytasksprogress = data;
            $scope.indextask = data.length;
        });


        $scope.openUpdate = function () {

            $modal.open({
                templateUrl: 'updateModal',
                backdrop: true,
                windowClass: 'modal',
                controller: function ($scope, $window, $modalInstance, $log, User, AuthToken, user) {
                    $scope.items = [
                        {key: "cat", value: "assets/img/avatars/bing.png"},
                        {key: "dog", value: "assets/img/avatars/divyia.jpg"},
                        {key: "bird", value: "assets/img/avatars/adam-jansen.jpg"},
                        {key: "chicken", value: "assets/img/avatars/John-Smith.jpg"}
                    ];
                    $scope.notify = '';
                    var name = {
                        name: user.name,
                        username: user.username,
                        password: user.password,
                        email: user.email,
                        images: user.images
                    };
                    $scope.user = user;
                    $scope.submit = function () {
                        var userSend = {
                            name: user.name,
                            username: user.username,
                            password: user.password,
                            email: user.email,
                            images: user.images
                        };
                        if (name.name == user.name)
                            delete userSend.name;
                        if (name.username == user.username)
                            delete userSend.username;
                        if (user.password == '')
                            delete userSend.password;
                        if (name.email == user.email)
                            delete userSend.email;
                        if (name.images == user.images)
                            delete userSend.images;
                        if (Object.keys(userSend).length != 0) {
                            var userData = {
                                username: name.username,
                                data: userSend
                            };
                            User.update(userData)
                                .success(function (data) {
                                    if (data.success) {
                                        AuthToken.setToken();
                                        AuthToken.setToken(data.token);
                                        alert(data.message);
                                        $window.location.reload();
                                        $modalInstance.dismiss('cancel');
                                    }
                                    else
                                        return $scope.notify = data.message;

                                });
                        } else
                            $scope.notify = "You didn't change anything";

                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    user: function () {
                        return $scope.user;
                    }
                }
            });

        };
    })
    .controller('sidebarCtrl', function ($rootScope, $scope) {
        $scope.idUser = $rootScope.idUser;
    });
