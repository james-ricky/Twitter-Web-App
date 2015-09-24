'use strict';

/**
 * @ngInject
 */
function UsersCompanyUsersNewCtrl($rootScope, $scope, $state, CompanyUser, Search, Me, SERVICE_EVENTS) {
  var vm = this;

  vm.companyUser = {
    searchIds: [],
    searches: {
    }
  };
  vm.allSearches = [];

  vm.errorMessage = null;

  var setSearches = function() {
    vm.allSearches = Search.get();
  };

  var setDefaultRole = function(event, args) {
    if (args) {
      vm.companyUser.role = args.role;
    }
  };

  var redirectToCompanyUsersIndex = function() {
    $state.transitionTo('users.company_users');
  };

  var setErrorMessage = function(event, message) {
    vm.errorMessage = message;
  };

  vm.createUser = function() {
    vm.errorMessage = null;

    CompanyUser.create(vm.companyUser);
  };

  Search.reload();

  $scope.$on(SERVICE_EVENTS.searchesUpdated, setSearches);
  $scope.$on(SERVICE_EVENTS.meUpdated, setDefaultRole);
  $scope.$on(SERVICE_EVENTS.companyUserCreated, redirectToCompanyUsersIndex);
  $scope.$on(SERVICE_EVENTS.companyUserCreateFailed, setErrorMessage);
}

module.exports = UsersCompanyUsersNewCtrl;
