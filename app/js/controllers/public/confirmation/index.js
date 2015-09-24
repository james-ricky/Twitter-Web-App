'use strict';

/**
 * @ngInject
 */
function PublicConfirmationIndexCtrl($scope, $rootScope, $stateParams, Confirmation, AUTH_EVENTS, $translate, $filter) {
  var vm = this;

  vm.errorMessage = "";
  vm.noticeMessage = "";

  vm.processing = true;

  Confirmation.confirmEmailAddress($stateParams.confirmationToken);

  vm.showErrorMessage = function(event, options) {
    vm.processing = false;
    vm.errorMessage = options;
  };

  vm.showNoticeMessage = function(event, options) {
    vm.processing = false;
    vm.noticeMessage =  $translate.instant('public.confirmation.field.verificationSucceed');
  };

  $scope.$on(AUTH_EVENTS.confirmationSuccess, vm.showNoticeMessage);
  $scope.$on(AUTH_EVENTS.confirmationFailed, vm.showErrorMessage);
}

module.exports = PublicConfirmationIndexCtrl;
