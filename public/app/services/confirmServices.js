angular.module('confirmServices', ['ui.bootstrap'])
   .controller('ConfirmModalController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
    $scope.data = angular.copy(data);

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }])
  .value('$confirmModalDefaults', {
    template: '<div class="modal-header"><h3 class="modal-title">{{data.title}}</h3></div>' +
    '<div class="modal-body">{{data.text}}</div>' +
    '<div class="modal-footer">' +
    '<button class="btn btn-primary" ng-click="ok()">{{data.ok}}</button>' +
    '<button class="btn btn-default" ng-click="cancel()">{{data.cancel}}</button>' +
    '</div>',
    controller: 'ConfirmModalController',
    defaultLabels: {
      title: 'Confirm',
      ok: 'OK',
      cancel: 'Cancel'
    }
  })
 .factory('Confirm', ['$modal', '$confirmModalDefaults', function ($modal, $confirmModalDefaults) {
    return function (data, settings) {
      var defaults = angular.copy($confirmModalDefaults);
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

      return $modal.open(settings).result;
    };
  }]);