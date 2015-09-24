'use strict';

/**
 * @ngInject
 */
function UsersHeaderCtrl($rootScope, $scope, Me, AlertMessage, Session, SERVICE_EVENTS) {
  var vm = this;
  vm.alertMessages = [];

  var me;

  var setMe = function() {
    me = Me.get();
  };

  var setAlertMessages = function() {
    var allMessages = AlertMessage.get();

    vm.alertMessages = _.filter(allMessages, function(message) {
      return message.level === 2;
    });
  };

  vm.logout = function() {
    Session.logout();
  };

  $scope.$on(SERVICE_EVENTS.meUpdated, setMe);
  $scope.$on(SERVICE_EVENTS.alertMessagesUpdated, setAlertMessages);
}

module.exports = UsersHeaderCtrl;
