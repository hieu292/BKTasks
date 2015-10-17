angular.module('statusService', [])
    .factory('Status', function ($http) {
        var StatusFactory = {};
        StatusFactory.getStatus = function () {
            return $http.get('/api/status');
        };
        StatusFactory.postStatus = function (data) {
            return $http.post('/api/status', data);
        };
		StatusFactory.postDataset = function (data) {
            return $http.post('/api/dataset', data);
        };

        StatusFactory.getDataset = function () {
            return $http.get('/api/dataset');
        };
        StatusFactory.editDataset = function (data) {
            return $http.post('/api/editDataset', data);

        };
        StatusFactory.deleteDataset = function (data) {
            return $http.post('/api/deleteDataset',data);
        };

        return StatusFactory;
    });