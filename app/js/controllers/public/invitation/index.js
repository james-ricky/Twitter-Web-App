'use strict';

/**
 * @ngInject
 */
function PublicInvitationIndexCtrl($rootScope, $scope, $stateParams, InvitationConfirmation, AUTH_EVENTS, $translate, $filter) {
  var vm = this;

  vm.userInfo = {};
  vm.noticeMessage = "";
  vm.errorMessage = "";
  vm.formProcessing = false;
  vm.showLoginLink = false;

  vm.setPassword = function () {
    vm.formProcessing = true;
    vm.errorMessage = "";

    InvitationConfirmation.update($stateParams.invitationToken, vm.userInfo.password);
  };

  vm.showErrorMessage = function(event, options) {
    vm.formProcessing = false;
    vm.errorMessage = options;
  };

  vm.showNoticeMessage = function(event, options) {
    vm.formProcessing = false;
    vm.noticeMessage = $translate.instant('public.invitation.field.loginWithNew');
    vm.showLoginLink = true;
  };

  $scope.$on(AUTH_EVENTS.invitationConfirmSuccess, vm.showNoticeMessage);
  $scope.$on(AUTH_EVENTS.invitationConfirmFailed, vm.showErrorMessage);
}

module.exports = PublicInvitationIndexCtrl;
