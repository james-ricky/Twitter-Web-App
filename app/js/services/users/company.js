'use strict';

/**
 * @ngInject
 */
function Company($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.company = null;

  self.set = function (company) {
    $log.debug("set company", company);

    self.company = company;

    $rootScope.$broadcast(SERVICE_EVENTS.companyUpdated, company);
  };

  service.get = function () {
    return self.company;
  };

  service.reload = function () {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('company').get().then(function (result) {

        $log.debug("reloaded company", result);

        self.set(result.company);

        return result.company;

      }, function(result) {

        $log.warn("error reloading company", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.update = function (params) {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('company').customPUT({
        name: params.name,
        industryId: params.industry.id,
        addressLine1: params.addressLine1,
        addressLine2: params.addressLine2,
        addressLine3: params.addressLine3,
        countryId: params.country.id,
      }).then(function (result) {

        $log.debug("update company", result);

        $rootScope.$broadcast(SERVICE_EVENTS.companyUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error updating company", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.updatePrimaryUser = function (params) {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('company').all('primary_user').customPUT({
        userId: params.id
      }).then(function (result) {

        $log.debug("update company primary user", result);

        $rootScope.$broadcast(SERVICE_EVENTS.companyPrimaryUserUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error updating company primary user", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.delete = function () {
    var promise = Restangular.all('users').all("company").remove();

    promise.then(function (result) {

      $log.debug("ok deleting company", result);

      $rootScope.$broadcast(SERVICE_EVENTS.companyDeleteSuccess);

    }, function (result) {

      $log.error("error deleting company", result);

      $rootScope.$broadcast(SERVICE_EVENTS.companyDeleteFailed);

    });

    return promise;
  };

  return service;

}

module.exports = Company;
