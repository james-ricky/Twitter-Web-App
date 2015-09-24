'use strict';

/**
 * @ngInject
 */
function Continent($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.continents = [];

  self.set = function (continents) {
    $log.debug("set continents", continents);

    self.continents = continents;

    $rootScope.$broadcast(SERVICE_EVENTS.continentsUpdated, continents);
  };

  service.get = function () {
    return self.continents;
  };

  service.reload = function () {
    return Restangular.all('users').all('countries').all('continents').getList().then(function (result) {

      $log.debug("reloaded continents", result);

      self.set(result);

      return result;

    }, function(result) {

      $log.warn("error reloading continents", result);

      return $q.reject(result);

    });
  };

  return service;

}

module.exports = Continent;
