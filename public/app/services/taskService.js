angular.module('taskService', [])
    .factory('Task', function ($http) {
        var TaskFactory = {};
        TaskFactory.createTask = function (dataSend) {
            return $http.post('/api/tasks', dataSend)
                .success(function (data) {
                    if (data.success) {
                        return data;
                    }
                });

        };
        TaskFactory.taskOverview = function () {
            return $http.get('/api/taskOverview');
        };
        TaskFactory.get7Tasks = function () {
            return $http.get('/api/get7Tasks');
        };
        TaskFactory.getAllTasks = function (count) {
            var dataSend = {
                count: count
            };
            return $http.post('/api/allTasks', dataSend).success(function (data) {
                return data
            });
        };
        TaskFactory.countAllTasks = function () {
            return $http.get('/api/countAllTasks');
        };
        TaskFactory.totalTimeWork = function () {
            return $http.get('api/totalTimework');
        };
        TaskFactory.totalCompleted = function () {
            return $http.get('api/totalCompleted');
        };
        TaskFactory.totalEvents = function () {
            return $http.get('api/totalEvents')
        };

        TaskFactory.editTask = function (dataSend) {
            return $http.post('/api/editTask', dataSend)
                .success(function (data) {
                    if (data.success) {
                        return data;
                    }
                });

        };

        TaskFactory.deleteTask = function (dataSend) {

            $http.post('/api/deleteTask', dataSend);

        };
        TaskFactory.getTodayTasks = function () {
            return $http.get('/api/todayTask');
        };
        TaskFactory.getNewTasks = function () {
            return $http.get('/api/newTask');
        };
        TaskFactory.getRecentCompletedTask = function () {
            return $http.get('/api/recentCompletedTask');
        };

        return TaskFactory;
    });