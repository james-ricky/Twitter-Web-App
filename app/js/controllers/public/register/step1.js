'use strict';

/**
 * @ngInject
 */
function PublicRegisterStep1IndexCtrl($rootScope, $scope, $state, Registration, SERVICE_EVENTS) {
  var vm = this;

  vm.userInfo = {};

  // validating validated-passed validated-failed
  vm.companyNameValidationClass = "not-validated";
  vm.emailValidationClass = "not-validated";
  vm.passwordValidationClass = "not-validated";

  var validCompanyName = true;
  var validEmail = false;
  var validPassword = false;

  vm.startValidatingCompanyName = function() {
    // if (vm.userInfo.companyName && vm.userInfo.companyName.length > 0) {
    //   vm.companyNameValidationClass = "validating";
    //
    //   Registration.validateCompanyName(vm.userInfo.companyName);
    // } else {
    //   setCompanyNameValidatedFailed();
    // }
  };

  vm.startValidatingEmail = function() {
/*    if (vm.userInfo.email && vm.userInfo.email.length > 0) {
      vm.emailValidationClass = "validating";

      Registration.validateEmail(vm.userInfo.email);
    } else {
      setEmailValidatedFailed(null, "Invalid email address");
    }
    */
  };

  vm.startValidatingPassword = function() {
    vm.passwordValidationClass = "validating";

/*    if (validatePassword(vm.userInfo.password)) {
      setPasswordValidatedPassed();
    } else {
      setPasswordValidatedFailed();
    }
*/
  };

  vm.validationFailed = function() {
    return !(validCompanyName && validEmail && validPassword);
  };

  vm.register = function () {
    // Registration.signUp(vm.userInfo);
    $state.transitionTo('public.register_step2', {
      email: vm.userInfo.email,
      password: vm.userInfo.password,
      companyName: vm.userInfo.companyName
    });
  };

  var validatePassword = function() {
    var pattern = /[a-zA-Z0-9]{6,12}/;

    return vm.userInfo.password && vm.userInfo.password.match(pattern);
  };

  // var setCompanyNameValidatedPassed = function() {
  //   vm.companyNameValidationClass = "validated-passed";
  //   validCompanyName = true;
  // };
  //
  // var setCompanyNameValidatedFailed = function() {
  //   vm.companyNameValidationClass = "validated-failed";
  //   validCompanyName = false;
  // };

  var setEmailValidatedPassed = function() {
    vm.emailValidationClass = "validated-passed";
    validEmail = true;
  };

  var setEmailValidatedFailed = function(event, message) {
    vm.emailValidationClass = "validated-failed";
    vm.emailValidationTooltip = message;
    validEmail = false;
  };

  var setPasswordValidatedPassed = function() {
    vm.passwordValidationClass = "validated-passed";
    validPassword = true;
  };

  var setPasswordValidatedFailed = function() {
    vm.passwordValidationClass = "validated-failed";
    validPassword = false;
  };



  // $rootScope.$on(SERVICE_EVENTS.validateCompanyNamePassed, setCompanyNameValidatedPassed);
  // $rootScope.$on(SERVICE_EVENTS.validateCompanyNameFailed, setCompanyNameValidatedFailed);
  $scope.$on(SERVICE_EVENTS.validateEmailPassed, setEmailValidatedPassed);
  $scope.$on(SERVICE_EVENTS.validateEmailFailed, setEmailValidatedFailed);
}

module.exports = PublicRegisterStep1IndexCtrl;
