'use strict';

/**
 * @ngInject
 */
function LatestTermsAndConditions($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.acceptedLatestTermsAndConditions = null;

  self.set = function (me) {
    $log.debug("set acceptedLatestTermsAndConditions", acceptedLatestTermsAndConditions);

    self.acceptedLatestTermsAndConditions = acceptedLatestTermsAndConditions;

    $rootScope.$broadcast(SERVICE_EVENTS.meUpdated, acceptedLatestTermsAndConditions);
  };

  service.get = function () {
    return self.acceptedLatestTermsAndConditions;
  };


  service.reload = function () {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('acceptedLatestTermsAndConditions').get().then(function (result) {

        $log.debug("reloaded acceptedLatestTermsAndConditions", result);

        self.set(result.acceptedLatestTermsAndConditions);

        return result.acceptedLatestTermsAndConditions;

      }, function(result) {

        $log.warn("error reloading acceptedLatestTermsAndConditions", result);

        service.clear();

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  return service;

}


module.exports = LatestTermsAndConditions;
