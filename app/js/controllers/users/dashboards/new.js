'use strict';

/**
 * @ngInject
 */
function UsersDashboardsNewCtrl($scope, $rootScope, $state, $filter, Dashboard, Search, Template, SERVICE_EVENTS) {
  var vm = this;

  vm.dashboard = {
    searchIds: [],
    searches: {
    }
  };

  vm.allTemplates = [];
  vm.allSearches = [];

  var setSearches = function() {
    vm.allSearches = Search.get();
  };

  var setTemplates = function() {
    vm.allTemplates = Template.get();
  };

  var redirectToDashboardsIndex = function(event, result) {
    $state.transitionTo('users.dashboard_show', { id: result.id });
  };

  vm.selectedAtLeastOneSearch = function() {
    return Object.keys(vm.dashboard.searches).some(function (key) {
      return vm.dashboard.searches[key];
    });
  };

  vm.createDashboard = function() {
    Dashboard.create(vm.dashboard);
  };

  Search.reload();
  Template.reload();

  $scope.$on(SERVICE_EVENTS.templatesUpdated, setTemplates);
  $scope.$on(SERVICE_EVENTS.searchesUpdated, setSearches);
  $scope.$on(SERVICE_EVENTS.dashboardCreated, redirectToDashboardsIndex);
  $scope.$on(SERVICE_EVENTS.reloadAfterChangeLanguage, Template.reload);

}

module.exports = UsersDashboardsNewCtrl;
