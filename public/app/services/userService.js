angular.module('userService', [])


    .factory('User', function ($http) {

        var userFactory = {};

        userFactory.create = function (userData) {
            return $http.post('/api/signup', userData)
                .success(function (data) {
                    return data;
                });
        };
        userFactory.update = function (userData) {
            return $http.post('/api/update', userData)
                .success(function (data) {
                    return data;
                });
        };
		userFactory.getListUser = function () {
            return $http.get('/api/getListUser');
        };
        userFactory.deleteUser = function (user) {
            return $http.post('/api/deleteUser', user);
        };
        userFactory.addRole = function (data) {
            return $http.post('/api/addRole', data);
        };

        return userFactory;

    });