'use strict';

/**
 * @ngInject
 */
function PublicLoginIndexCtrl($rootScope, $scope, $state, $translate, Session, AUTH_EVENTS) {
  var vm = this;

  vm.userInfo = {};
  vm.errorMessage = "";
  vm.formProcessing = false;


  vm.login = function() {
    vm.formProcessing = true;
    vm.errorMessage = "";

    Session.login(vm.userInfo.email, vm.userInfo.password);
  };

  vm.showErrorMessage = function(event, options) {
    vm.formProcessing = false;
    vm.errorMessage = options;
  };

  vm.goToUserHome = function() {
    $state.transitionTo('users.home');
  };

  $scope.$on(AUTH_EVENTS.loginSuccess, vm.goToUserHome);
  $scope.$on(AUTH_EVENTS.loginFailed, vm.showErrorMessage);
}

module.exports = PublicLoginIndexCtrl;
