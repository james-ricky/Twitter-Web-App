'use strict';

/**
 * @ngInject
 */
function PublicForgotPasswordIndexCtrl($rootScope, $scope, ResetPasswordInstruction, AUTH_EVENTS, $translate, $filter) {
  var vm = this;

  vm.userInfo = {};
  vm.noticeMessage = "";
  vm.errorMessage = "";
  vm.formProcessing = false;

  vm.sendForgotPasswordInstruction = function () {
    vm.formProcessing = true;
    vm.errorMessage = "";

    ResetPasswordInstruction.send(vm.userInfo.email);
  };

  vm.showErrorMessage = function(event, options) {
    vm.formProcessing = false;
    vm.errorMessage = options;
  };

  vm.showNoticeMessage = function(event, options) {
    vm.noticeMessage = $translate.instant('public.forgotPassword.field.getEmail');
  };

  $scope.$on(AUTH_EVENTS.forgotPasswordSuccess, vm.showNoticeMessage);
  $scope.$on(AUTH_EVENTS.forgotPasswordFailed, vm.showErrorMessage);
}

module.exports = PublicForgotPasswordIndexCtrl;
