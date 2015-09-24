'use strict';

/**
 * @ngInject
 */
function SearchSource($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.searchSources = [];

  self.set = function (searchSources) {
    $log.debug("set searchSources", searchSources);

    self.searchSources = searchSources;

    $rootScope.$broadcast(SERVICE_EVENTS.searchSourcesUpdated, searchSources);
  };

  service.get = function () {
    return self.searchSources;
  };

  service.reload = function () {
    return Restangular.all('users').all('search_sources').getList().then(function (result) {

      $log.debug("reloaded search sources", result);

      self.set(result);

      return result;

    }, function(result) {

      $log.warn("error reloading search sources", result);

      return $q.reject(result);

    });
  };

  return service;

}

module.exports = SearchSource;
