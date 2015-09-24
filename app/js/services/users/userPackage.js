'use strict';

/**
 * @ngInject
 */

function UserPackage($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.userPackage = [];


  self.set = function (userPackage) {
    $log.debug("set package", userPackage);

    self.userPackage = userPackage;

    $rootScope.$broadcast(SERVICE_EVENTS.getPackageDetail, userPackage);
  };

  service.get = function() {
    return self.userPackage;
  };


  service.reload = function () {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('company').one('package').get().then(function (result) {

        $log.debug("reloaded userpackage", result);

        self.set(result);

        return result;

      }, function(result) {

        $log.warn("error reloading userpackage", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };
  return service;
};

module.exports = UserPackage;
