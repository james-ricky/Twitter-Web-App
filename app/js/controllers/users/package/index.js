'use strict';

/**
 * @ngInject
 */

function UsersPackageIndexCtrl($rootScope, $state, $stateParams, $filter, Restangular, UserPackage, SERVICE_EVENTS) {

  var vm = this;

  vm.startDate = null;
  vm.endDate = null;

  vm.package = {};

  var setPackage = function() {
    vm.package = UserPackage.get();
    console.log("asasd",vm.package.package)
  };

  var setDate = function() {
     vm.startDate =  _.trunc(vm.package.package.startDate,{'length': 10, 'omission':''});
     vm.endDate =  _.trunc(vm.package.package.endDate,{'length': 10, 'omission':''});
  };

  UserPackage.reload();

  $rootScope.$on(  SERVICE_EVENTS.getPackageDetail,setPackage );
  $rootScope.$on(  SERVICE_EVENTS.getPackageDetail,setDate );

}

module.exports = UsersPackageIndexCtrl;
