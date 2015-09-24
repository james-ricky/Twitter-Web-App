'use strict';

/**
 * @ngInject
 */
 function AuthInterceptor($rootScope, $q, AUTH_EVENTS, API_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout,
        500: API_EVENTS.internalError
      }[response.status], response);
      return $q.reject(response);
    }
  };
}

module.exports = AuthInterceptor;
