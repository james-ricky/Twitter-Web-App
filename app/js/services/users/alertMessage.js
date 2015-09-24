'use strict';

/**
 * @ngInject
 */
function AlertMessage($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.alertMessages = [];

  self.set = function (alertMessages) {
    $log.debug("set alertMessages", alertMessages);

    self.alertMessages = alertMessages;

    $rootScope.$broadcast(SERVICE_EVENTS.alertMessagesUpdated, alertMessages);
  };

  service.get = function () {
    return self.alertMessages;
  };

  service.reload = function () {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('alert_messages').getList().then(function (result) {

        $log.debug("reloaded alertMessages", result);

        self.set(result);

        return result;

      }, function(result) {

        $log.warn("error reloading alertMessages", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  return service;

}

module.exports = AlertMessage;
