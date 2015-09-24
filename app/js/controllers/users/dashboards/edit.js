'use strict';

/**
 * @ngInject
 */
function UsersDashboardsEditCtrl($rootScope, $scope, $state, $stateParams, $filter, Dashboard, Search, Restangular, LocalStore, SERVICE_EVENTS) {
  var vm = this;

  vm.dashboard = {
    searches: []
  };

  vm.allSearches = [];

  var setSearches = function() {
    vm.allSearches = Search.get();

    var tempSearches = {};
    _.each(vm.dashboard.searches, function(search) {
      tempSearches[search.id] = true;
    });

    vm.dashboard.searches = tempSearches;
  };

  var reloadDashboard = function() {
    if (LocalStore.loadAuthToken()) {
      Restangular.all('users').one('dashboards', $stateParams.id).get().then(function(result) {

        vm.dashboard = result.dashboard;

        Search.reload();

      }, function(result) {

        $log.warn("error reloading dashboard", result);

        vm.dashboard = null;
      });
    } else {
      vm.dashboard = null;
    }
  };

  var redirectToDashboardsIndex = function() {
    $state.transitionTo('users.dashboards');
  };

  vm.selectedAtLeastOneSearch = function() {
    return Object.keys(vm.dashboard.searches).some(function (key) {
      return vm.dashboard.searches[key];
    });
  };

  vm.updateDashboard = function() {
    Dashboard.update(vm.dashboard);
  };

  reloadDashboard();

  $scope.$on(SERVICE_EVENTS.searchesUpdated, setSearches);
  $scope.$on(SERVICE_EVENTS.dashboardUpdated, redirectToDashboardsIndex);

}

module.exports = UsersDashboardsEditCtrl;
