'use strict';

/**
 * @ngInject
 */
function Template($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.templates = [];

  self.set = function (templates) {
    $log.debug("set templates", templates);

    self.templates = templates;

    $rootScope.$broadcast(SERVICE_EVENTS.templatesUpdated, templates);
  };

  service.get = function () {
    return self.templates;
  };

  service.reload = function () {
    return Restangular.all('users').all('templates').getList().then(function (result) {

      $log.debug("reloaded templates", result);

      self.set(result);

      return result;

    }, function(result) {

      $log.warn("error reloading templates", result);

      return $q.reject(result);

    });
  };

  return service;

}

module.exports = Template;
