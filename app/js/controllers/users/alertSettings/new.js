'use strict';

/**
 * @ngInject
 */
function UsersAlertSettingsNewCtrl($rootScope, $scope, $state, AlertSetting, SERVICE_EVENTS) {
  var vm = this;

  vm.alertSetting = {};

  var redirectToAlertSettingsIndex = function() {
    $state.transitionTo('users.alert_settings');
  };

  vm.createAlertSetting = function() {
    AlertSetting.create(vm.alertSetting);
  };

  $scope.$on(SERVICE_EVENTS.alertSettingCreated, redirectToAlertSettingsIndex);
}

module.exports = UsersAlertSettingsNewCtrl;
