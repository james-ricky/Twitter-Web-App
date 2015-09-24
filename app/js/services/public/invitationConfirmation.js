'use strict';

/**
 * @ngInject
 */
function InvitationConfirmation($log, $rootScope, Restangular, AUTH_EVENTS) {

  var service = {};

  service.update = function (invitationToken, password) {
    var promise = Restangular.all('users').all('invitation_confirmation').customPUT({
      invitationToken: invitationToken,
      password: password
    });

    promise.then(function(result) {

      $log.debug("user invitation set password successfully: ", result);

      $rootScope.$broadcast(AUTH_EVENTS.invitationConfirmSuccess);

    }, function(response) {

      $log.warn("error user invitation set password: ", response.data.error);

      $rootScope.$broadcast(AUTH_EVENTS.invitationConfirmFailed, response.data.error);
    });

    return promise;
  };

  return service;

}

module.exports = InvitationConfirmation;
