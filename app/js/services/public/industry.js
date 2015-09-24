'use strict';

/**
 * @ngInject
 */
function Industry($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.industries = [];

  self.set = function (industries) {
    $log.debug("set industries", industries);

    self.industries = industries;

    $rootScope.$broadcast(SERVICE_EVENTS.industriesUpdated, industries);
  };

  service.get = function () {
    return self.industries;
  };

  service.reload = function () {
    return Restangular.all('users').all('industries').getList().then(function (result) {

      $log.debug("reloaded industries", result);

      self.set(result);

      return result;

    }, function(result) {

      $log.warn("error reloading industries", result);

      return $q.reject(result);

    });
  };

  return service;

}

module.exports = Industry;
