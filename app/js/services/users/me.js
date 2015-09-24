'use strict';

/**
 * @ngInject
 */
function Me($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.me = null;
  self.acceptedLatestTermsAndConditions = true;

  self.set = function (me) {
    $log.debug("set me", me);

    self.me = me;

    $rootScope.$broadcast(SERVICE_EVENTS.meUpdated, me);
  };

  service.get = function () {
    return self.me;
  };

  service.clear = function () {
    $log.debug("clear user local storage");

    self.me = null;

    $rootScope.$broadcast(SERVICE_EVENTS.meUpdated);
  };

  service.getAcceptedLatestTermsAndConditions = function() {
    return self.acceptedLatestTermsAndConditions;
  };

  service.reload = function () {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('me').get().then(function (result) {

        $log.debug("reloaded me", result);

        self.set(result.me);
        self.acceptedLatestTermsAndConditions = result.acceptedLatestTermsAndConditions;

        return result.me;

      }, function(result) {

        $log.warn("error reloading me", result);

        service.clear();

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.updateInfo = function (params) {
    var data = {
      email: params.email,
      title: params.title,
      givenName: params.givenName,
      familyName: params.familyName,
      jobTitle: params.jobTitle,
      mobilePhoneNumber: params.mobilePhoneNumber,
      officePhoneNumber: params.officePhoneNumber
    };

    var promise = Restangular.all('users').all("me").all("info").customPUT(data);

    promise.then(function (result) {

      $log.debug("ok updating me info", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meUpdateInfoSuccess);

    }, function (result) {

      $log.error("error updating me info", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meUpdateInfoFailed);
    });

    return promise;
  };

  service.updateAcceptedLatestTermsAndConditions = function (acceptedTermsAndConditionsId) {

    var data = {
      acceptedTermsAndConditions: acceptedTermsAndConditionsId,
    };

console.log(data);
    var promise = Restangular.all('users').all("me").all("terms_and_conditions").customPUT(data);

    promise.then(function (result) {

      $log.debug("ok updating acceptedLatestTermsAndConditions", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meUpdatePasswordSuccess);

    }, function (result) {

      $log.error("error updating acceptedLatestTermsAndConditions", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meUpdatePasswordFailed);

    });

    return promise;
  };

  service.updatePassword = function (params) {
    var data = {
      currentPassword: params.currentPassword,
      newPassword: params.newPassword,
    };

    var promise = Restangular.all('users').all("me").all("password").customPUT(data);

    promise.then(function (result) {

      $log.debug("ok updating me password", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meUpdatePasswordSuccess);

    }, function (result) {

      $log.error("error updating me password", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meUpdatePasswordFailed);

    });

    return promise;
  };

  service.updatePrefferedLocale = function (locale) {
    var data = {
      preferredLocale: locale
    };

    var promise = Restangular.all('users').all("me").all("locale").customPUT(data);

    promise.then(function (result) {

      $log.debug("ok updating me locale", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meUpdatePasswordSuccess);

      $rootScope.$broadcast(SERVICE_EVENTS.reloadAfterChangeLanguage );


    }, function (result) {

      $log.error("error updating me locale", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meUpdatePasswordFailed);

    });

    return promise;
  };

  service.delete = function () {
    var promise = Restangular.all('users').all("me").remove();

    promise.then(function (result) {

      $log.debug("ok deleting me", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meDeleteSuccess);

    }, function (result) {

      $log.error("error deleting me", result);

      $rootScope.$broadcast(SERVICE_EVENTS.meDeleteFailed);

    });

    return promise;
  };

  return service;

}

module.exports = Me;
