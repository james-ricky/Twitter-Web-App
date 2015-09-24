'use strict';

/**
 * @ngInject
 */
function PublicTermsAndConditionsModalCtrl($rootScope, $scope, $modalInstance, $timeout, $sce, TermsAndConditions, PrivacyPolicy,  FairUsePolicy, SERVICE_EVENTS, callback) {
  var vm = this;

  vm.termsAndConditionsHtml = "";
  vm.fairUsePolicyHtml = "";
  vm.privacyPolicyHtml = "";
  vm.receiveUpdate = true;

  var setTermsAndConditions = function() {
    vm.termsAndConditions = TermsAndConditions.get();
    vm.termsAndConditionsHtml = $sce.trustAsHtml(vm.termsAndConditions.html);
  };

  var setPrivacyPolicy = function() {
    vm.privacyPolicy = PrivacyPolicy.get();
    vm.privacyPolicyHtml = $sce.trustAsHtml(vm.privacyPolicy.html);
  };


  var setFairUsePolicy = function() {
    vm.fairUsePolicy = FairUsePolicy.get();
    vm.fairUsePolicyHtml = $sce.trustAsHtml(vm.fairUsePolicy.html);
  };

  vm.submitForm = function() {
    callback(vm.termsAndConditions, vm.privacyPolicy, vm.fairUsePolicy, vm.receiveUpdate);

    $modalInstance.dismiss('agree');
  };

  vm.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $modalInstance.opened.then(function() {
  });

  TermsAndConditions.reload();
  FairUsePolicy.reload();
  PrivacyPolicy.reload();

  $scope.$on(SERVICE_EVENTS.termsAndConditionsUpdated, setTermsAndConditions);
  $scope.$on(SERVICE_EVENTS.fairUsePolicyUpdated, setFairUsePolicy);
  $scope.$on(SERVICE_EVENTS.privacyPolicyUpdated, setPrivacyPolicy);
}

module.exports = PublicTermsAndConditionsModalCtrl;
