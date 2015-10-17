'use strict';
app.controller('adminMLCtrl', function ($scope, Status, socketio, $document, Confirm) {
    $scope.checkedit = false;
    $scope.checkShowEdit = false;
    Status.getDataset().success(function (data) {
        $scope.datasets = data;
    });
    var section1 = angular.element(document.getElementById('section-1'));
    $scope.createDataset = function () {
        var dataSend = {
            comment: $scope.comment,
            classify: $scope.classify
        };
        Status.postDataset(dataSend).success(function (data) {
            if (data.success) {
                $scope.checkShowEdit = true;
                $scope.notifyEdit = true;
                $scope.message = data.message;
                $scope.createComment = '';
                $scope.createClassify = '';
            } else {
                $scope.checkShowEdit = true;
                $scope.notifyEdit = false;
                $scope.message = data.message;
            }
        });
    };

    $scope.editData = function (data,index) {
        $scope.indexEdit = index;
        $scope.checkedit = true;
        $scope.id = data._id;
        $scope.editcomment = data.comment;
        $scope.editclassify = data.classify;
        $document.scrollTo(section1, 30, 1000);
    };
    $scope.editDataset = function () {
        var dataSend = {
            id: $scope.id,
            comment: $scope.editcomment,
            classify: $scope.editclassify
        };
        Status.editDataset(dataSend).success(function (data) {
            if(data.success){
                $scope.checkShowEdit = true;
                $scope.notifyEdit = true;
                $scope.message = data.message;
                $scope.editcomment = '';
                $scope.editclassify = '';

            } else {
                $scope.checkShowEdit = true;
                $scope.notifyEdit = false;
                $scope.message = data.message;
            }
        });
    };
    $scope.deleteDataset = function (data,index) {
        Confirm({text: 'Are you sure you want to delete?'})
            .then(function () {
                $scope.datasets.splice(index,1);
                Status.deleteDataset(data).success(function (datareturn) {
                    if(datareturn.success){
                        alert(datareturn.message);
                    }
                })
            });
    };
    $scope.backtoCreateDataset = function () {
        $scope.checkedit = false;
        $scope.checkShowEdit = false;
    };
    socketio.on('dataset', function (data) {
        $scope.datasets.unshift(data);
    });
    socketio.on('datasetedit', function (data) {
        console.log(data);
        $scope.datasets.splice($scope.indexEdit,1);
        $scope.datasets.splice($scope.indexEdit,0,data);
    });


});