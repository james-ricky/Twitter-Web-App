'use strict';

/**
 * @ngInject
 */
function Dashboard($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.dashboards = [];

  self.set = function (dashboards) {
    $log.debug("set dashboards", dashboards);

    self.dashboards = dashboards;

    $rootScope.$broadcast(SERVICE_EVENTS.dashboardsUpdated, dashboards);
  };

  var filterSelected = function(object) {
    return _.reduce(object, function(result, value, key) {
      if (value) {
        result[key] = value;
      }
      return result;
    }, {});
  };

  var formatParams = function(params) {
    var selectedSearches = filterSelected(params.searches);
    var searchIds = _.map(selectedSearches, function(selected, id, third) {
      return id;
    });

    var result = {
      name: params.name,
      searchIds: searchIds
    }

    if (params.template) {
      result.templateId = params.template.id
    }

    return result;
  };

  service.get = function () {
    return self.dashboards;
  };

  service.reload = function () {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('dashboards').getList().then(function (result) {

        $log.debug("reloaded dashboards", result);

        self.set(result);

        return result;

      }, function(result) {

        $log.warn("error reloading dashboards", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.create = function (params) {
    var data = formatParams(params);

    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('dashboards').post(data).then(function (result) {

        $log.debug("create dashboard", result);

        $rootScope.$broadcast(SERVICE_EVENTS.dashboardCreated, result);

        return result;

      }, function(result) {

        $log.warn("error creating dashboard", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.update = function (params) {
    var data = formatParams(params);

    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('dashboards', params.id).customPUT(data).then(function (result) {

        $log.debug("update dashboard", result);

        $rootScope.$broadcast(SERVICE_EVENTS.dashboardUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error updating dashboard", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.updateWidgetSettings = function (id, settings) {
    if (LocalStore.loadAuthToken()) {
      var data = {
        widgetSettings: settings
      };
      return Restangular.all('users').one('dashboards', id).all('widget_settings').customPUT(data).then(function (result) {

        $log.debug("update widget_settings", result);

        $rootScope.$broadcast(SERVICE_EVENTS.dashboardWidgetSettingsUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error updating widget_settings", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.delete = function (dashboard) {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('dashboards', dashboard.id).remove().then(function (result) {

        $log.debug("delete dashboard", result);

        $rootScope.$broadcast(SERVICE_EVENTS.dashboardDeleted, dashboard.id);

        return result;

      }, function(result) {

        $log.warn("error deleting dashboard", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  return service;

}

module.exports = Dashboard;
