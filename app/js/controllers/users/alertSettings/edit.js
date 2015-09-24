'use strict';

/**
 * @ngInject
 */
function UsersAlertSettingsEditCtrl($rootScope, $scope, $state, $stateParams, Restangular, AlertSetting, LocalStore, SERVICE_EVENTS) {
  var vm = this;

  vm.alertSetting = {};

  vm.updateAlertSetting = function() {
    AlertSetting.update(vm.alertSetting);
  };

  var reloadAlertSetting = function() {
    if (LocalStore.loadAuthToken()) {
      Restangular.all('users').one('alert_settings', $stateParams.id).get().then(function(result) {

        vm.alertSetting = result.alertSetting;

      }, function(result) {

        $log.warn("error reloading alertSetting", result);

        vm.alertSetting = null;
      });
    } else {
      vm.alertSetting = null;
    }
  };

  var redirectToAlertSettingsIndex = function() {
    $state.transitionTo('users.alert_settings');
  };

  reloadAlertSetting();

  $scope.$on(SERVICE_EVENTS.alertSettingUpdated, redirectToAlertSettingsIndex);
}

module.exports = UsersAlertSettingsEditCtrl;
