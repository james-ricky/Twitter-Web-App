'use strict';

/**
 * @ngInject
 */
function FirstTimeLoginModalCtrl($rootScope, $modalInstance, $timeout, FirstTimeWalkthrough, SERVICE_EVENTS) {
  var vm = this;

  vm.stepButtonLabel = 'Next';
  vm.currentStep = 1;

  vm.previousStep = function() {
    if (vm.currentStep !== 1) {
      vm.currentStep -= 1;
    }
  };

  vm.nextStep = function() {
    if (vm.currentStep === 3) {
      vm.cancel();
    } else {
      vm.currentStep += 1;
    }
  };

  vm.stepButtonLabel = function() {
    if (vm.currentStep === 3) {
      return 'Done';
    } else {
      return 'Next';
    }
  };

  vm.cancel = function() {
    FirstTimeWalkthrough.complete();
    $modalInstance.dismiss('cancel');
  };

  $modalInstance.opened.then(function() {
  })
}

module.exports = FirstTimeLoginModalCtrl;
