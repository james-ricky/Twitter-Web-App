'use strict';

/**
 * @ngInject
 */
function UsersCompanyUsersIndexCtrl($rootScope, $scope, CompanyUser, SERVICE_EVENTS) {
  var vm = this;

  vm.companyUsers = [];

  var setCompanyUsers = function() {
    vm.companyUsers = CompanyUser.get();
  };

  vm.disable = function(companyUser) {
    CompanyUser.disable(companyUser);
  };

  vm.enable = function(companyUser) {
    CompanyUser.enable(companyUser);
  };

  CompanyUser.reload();

  $scope.$on(SERVICE_EVENTS.companyUsersUpdated, setCompanyUsers);
}

module.exports = UsersCompanyUsersIndexCtrl;
