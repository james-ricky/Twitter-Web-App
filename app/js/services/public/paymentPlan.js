'use strict';

/**
 * @ngInject
 */
function PaymentPlan($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.paymentPlans = null;

  self.set = function(paymentPlans) {
    $log.debug("set paymentPlans", paymentPlans);

    self.paymentPlans = paymentPlans;

    $rootScope.$broadcast(SERVICE_EVENTS.paymentPlansUpdated, paymentPlans);
  };

  service.get = function() {
    return self.paymentPlans;
  };

  service.reload = function(promoCode) {
    return Restangular.all('users').one('payment_plans').get({promoCode: promoCode}).then(function (result) {

      $log.debug("reloaded paymentPlans", result);

      self.set(result);

      return result;

    }, function(result) {

      $log.warn("error reloading paymentPlans", result);
      $rootScope.$broadcast(SERVICE_EVENTS.errorUpdatingPaymentPlans, result);
      return $q.reject(result);
    });
  };

  return service;

}

module.exports = PaymentPlan;
