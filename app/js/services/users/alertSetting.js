'use strict';

/**
 * @ngInject
 */
function AlertSetting($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.alertSettings = [];

  self.set = function (alertSettings) {
    $log.debug("set alertSettings", alertSettings);

    self.alertSettings = alertSettings;

    $rootScope.$broadcast(SERVICE_EVENTS.alertSettingsUpdated, alertSettings);
  };

  service.get = function () {
    return self.alertSettings;
  };

  service.reload = function () {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('alert_settings').getList().then(function (result) {

        $log.debug("reloaded alertSettings", result);

        self.set(result);

        return result;

      }, function(result) {

        $log.warn("error reloading alertSettings", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.create = function (params) {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('alert_settings').post(params).then(function (result) {

        $log.debug("create alertSetting", result);

        $rootScope.$broadcast(SERVICE_EVENTS.alertSettingCreated, result);

        return result;

      }, function(result) {

        $log.warn("error creating alertSetting", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.update = function (params) {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('alert_settings', params.id).customPUT({
        key: params.key,
        operator: params.operator,
        value: params.value,
      }).then(function (result) {

        $log.debug("update alertSetting", result);

        $rootScope.$broadcast(SERVICE_EVENTS.alertSettingUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error updating alertSetting", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  return service;

}

module.exports = AlertSetting;
