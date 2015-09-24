'use strict';

/**
 * @ngInject
 */
function UsersAlertMessagesIndexCtrl($rootScope, $scope, AlertMessage, SERVICE_EVENTS) {
  var vm = this;

  vm.alertMessages = [];

  var setAlertMessages = function() {
    vm.alertMessages = AlertMessage.get();
  };

  AlertMessage.reload();

  $scope.$on(SERVICE_EVENTS.alertMessagesUpdated, setAlertMessages);
}

module.exports = UsersAlertMessagesIndexCtrl;
