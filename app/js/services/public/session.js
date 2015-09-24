'use strict';

/**
 * @ngInject
 */
function Session($log, $q, $rootScope, Me, Restangular, LocalStore,  SERVICE_EVENTS, AUTH_EVENTS, $translate, $filter) {
  var service = {};
  var self = this;

  self.session = null;

  self.set = function (session) {
    $log.debug("set session", session);

    self.session = session;

    LocalStore.saveAuthToken((session || {}).authToken);

    $rootScope.$broadcast(SERVICE_EVENTS.sessionUpdated);
  };

  service.clear = function () {
    $log.debug("clear user local storage");

    LocalStore.removeAuthToken();
    self.session = null;
  };

  service.login = function (email, password) {
    var promise = Restangular.all('users').all('sessions').post({
      email: email,
      password: password
    });

    promise.then(function(result) {

      $log.debug("user signed in: ", result);

      self.set(result.session);

      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

    }, function(response) {
      var errorMessage = response.data ? response.data.error : $translate.instant('public.login.field.errorLogin');

      $log.warn("error user signin: ", errorMessage);

      $rootScope.$broadcast(AUTH_EVENTS.loginFailed, errorMessage);
    });

    return promise;
  };

  service.logout = function() {
    var promise = Restangular.all('users').all("sessions").remove({}, {});

    promise.then(function(result) {

      $log.debug("ok signing out user", result);

    }, function(result) {

      $log.warn("error signing out user", result);

    }).finally(function() {
      service.clear();
      Me.clear();

      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    });

    return promise;
  };

  service.isLoggedIn = function () {
    return LocalStore.loadAuthToken() !== undefined;
  };

  return service;

}

module.exports = Session;
