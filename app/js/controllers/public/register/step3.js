'use strict';

/**
 * @ngInject
 */
function PublicRegisterStep3IndexCtrl($rootScope, $scope, $state, $log, $stateParams, PaymentPlan, Restangular, Registration, SweetAlert, ModalWithBlurBackground, SERVICE_EVENTS, AUTH_EVENTS, $translate, $filter) {
  var vm = this;

  vm.userInfo = {
    email: $stateParams.email,
    password: $stateParams.password,
    companyName: $stateParams.companyName,
    title: $stateParams.title,
    givenName: $stateParams.givenName,
    familyName: $stateParams.familyName,
    jobTitle: $stateParams.jobTitle,
    officePhoneNumber: $stateParams.officePhoneNumber,
    mobilePhoneNumber: $stateParams.mobilePhoneNumber,
    industryId: $stateParams.industryId,
    addressLine1: $stateParams.addressLine1,
    addressLine2: $stateParams.addressLine2,
    addressLine3: $stateParams.addressLine3,
    countryId: $stateParams.countryId,
    paymentPlanOption: null,
    preferredLocale: $scope.publicBase.language
  };

  vm.paymentPlans = [];
  vm.allCommitments = [];
  vm.selectedCommitment = null;
  vm.errorMessage = "";
  vm.noticeMessage = "";
  vm.formProcessing = false;
  vm.promoCode = "";
  vm.promotionText = null;
  vm.promotionPercentage = null;
  vm.promotionErrorNotice = null;
  vm.showUpdatingPaymentPlansError = null;

  var clientToken = null;

  var showTermsAndConditions = function(callback) {
    ModalWithBlurBackground.open({
      templateUrl: "public/modals/termsAndConditions/show.html",
      controller: "PublicTermsAndConditionsModalCtrl as publicTermsAndConditionsModal",
      size: "lg",
      scope: $scope,
      resolve: {
        callback: function() {
          return callback;
        }
      }
    });
  };

  vm.updateRegistrationBillingDetails = function () {
    vm.formProcessing = true;
    vm.errorMessage = "";
    console.log("asdasd",vm.userInfo);


    showTermsAndConditions(function(termsAndConditions, privacyPolicy, fairUsePolicy, receiveUpdate) {
      createBraintreePaymentMethodNonce(function() {
        var paymentPlanOption = findPaymentPlanOption(vm.userInfo.paymentPlan, vm.selectedCommitment);
        Registration.createRegistration(vm.userInfo, false, paymentPlanOption, termsAndConditions, privacyPolicy, fairUsePolicy, receiveUpdate, vm.promoCode);
      });
    });
  };

  vm.registerWithoutPaymentPlan = function() {
    vm.formProcessing = true;
    vm.errorMessage = "";

    showTermsAndConditions(function(termsAndConditions, privacyPolicy, fairUsePolicy, receiveUpdate) {
      var paymentPlanOption = findPaymentPlanOption(vm.userInfo.paymentPlan, vm.selectedCommitment);
      Registration.createRegistration(vm.userInfo, true, paymentPlanOption, termsAndConditions, privacyPolicy, fairUsePolicy, receiveUpdate, vm.promoCode);
    });
  }

  vm.showErrorMessage = function(event, options) {
    vm.formProcessing = false;
    vm.errorMessage = options;
  };

  vm.showNoticeMessage = function(event, options) {
    vm.formProcessing = false;
    vm.noticeMessage = $translate.instant('public.registrations.field.registrationSucceed');
  };

  var showUpdatingPaymentPlansError = function(event, result) {
    // vm.formProcessing = false;
    vm.invalidPromoCodeError = $translate.instant('public.registrations.field.promoCodeError');
  };

  vm.setSelected = function(paymentPlan) {
    vm.userInfo.paymentPlan = paymentPlan;
  };

  vm.setCommitment = function(commitment) {
    vm.selectedCommitment = commitment;
  };

  vm.pricePerMonth = function(paymentPlan, commitment) {
    var paymentPlanOption = findPaymentPlanOption(paymentPlan, commitment);

    if (paymentPlanOption.promotion) {
      return paymentPlanOption.promotion.discountedPricePerMonth;
    } else {
      return paymentPlanOption.pricePerMonth;
    }
  };

  vm.topupPricePerMonth = function(paymentPlan, commitment) {
    return findPaymentPlanOption(paymentPlan, commitment).topup.price;
  };

  vm.topupMentionsPerMonth = function(paymentPlan, commitment) {
    return findPaymentPlanOption(paymentPlan, commitment).topup.mentions;
  };

  vm.topupSearchesPerMonth = function(paymentPlan, commitment) {
    return findPaymentPlanOption(paymentPlan, commitment).topup.searches;
  };

  vm.canApplyPromoCode = function() {
    return vm.promoCode.length === 0;
  };

  vm.applyPromoCode = function() {
    PaymentPlan.reload(vm.promoCode);
  };

  var findPaymentPlanOption = function(paymentPlan, commitment) {
    if (paymentPlan) {
      return _.find(paymentPlan.options, function(paymentPlanOption) {

        if (paymentPlanOption.commitment === commitment) {
          return paymentPlanOption;
        }
      });
    } else {
      return null;
    }
  };

  var setPaymentPlans = function() {
    vm.paymentPlans = PaymentPlan.get().plans;
    vm.promotionDetails = PaymentPlan.get().promotion;
    if (!_.isEmpty(vm.promotionDetails)) {
      if (vm.promotionDetails.discount.percentage) {
        vm.promotionText = vm.promotionDetails.text;
        vm.promotionPercentage = vm.promotionDetails.discount.percentage;
      } else {
        // vm.promotionErrorNotice = vm.result.data.error;
        // console.log(vm.promotionErrorNotice);
      }
    } else {
      vm.promotionText = null;
      vm.promotionPercentage = null;
      vm.promotionErrorNotice = null;
    }

    if (vm.paymentPlans.length > 0 && vm.paymentPlans[0].options.length > 0) {
      vm.userInfo.paymentPlan = vm.paymentPlans[0];
      vm.userInfo.paymentPlanOption = vm.paymentPlans[0].options[0];
      vm.allCommitments = _.sortBy(_.map(vm.paymentPlans[0].options, function(paymentPlanOption) {
        return paymentPlanOption.commitment;
      }), function(n) {
        return parseInt(n);
      });
      vm.selectedCommitment = vm.allCommitments[vm.allCommitments.length -1];
    }

    // _.each(vm.paymentPlans, function(paymentPlan) {
    //   if (paymentPlan.popular) {
    //     vm.userInfo.paymentPlan = paymentPlan;
    //   }
    // });
  };

  var redirectToStep1IfStateParamsBlank = function() {
    if (vm.userInfo.email === null) {
      $state.transitionTo('public.register_step1');
    }
  };

  var setBraintreeClientToken = function(event, options) {
    clientToken = options;
  };

  var createBraintreePaymentMethodNonce = function(callback) {
    var client = new braintree.api.Client({
      clientToken: clientToken
    });

    client.tokenizeCard(
      {
        cardholder_name: vm.userInfo.cardHolderName,
        number: vm.userInfo.creditCardNumber,
        expirationDate: vm.userInfo.expiry,
        cvv: vm.userInfo.cvv
      }, function (err, nonce) {
        vm.userInfo.paymentMethodNonce = nonce;

        callback();
      }
    );
  };

  // redirectToStep1IfStateParamsBlank();

  PaymentPlan.reload(vm.promoCode);
  Registration.getBraintreeClientToken();

  $scope.$on(SERVICE_EVENTS.reloadAfterChangeLanguage, function(events, args) {
    PaymentPlan.reload(vm.promoCode);
  });

  $scope.$on(SERVICE_EVENTS.braintreeClientTokenUpdated, setBraintreeClientToken);
  $scope.$on(SERVICE_EVENTS.paymentPlansUpdated, setPaymentPlans);
  $scope.$on(SERVICE_EVENTS.errorUpdatingPaymentPlans, showUpdatingPaymentPlansError);
  $scope.$on(AUTH_EVENTS.signUpStep3Success, vm.showNoticeMessage);
  $scope.$on(AUTH_EVENTS.signUpStep3Failed, vm.showErrorMessage);
}

module.exports = PublicRegisterStep3IndexCtrl;
