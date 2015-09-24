'use strict';

/**
 * @ngInject
 */
function PublicResetPasswordIndexCtrl($rootScope, $scope, $stateParams, ResetPassword, AUTH_EVENTS, $translate, $filter) {
  var vm = this;

  vm.userInfo = {};
  vm.noticeMessage = "";
  vm.errorMessage = "";
  vm.formProcessing = false;
  vm.showLoginLink = false;

  vm.resetPassword = function () {
    vm.formProcessing = true;
    vm.errorMessage = "";

    ResetPassword.update($stateParams.resetPasswordToken, vm.userInfo.password);
  };

  vm.showErrorMessage = function(event, options) {
    vm.formProcessing = false;
    vm.errorMessage = options;
  };

  vm.showNoticeMessage = function(event, options) {
    vm.formProcessing = false;
    vm.noticeMessage =  $translate.instant('public.resetPassword.field.resetSucceed');
    vm.showLoginLink = true;
  };

  $scope.$on(AUTH_EVENTS.resetPasswordSuccess, vm.showNoticeMessage);
  $scope.$on(AUTH_EVENTS.resetPasswordFailed, vm.showErrorMessage);
}

module.exports = PublicResetPasswordIndexCtrl;
