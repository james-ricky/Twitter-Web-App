'use strict';

/**
 * @ngInject
 */
function PrivacyPolicy($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS) {

  var service = {};
  var self = this;

  self.privacyPolicy = null;

  self.set = function (privacyPolicy) {
    $log.debug("set privacyPolicy", privacyPolicy);

    self.privacyPolicy = privacyPolicy;

    $rootScope.$broadcast(SERVICE_EVENTS.privacyPolicyUpdated, privacyPolicy);
  };

  service.get = function () {
    return self.privacyPolicy;
  };

  service.reload = function () {
    return Restangular.all('users').all('privacy_policy').one('current').get().then(function (result) {

      $log.debug("reloaded privacy_policy", result.privacyPolicy);

      self.set(result.privacyPolicy);

      return result.privacyPolicy;

    }, function(result) {

      $log.warn("error reloading privacy_policy", result);

      return $q.reject(result);

    });
  };

  return service;

};

module.exports = PrivacyPolicy;
