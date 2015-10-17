'use strict';

app
.controller('MainCtrl', function($rootScope, $scope, $location, Auth, Task, Timer, Status, socketio, $document, Calendar) {
	if(!Auth.isLoggedIn())
	{
		$location.path('/welcome');
	}
	Task.getTodayTasks().success(function(data){
		$scope.todaytasks = data;
	});
	Task.getNewTasks().success(function(data){
		$scope.newtasks = data
	});
	Task.getRecentCompletedTask().success(function(data){
		$scope.recentcompletedtasks = data;
	});
	$scope.TimeCount = function(task){
		Timer({timeTask: task.timeSub, id: task._id});
	};
	var section1 = angular.element(document.getElementById('section-1'));
	$scope.postStatus = function(){
		var dataSend = {
			content: $scope.newStatus
		};
		Status.postStatus(dataSend).success(function(data){
			$scope.newStatus = '';
			$document.scrollTo(section1, 30, 1000);
		});
	};
	Status.getStatus().success(function(data){
		$scope.status = data;
	});
	socketio.on('status', function(data){
		$scope.status.unshift(data);
	});
	Calendar.getTodayEvents().success(function(data){
		$scope.todayEvents = data;
	});

});