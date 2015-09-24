'use strict';

/**
 * @ngInject
 */
function Registration($log, $rootScope, Restangular, Session, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};

  service.getBraintreeClientToken = function() {
    Restangular.all('users').all("registrations").all('braintree').all('token').getList()
      .then(function (result) {

        $log.debug("ok getting braintree client token", result[0]);

        $rootScope.$broadcast(SERVICE_EVENTS.braintreeClientTokenUpdated, result[0]);

      }, function (response) {
        $log.error("error getting braintree client token", response.data.error);
      });
  };

  service.createRegistration = function(params, demo, paymentPlanOption, termsAndConditions, privacyPolicy, fairUsePolicy, receiveUpdate, promoCode) {
    var data = {
      email: params.email,
      password: params.password,
      companyName: params.companyName,
      title: params.title,
      givenName: params.givenName,
      familyName: params.familyName,
      jobTitle: params.jobTitle,
      mobilePhoneNumber: params.mobilePhoneNumber,
      officePhoneNumber: params.officePhoneNumber,
      industryId: params.industryId,
      addressLine1: params.addressLine1,
      addressLine2: params.addressLine2,
      addressLine3: params.addressLine3,
      countryId: params.countryId,
      demo: demo,
      cardHolderName: params.cardHolderName,
      paymentMethodNonce: params.paymentMethodNonce,
      paymentPlanOptionId: paymentPlanOption ? paymentPlanOption.id : null,
      preferredLocale: params.preferredLocale.locale,
      termsAndConditionsId: termsAndConditions.id,
      privacyPolicyId: privacyPolicy.id,
      fairUsePolicyId: fairUsePolicy.id,
      receiveUpdate: receiveUpdate,
      promoCode: promoCode
    };

    console.log("data", data);

    Restangular.all('users').all("registrations").customPOST(data)
      .then(function (result) {

        $log.debug("ok signing up step 3");

        $rootScope.$broadcast(AUTH_EVENTS.signUpStep3Success);

      }, function (response) {
        $log.error("error signing up step 3", response.data.error);

        $rootScope.$broadcast(AUTH_EVENTS.signUpStep3Failed, response.data.error);
      });
  };

  service.validateCompanyName = function(companyName) {
    Restangular.all('users').all("registrations").all("company_name").one("unique", companyName).get()
      .then(function (result) {

        $log.debug("ok validate company name");

        if (result.unique) {
          $rootScope.$broadcast(SERVICE_EVENTS.validateCompanyNamePassed);
        } else {
          $rootScope.$broadcast(SERVICE_EVENTS.validateCompanyNameFailed);
        }
      }, function (response) {
        $log.error("error validate company name", response.data.error);

        $rootScope.$broadcast(SERVICE_EVENTS.validateCompanyNameFailed, response.data.error);
      });
  };

  service.validateEmail = function(email) {
    Restangular.all('users').all("registrations").all("email").one("unique", email).get()
      .then(function (result) {

        $log.debug("ok validate email");

        if (result.unique) {
          $rootScope.$broadcast(SERVICE_EVENTS.validateEmailPassed);
        } else {
          $rootScope.$broadcast(SERVICE_EVENTS.validateEmailFailed, "Email already exists");
        }

      }, function (response) {
        if (response.status === 0) {
          $log.error("error validate email", response);

          $rootScope.$broadcast(SERVICE_EVENTS.validateEmailFailed, "Connection Timeout");
        } else {
          $log.error("error validate email", response.data.error);

          $rootScope.$broadcast(SERVICE_EVENTS.validateEmailFailed, response.data.error);
        }
      });
  };

  return service;

}

module.exports = Registration;
