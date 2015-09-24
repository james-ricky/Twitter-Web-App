'use strict';

/**
 * @ngInject
 */
function CompanyUser($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.companyUsers = [];

  var filterSelected = function(object) {
    return _.reduce(object, function(result, value, key) {
      if (value) {
        result[key] = value;
      }
      return result;
    }, {});
  };

  var formatSearchIds = function(params) {
    var selectedSearches = filterSelected(params.searches);
    return _.map(selectedSearches, function(selected, id, third) {
      return id;
    });
  };

  self.set = function (companyUsers) {
    $log.debug("set companyUsers", companyUsers);

    self.companyUsers = companyUsers;

    $rootScope.$broadcast(SERVICE_EVENTS.companyUsersUpdated, companyUsers);
  };

  service.get = function () {
    return self.companyUsers;
  };

  service.reload = function () {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('company').all('users').getList().then(function (result) {

        $log.debug("reloaded companyUsers", result);

        self.set(result);

        return result;

      }, function(result) {

        $log.warn("error reloading companyUsers", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.create = function (params) {
    var searchIds = formatSearchIds(params);
    var data = {
      title: params.title,
      givenName: params.givenName,
      familyName: params.familyName,
      jobTitle: params.jobTitle,
      email: params.email,
      mobilePhoneNumber: params.mobilePhoneNumber,
      officePhoneNumber: params.officePhoneNumber,
      role: params.role,
      searchIds: searchIds
    };

    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('company').all('users').post(data).then(function (result) {

        $log.debug("create companyUsers", result);

        $rootScope.$broadcast(SERVICE_EVENTS.companyUserCreated, result);

        return result;

      }, function(result) {

        $log.warn("error creating companyUsers", result);

        $rootScope.$broadcast(SERVICE_EVENTS.companyUserCreateFailed, result.data.error);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.update = function (params) {
    var searchIds = formatSearchIds(params);

    if (LocalStore.loadAuthToken()) {

      return Restangular.all('users').all('company').one('users', params.id).customPUT({
        title: params.title,
        givenName: params.givenName,
        familyName: params.familyName,
        jobTitle: params.jobTitle,
        email: params.email,
        mobilePhoneNumber: params.mobilePhoneNumber,
        officePhoneNumber: params.officePhoneNumber,
        role: params.role,
        searchIds: searchIds
      }).then(function (result) {

        $log.debug("update companyUser", result);

        $rootScope.$broadcast(SERVICE_EVENTS.companyUserUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error updating companyUser", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.updatePassword = function (params) {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('company').one('users', params.id).all('password').customPUT({
        newPassword: params.newPassword
      }).then(function (result) {

        $log.debug("update companyUser password", result);

        $rootScope.$broadcast(SERVICE_EVENTS.companyUserUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error updating companyUser", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.disable = function (params) {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('company').one('users', params.id).all('disable').customPUT().then(function (result) {

        $log.debug("disable company user", result);

        $rootScope.$broadcast(SERVICE_EVENTS.companyUsersUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error disabling companyUser", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.enable = function (params) {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('company').one('users', params.id).all('enable').customPUT().then(function (result) {

        $log.debug("enable company user", result);

        $rootScope.$broadcast(SERVICE_EVENTS.companyUsersUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error enabling companyUser", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  return service;

}

module.exports = CompanyUser;
