'use strict';

/**
 * @ngInject
 */
function SearchPurpose($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.searchPurposes = [];

  self.set = function (searchPurposes) {
    $log.debug("set searchPurposes", searchPurposes);

    self.searchPurposes = searchPurposes;

    $rootScope.$broadcast(SERVICE_EVENTS.searchPurposesUpdated, searchPurposes);
  };

  service.get = function () {
    return self.searchPurposes;
  };

  service.reload = function () {
    return Restangular.all('users').all('search_purposes').getList().then(function (result) {

      $log.debug("reloaded search purposes", result);

      self.set(result);

      return result;

    }, function(result) {

      $log.warn("error reloading search purposes", result);

      return $q.reject(result);

    });
  };

  return service;

}

module.exports = SearchPurpose;
