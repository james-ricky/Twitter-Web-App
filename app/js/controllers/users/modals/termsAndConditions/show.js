'use strict';

/**
 * @ngInject
 */
function UsersTermsAndConditionsModalCtrl($rootScope, $scope, $modalInstance, $timeout, $translate, $filter, $sce, TermsAndConditions, Me, SERVICE_EVENTS) {
  var vm = this;

  vm.formProcessing = false;

  vm.termsAndConditionsHtml = "";

  vm.showErrorMessage = function() {
    vm.formProcessing = true;
  };

  var setTermsAndConditions = function() {
    vm.termsAndConditions = TermsAndConditions.get();
    vm.termsAndConditionsHtml = $sce.trustAsHtml(vm.termsAndConditions.html);
  };

  vm.updateAcceptedLatestTermsAndConditions = function() {
    var acceptedTermsAndConditions = TermsAndConditions.get().id;
      Me.updateAcceptedLatestTermsAndConditions(acceptedTermsAndConditions);

      $modalInstance.dismiss('agree');
  };

  // $modalInstance.opened.then(function() {
  // });

  TermsAndConditions.reload();

  $scope.$on(SERVICE_EVENTS.termsAndConditionsUpdated, setTermsAndConditions);

}

module.exports = UsersTermsAndConditionsModalCtrl;
