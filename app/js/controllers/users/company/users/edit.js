'use strict';

/**
 * @ngInject
 */
function UsersCompanyUsersEditCtrl($rootScope, $scope, $state, $stateParams, Restangular, CompanyUser, Search, LocalStore, SERVICE_EVENTS) {
  var vm = this;

  vm.companyUser = {
    searches: []
  };
  vm.allSearches = [];

  vm.updateUser = function() {
    CompanyUser.update(vm.companyUser);
  };

  vm.updatePassword = function() {
    CompanyUser.updatePassword(vm.companyUser);
  };

  var reloadCompanyUser = function() {
    if (LocalStore.loadAuthToken()) {
      Restangular.all('users').all('company').one('users', $stateParams.id).get().then(function(result) {

        vm.companyUser = result.user;

        console.log("saa",vm.companyUser)

      }, function(result) {

        $log.warn("error reloading companyUser", result);

        vm.companyUser = null;
      });
    } else {
      vm.companyUser = null;
    }
  };

  var redirectToCompanyUsersIndex = function() {
    $state.transitionTo('users.company_users');
  };

  var setSearches = function() {
    vm.allSearches = Search.get();

    var tempSearches = {};
    _.each(vm.companyUser.searchIds, function(search) {
      tempSearches[search] = true;
    });

    vm.companyUser.searches = tempSearches;
    console.log("asdas",vm.companyUser.searches)

  };

  Search.reload();
  reloadCompanyUser();

  $scope.$on(SERVICE_EVENTS.searchesUpdated, setSearches);
  $scope.$on(SERVICE_EVENTS.companyUserUpdated, redirectToCompanyUsersIndex);
}

module.exports = UsersCompanyUsersEditCtrl;
