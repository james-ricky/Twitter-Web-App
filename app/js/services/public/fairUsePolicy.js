'use strict';

/**
 * @ngInject
 */
function FairUsePolicy($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS) {

  var service = {};
  var self = this;

  self.fairUsePolicy = null;

  self.set = function (fairUsePolicy) {
    $log.debug("set fairUsePolicy", fairUsePolicy);

    self.fairUsePolicy = fairUsePolicy;

    $rootScope.$broadcast(SERVICE_EVENTS.fairUsePolicyUpdated, fairUsePolicy);
  };

  service.get = function () {
    return self.fairUsePolicy;
  };

  service.reload = function () {
    return Restangular.all('users').all('fair_use_policies').one('current').get().then(function (result) {

      $log.debug("reloaded fair_use", result.fairUsePolicy);

      self.set(result.fairUsePolicy);

      return result.fairUsePolicy;

    }, function(result) {

      $log.warn("error reloading fair_use", result);

      return $q.reject(result);

    });
  };

  return service;

}

module.exports = FairUsePolicy;
