'use strict';

/**
 * @ngInject
 */
function UsersHomeIndexCtrl($rootScope, $scope, $modal, $timeout, Me, SweetAlert,LatestTermsAndConditions, ModalWithBlurBackground, UI_EVENTS) {
  var showTermsAndConditions = function() {
    var acceptedLatestTermsAndConditions = Me.getAcceptedLatestTermsAndConditions();
    if (acceptedLatestTermsAndConditions === true) {
      ModalWithBlurBackground.open({
        templateUrl: "users/modals/termsAndConditions/show.html",
        controller: "UsersTermsAndConditionsModalCtrl as usersTermsAndConditionsModal",
        backdrop: 'static',
        size: "lg",
        scope: $scope,
      });
    }
  };

  $scope.$on(UI_EVENTS.showNewTermsAndConditions, showTermsAndConditions);
}

module.exports = UsersHomeIndexCtrl;
