'use strict';

/**
 * @ngInject
 */
function UsersProfileShowCtrl($scope, Me, Session, SweetAlert, SERVICE_EVENTS,  $translate, $filter) {
  var vm = this;
  vm.me = {};

  var setMe = function() {
    vm.me = Me.get();
  };

  var showDeleteUserAccountConfirmationMessage = function() {
    $scope.usersBase.showDeleteConfirmationMessage(function() {
      Me.delete();
    });
  };

  var showUpdatePasswordSuccessMessage = function() {
    noty({
      text: $translate.instant('users.show.field.passwordUpdated'),
      type: 'success',
      layout: 'topCenter',
      theme: 'bootstrapTheme',
      timeout: 2000
    });

    Session.logout();
  };

  var showUpdatePasswordFailedMessage = function () {
    noty({
      text: $translate.instant('users.show.field.incorrectPassword'),
      type: 'error',
      layout: 'topCenter',
      theme: 'bootstrapTheme',
      timeout: 2000
    });
  };

  var showUpdateInfoSuccessMessage = function(first, second) {
    noty({
      text: $translate.instant('users.show.field.infoUpdated'),
      type: 'success',
      layout: 'topCenter',
      theme: 'bootstrapTheme',
      timeout: 2000
    });
  };

  var showUpdateInfoFailedMessage = function() {

    noty({
      text: $translate.instant('users.show.field.errorInfo'),
      type: 'error',
      layout: 'topCenter',
      theme: 'bootstrapTheme',
      timeout: 2000
    });
  };

  var showDeleteSuccessMessage = function() {
    Session.logout();

    swal(
      $translate.instant('users.company.field.deleted'),
      $translate.instant('users.company.field.hasBeenDeleted'),
      "success"
    );
  };

  var showDeleteFailedMessage = function() {
    noty({
      text: $translate.instant('users.show.field.errorAccount'),
      type: 'error',
      layout: 'topCenter',
      theme: 'bootstrapTheme'
    });
  };

  var clearUpdatedmessage = function() {
    return $.noty.clearQueue();
  }

  vm.updateInfo = function() {
    Me.updateInfo(vm.me);
  };

  vm.updatePassword = function() {
    Me.updatePassword(vm.me);
  };

  Me.reload().then(function (result) {
    setMe();
  });

  $scope.$on(SERVICE_EVENTS.meUpdateInfoSuccess, showUpdateInfoSuccessMessage);
  $scope.$on(SERVICE_EVENTS.meUpdateInfoFailed, showUpdateInfoFailedMessage);
  $scope.$on(SERVICE_EVENTS.meUpdatePasswordSuccess, showUpdatePasswordSuccessMessage);
  $scope.$on(SERVICE_EVENTS.meUpdatePasswordFailed, showUpdatePasswordFailedMessage);
  $scope.$on(SERVICE_EVENTS.meDeleteSuccess, showDeleteSuccessMessage);
  $scope.$on(SERVICE_EVENTS.meDeleteFailed, showDeleteFailedMessage);
}

module.exports = UsersProfileShowCtrl;
