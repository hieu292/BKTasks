'use strict';

app.controller('TasksCtrl', [
    '$rootScope', '$document', '$scope', '$location', 'Auth', 'Task', function ($rootScope, $document, $scope, $location, Auth, Task) {
        if (!Auth.isLoggedIn()) {
            $location.path('/welcome');
        }
        $scope.dataShare = {
            edit: false,
            data: {}
        };
        $scope.checkShowEdit = false;
        $scope.notifyEdit = {
            message: '',
            checkSuccess: false
        };


        var section1 = angular.element(document.getElementById('section-1'));

        $scope.backtoNewTask = function () {
            $scope.dataShare.edit = false;

            $document.scrollTo(section1, 30, 1000);

        };

        $scope.editTask = function () {
            if ($scope.dataShare.data.status) {
                var date = new Date();
                var timezone = -(date.getTimezoneOffset() / 60);
                var newstart = $scope.dataShare.data.startTime;
                newstart.setHours(newstart.getHours() + timezone);
                var newend = $scope.dataShare.data.endTime;
                newend.setHours(newend.getHours() + timezone);
                var dataSend = {
                    id: $scope.dataShare.data._id,
                    status: $scope.dataShare.data.status,
                    data: {
                        nameTask: $scope.dataShare.data.nameTask,
                        priority: parseInt($scope.dataShare.data.priority),
                        describe: $scope.dataShare.data.describe,
                        progress: $scope.dataShare.data.progress,
                        completed: $scope.dataShare.data.completed,
                        startTime: newstart.toISOString(),
                        endTime: newend.toISOString(),
                        timeSub: $scope.dataShare.data.timeSub
                    }
                };
                Task.editTask(dataSend)
                    .success(function (data) {
                        if (data.success) {
                            $scope.notifyEdit.message = data.message;
                            $scope.notifyEdit.checkSuccess = true;
                            $scope.checkShowEdit = true;
                        }
                        else {
                            $scope.notifyEdit.message = data.message;
                            $scope.notifyEdit.checkSuccess = false;
                            $scope.checkShowEdit = true;
                        }

                    });
            }
            else
            {
                var dataSend = {
                    id: $scope.dataShare.data._id,
                    status: $scope.dataShare.data.status,
                    data: {
                        nameTask: $scope.dataShare.data.nameTask,
                        priority: parseInt($scope.dataShare.data.priority),
                        describe: $scope.dataShare.data.describe
                    }
                };
                Task.editTask(dataSend)
                    .success(function (data) {
                        if (data.success) {
                            $scope.notifyEdit.message = data.message;
                            $scope.notifyEdit.checkSuccess = true;
                            $scope.checkShowEdit = true;
                        }
                        else {
                            $scope.notifyEdit.message = data.message;
                            $scope.notifyEdit.checkSuccess = false;
                            $scope.checkShowEdit = true;
                        }

                    });

            }

            $document.scrollTo(section1, 30, 1000);

        };

    }
]);
app.controller('createTasksCtrl', function ($scope, $document, Task) {

    $scope.today = function () {
        $scope.dt1 = new Date();
        $scope.dt2 = new Date();
    };
    $scope.today();
    var date = new Date();
    var timezone = -(date.getTimezoneOffset() / 60);


    $scope.notify = {
        message: '',
        checkSuccess: false
    };
    $scope.checkShow = false;
    $scope.taskName = '';
    $scope.taskPriority = {
        id: "1"
    };
    $scope.taskStatus = false;
    $scope.taskTimeSub = 25;
    $scope.describeTask = "";


    $scope.createTask = function () {
        if ($scope.taskStatus) {
            var newdt1 = $scope.dt1;
            newdt1.setHours(newdt1.getHours() + timezone);
            var newdt2 = $scope.dt2;
            newdt2.setHours(newdt2.getHours() + timezone);
            var dataSend = {
                status: $scope.taskStatus,
                data: {
                    nameTask: $scope.taskName,
                    startTime: newdt1.toISOString(),
                    endTime: newdt2.toISOString(),
                    describe: $scope.describeTask,
                    timeSub: $scope.taskTimeSub,
                    priority: parseInt($scope.taskPriority.id)
                }
            };
            Task.createTask(dataSend)
                .success(function (data) {
                    if (data.success) {
                        $scope.notify.message = data.message;
                        $scope.notify.checkSuccess = true;
                        $scope.checkShow = true;
                        $scope.taskName = '';
                        $scope.taskPriority = {
                            id: "1"
                        };
                        $scope.taskStatus = false;
                        $scope.taskTimeSub = 25;
                        $scope.describeTask = "";
                    }
                    else {
                        $scope.notify.message = data.message;
                        $scope.notify.checkSuccess = false;
                        $scope.checkShow = true;
                    }

                });
        } else {
            var dataSend = {
                status: $scope.taskStatus,
                data: {
                    nameTask: $scope.taskName,
                    priority: parseInt($scope.taskPriority.id),
                    describe: $scope.describeTask
                }
            };
            Task.createTask(dataSend)
                .success(function (data) {
                    if (data.success) {
                        $scope.notify.message = data.message;
                        $scope.notify.checkSuccess = true;
                        $scope.checkShow = true;
                        $scope.taskName = '';
                        $scope.taskPriority = {
                            id: "1"
                        };
                        $scope.taskStatus = false;
                        $scope.taskTimeSub = 25;
                        $scope.describeTask = "";
                    }
                    else {
                        $scope.notify.message = data.message;
                        $scope.notify.checkSuccess = false;
                        $scope.checkShow = true;
                    }

                });

        }
        var section1 = angular.element(document.getElementById('section-1'));
        $scope.dataShare.edit = false;
        $document.scrollTo(section1, 30, 1000);
    };
});
app.controller('listTasksCtrl', function ($scope, $document, Task, socketio, Confirm, Timer) {
    var collect = [];
    $scope.loadMore = function () {
        Task.getAllTasks(collect.length).success(function (data) {
            if (data.length == 0) {
                $scope.busy = true;
                return;
            } else {
                collect.push(data);
                $scope.tasks = collect;
                $scope.busy = false;

            }

        });
    };
    $scope.gotoEdit = function (value) {
        var section1 = angular.element(document.getElementById('section-1'));
        $document.scrollTo(section1, 30, 1000);
        $scope.dataShare.data = value;
        $scope.dataShare.edit = true;
    };
    $scope.deleteTask = function (a, b) {
        Confirm({text: 'Are you sure you want to delete?'})
            .then(function () {
                Task.deleteTask(a);
                $scope.tasks.splice(b, 1);
            });

    };
    $scope.TimeCount = function (a) {
        Timer({timeTask: a.timeSub, id: a._id});

    };
    socketio.on('createtask', function (data) {
        var collectArray = [data];
        $scope.tasks.unshift(collectArray);
    });
});


