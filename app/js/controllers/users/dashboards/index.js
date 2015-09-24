'use strict';

/**
 * @ngInject
 */
function UsersDashboardsIndexCtrl($rootScope, $scope, Dashboard, Search, SERVICE_EVENTS) {
  var vm = this;

  vm.dashboards = [];
  vm.searches = null;

  var setDashboards = function() {
    vm.dashboards = Dashboard.get();
  };

  var deleteSelectedDashboard = function(event, options) {
    _.remove(vm.dashboards, function(dashboard) {
      return dashboard.id === options;
    });
  };

  var setSearches = function() {
    vm.searches = Search.get();
  };

  vm.deleteDashboard = function(dashboard) {
    Dashboard.delete(dashboard);
  };

  Dashboard.reload();
  Search.reload();

  $scope.$on(SERVICE_EVENTS.dashboardDeleted, deleteSelectedDashboard);
  $scope.$on(SERVICE_EVENTS.dashboardsUpdated, setDashboards);

  $scope.$on(SERVICE_EVENTS.searchesUpdated, setSearches);
}

module.exports = UsersDashboardsIndexCtrl;
