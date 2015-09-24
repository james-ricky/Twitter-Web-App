'use strict';

/**
 * @ngInject
 */
function ResetPassword($log, $rootScope, Restangular, AUTH_EVENTS) {

  var service = {};

  service.update = function (resetPasswordToken, password) {
    var promise = Restangular.all('users').all('reset_password').customPUT({
      resetPasswordToken: resetPasswordToken,
      password: password
    });

    promise.then(function(result) {

      $log.debug("user reset password successfully: ", result);

      $rootScope.$broadcast(AUTH_EVENTS.resetPasswordSuccess);

    }, function(response) {

      $log.warn("error user reset password: ", response.data.error);

      $rootScope.$broadcast(AUTH_EVENTS.resetPasswordFailed, response.data.error);
    });

    return promise;
  };

  return service;

}

module.exports = ResetPassword;
