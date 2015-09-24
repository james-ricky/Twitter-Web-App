'use strict';

/**
 * @ngInject
 */
function Country($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.countries = [];

  self.set = function (countries) {
    $log.debug("set countries", countries);

    self.countries = countries;

    $rootScope.$broadcast(SERVICE_EVENTS.countriesUpdated, countries);
  };

  service.get = function () {
    return self.countries;
  };

  service.reload = function () {
    return Restangular.all('users').all('countries').getList().then(function (result) {

      $log.debug("reloaded countries", result);

      self.set(result);

      return result;

    }, function(result) {

      $log.warn("error reloading countries", result);

      return $q.reject(result);

    });
  };

  return service;

}

module.exports = Country;
