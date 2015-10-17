app.controller('performCtrl', function ($scope, $rootScope, Task) {
    Task.countAllTasks().success(function (data) {
        $scope.totalTasks = data;
    });
    Task.totalTimeWork().success(function (data) {
        $scope.totalTimework = data;
    });
    Task.totalCompleted().success(function (data) {
        $scope.totalCompleted = data;
    });
    Task.totalEvents().success(function (data) {
        $scope.totalEvents = data;
    });

    Task.get7Tasks().success(function (data) {
        var data1 = [];
        var data2 = [];
        var data3 = [];
        var data4 = [];
        var label1 = [];
        data.forEach(function (element) {
            label1.push(element.nameTask);
            data1.push(element.workTime);
            data2.push(element.progress);
            data3.push(element.interrupt);
            data4.push(element.timeSub);

        });
        $scope.lineChartData = {
            labels: label1,
            datasets: [
                {
                    fillColor: "rgba(93, 178, 255,.4)",
                    strokeColor: "rgba(93, 178, 255,.7)",
                    pointColor: "rgba(93, 178, 255,.7)",
                    pointStrokeColor: "#fff",
                    data: data1
                },
                {
                    fillColor: "rgba(215, 61, 50,.4)",
                    strokeColor: "rgba(215, 61, 50,.6)",
                    pointColor: "rgba(215, 61, 50,.6)",
                    pointStrokeColor: "#fff",
                    data: data2
                },
                {
                    fillColor: "rgba(100, 61, 70,.4)",
                    strokeColor: "rgba(100, 61, 70,.6)",
                    pointColor: "rgba(100, 61, 70,.6)",
                    pointStrokeColor: "#fff",
                    data: data3
                },
                {
                    fillColor: "rgba(0,255,0,0.3)",
                    strokeColor: "rgba(0,255,0,0.3)",
                    pointColor: "rgba(0,255,0,0.3)",
                    pointStrokeColor: "#fff",
                    data: data4
                }
            ]

        };
        new Chart(document.getElementById("line").getContext("2d")).Line($scope.lineChartData);

    });
    Task.taskOverview().success(function (data) {
        $scope.completedValue = Math.round(100*(data.taskCompleted/(data.taskCompleted + data.taskInprogess + data.taskNonactive)));
        $scope.inprogressValue = Math.round(100*(data.taskInprogess/(data.taskCompleted + data.taskInprogess + data.taskNonactive)));
        $scope.nonactiveValue = Math.round(100*(data.taskNonactive/(data.taskCompleted + data.taskInprogess + data.taskNonactive)));
        $scope.pieData = [
            {
                value: $scope.completedValue,
                color: $rootScope.settings.color.themeprimary
            },
            {
                value: $scope.nonactiveValue ,
                color: $rootScope.settings.color.themesecondary
            },
            {
                value: $scope.inprogressValue,
                color: $rootScope.settings.color.themefourthcolor
            }

        ];
        new Chart(document.getElementById("pie").getContext("2d")).Pie($scope.pieData);
    });

});
