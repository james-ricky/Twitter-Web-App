'use strict';

/**
 * @ngInject
 */
function Confirmation($log, $rootScope, Restangular, AUTH_EVENTS) {

  var service = {};

  service.confirmEmailAddress = function(confirmationToken) {
    Restangular.all('users').all("confirmations").post({
      confirmationToken: confirmationToken
    })
    .then(function (result) {

      $log.debug("ok confirmation", result);

      $rootScope.$broadcast(AUTH_EVENTS.confirmationSuccess);

    }, function (response) {
      $log.error("error confirmation", response.data.error);

      $rootScope.$broadcast(AUTH_EVENTS.confirmationFailed, response.data.error);
    });
  };

  return service;

}

module.exports = Confirmation;
