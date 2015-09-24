'use strict';

/**
 * @ngInject
 */
function ResetPasswordInstruction($log, $rootScope, Restangular, AUTH_EVENTS) {

  var service = {};

  service.send = function (email) {
    var promise = Restangular.all('users').all('forgot_password').post({
      email: email
    });

    promise.then(function(result) {

      $log.debug("user sent reset password request: ", result);

      $rootScope.$broadcast(AUTH_EVENTS.forgotPasswordSuccess);

    }, function(response) {

      $log.warn("error user signin: ", response.data.error);

      $rootScope.$broadcast(AUTH_EVENTS.forgotPasswordFailed, response.data.error);
    });

    return promise;
  };

  return service;

}

module.exports = ResetPasswordInstruction;
