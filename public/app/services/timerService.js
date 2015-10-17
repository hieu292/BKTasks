angular.module('timerServices',['timer','ui.bootstrap','ngAudio'])
.controller('timerModalController', ['$scope', '$modalInstance', 'data','ngAudio','$http', function ($scope, $modalInstance, data, ngAudio, $http) {
	$scope.data = angular.copy(data);
	$scope.timerRunning = true;
	$scope.setinterval= 1000;
	$scope.setcountdown = 60 * $scope.data.timeTask;
	$scope.showStart = true;
	$scope.showExit = true;
	$scope.showReset = false;
	$scope.showStop = false;
	$scope.Autostart = false;
	var countTime = 0;


	$scope.startTimer = function () {
		$scope.$broadcast('timer-start');
		$scope.timerRunning = true;
		$scope.showStart = false;
		$scope.showReset = false;
		$scope.showStop = true;
		$scope.showExit = false;
	};
	var dataReturn ={
		timework: 0,
		interrupt: 0
	};
	$scope.resetTimer = function(){
		countTime = 0;
		$scope.data.startButton = 'Start';
		$scope.showStart = true;
		$scope.showReset = false;		
		$scope.showStop = false;
		$scope.$broadcast('timer-reset');
	};

	$scope.cancelTimer = function () {
		dataSend = {
			id: $scope.data.id,
			timework: dataReturn.timework,
			interrupt: dataReturn.interrupt
		};
		$http.post('/api/updateWork',dataSend);
		dataReturn.timework = 0;
		dataReturn.interrupt = 0;

		$modalInstance.close();

	};
	$scope.interruptTimer = function(){
		$scope.$broadcast('timer-stop');
		$scope.timerRunning = false;
		$scope.showStart = true;
		$scope.showReset = true;
		$scope.showStop = false;
		$scope.showExit = true;
		dataReturn.interrupt += 1;
	};
	function newReset1() {
			ngAudio.play('assets/sound/alert.mp3');
			$scope.showStart = false;
			$scope.showReset = true;		
			$scope.showStop = false;
			$scope.showExit = true;
			$scope.data.startButton = 'Start';
		
	}
	function newReset2() {
		$scope.data.startButton = 'Continue';
	}
	$scope.$on('timer-stopped', function (event, args) {
		var num = args.minutes;
		if (countTime == 0) {
			countTime = $scope.data.timeTask - args.minutes;
		} else{
			var temp = $scope.data.timeTask - args.minutes;
			var temp2 = temp - countTime;
			countTime = temp2;
		};
		dataReturn.timework += countTime;
		countTime = $scope.data.timeTask - args.minutes;
		if(num == 0 ) {
			newReset1();
		} else{

			newReset2();
		};

		
});

}])
.value('$timerModalDefaults', {
	template: '<div class="modal-header"><h3 class="modal-title">{{data.title}}</h3></div>' +
	'<div class="modal-body">'+
	'<h3>'+

	'<timer id="countdown" interval="setinterval" countdown="setcountdown" autoStart="{{Autostart}}">'+
	'Remaining time : {{minutes}} minutes ({{progressBar}}%).'+
	'<div style="margin-top:20px" type="info" class="progress-striped active progress ng-isolate-scope">'+
	'<div ng-style="{width: progressBar + \'%\'}" class="progress-bar progress-bar-info" ng-class="type &amp;&amp; \'progress-bar-\' + type" role="progressbar"  aria-valuemin="0" aria-valuemax="100"  ></div>'+
	'</div>'+

	'</timer>'+
	'</h3>'+
	'</div>' +
	'<div class="modal-footer">' +
	'<button class="btn btn-success" ng-disabled="!showStart" ng-click="startTimer()">{{data.startButton}}</button>' +
	'<button class="btn btn-danger" ng-disabled="!showStop" ng-click="interruptTimer()">{{data.interruptButton}}</button>' +
	'<button class="btn btn-primary" ng-disabled="!showReset" ng-click="resetTimer()">Reset</button>' +
	'<button class="btn btn-warning" ng-disabled="!showExit" ng-click="cancelTimer()">{{data.cancelButton}}</button>' +
	'</div>',
	controller: 'timerModalController',
	defaultLabels: {
		title: 'Timer',
		startButton: 'Start',
		interruptButton: 'Stop',
		cancelButton: 'Exit'
	}
})
.factory('Timer', ['$modal', '$timerModalDefaults', function ($modal, $timerModalDefaults) {
	return function (data, settings) {
		var defaults = angular.copy($timerModalDefaults);
		settings = angular.extend(defaults, (settings || {}));

		data = angular.extend({}, settings.defaultLabels, data || {});

		if ('templateUrl' in settings && 'template' in settings) {
			delete settings.template;
		}

		settings.resolve = {
			data: function () {
				return data;
			}
		};
		settings.keyboard = false;
		settings.backdrop = 'static';

		return $modal.open(settings).result;
	};
}]);