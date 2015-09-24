'use strict';

/**
 * @ngInject
 */
function TermsAndConditions($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS) {

  var service = {};
  var self = this;

  self.termsAndConditions = null;

  self.set = function (termsAndConditions) {
    $log.debug("set termsAndConditions", termsAndConditions);

    self.termsAndConditions = termsAndConditions;

    $rootScope.$broadcast(SERVICE_EVENTS.termsAndConditionsUpdated, termsAndConditions);
  };

  service.get = function () {
    return self.termsAndConditions;
  };

  service.reload = function () {
    return Restangular.all('users').all('terms_and_conditions').one('current').get().then(function (result) {

      $log.debug("reloaded terms_and_conditions", result.termsAndConditions);

      self.set(result.termsAndConditions);

      return result.termsAndConditions;

    }, function(result) {

      $log.warn("error reloading terms_and_conditions", result);

      return $q.reject(result);

    });
  };

  return service;

}

module.exports = TermsAndConditions;
