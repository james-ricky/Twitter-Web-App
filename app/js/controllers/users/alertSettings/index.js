'use strict';

/**
 * @ngInject
 */
function UsersAlertSettingsIndexCtrl($rootScope, $scope, AlertSetting, SERVICE_EVENTS) {
  var vm = this;

  vm.alertSettings = [];

  var setAlertSettings = function() {
    vm.alertSettings = AlertSetting.get();
  };

  AlertSetting.reload();

  $scope.$on(SERVICE_EVENTS.alertSettingsUpdated, setAlertSettings);
}

module.exports = UsersAlertSettingsIndexCtrl;
