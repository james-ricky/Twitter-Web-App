'use strict';

/**
 * @ngInject
 */
function UsersBaseCtrl($scope, $rootScope, $state, $translate, Session, Me, LocalStore, amMoment, API_EVENTS, AlertMessage, SweetAlert, UI_EVENTS, SERVICE_EVENTS, AUTH_EVENTS, $filter) {
  var vm = this;
  vm.me;

  vm.allLanguages = [
    {
      name: 'English',
      locale: 'en-US'
    },
    {
      name: '繁體中文',
      locale: 'zh-TW'
    }
  ];

  vm.alertMessages = [];

  var setMe = function() {
    vm.me = Me.get();
    if (vm.me) {
      var language = _.find(vm.allLanguages, function(language) {
        return language.locale === vm.me.preferredLocale;
      });
      vm.setLanguage(language, false);
    }
  };

  var showInternalServiceError = function (event, options) {
    SweetAlert.swal({
      title: $translate.instant('users.notice.internalError'),
      text: $translate.instant('users.notice.tryLater'),
      type: "warning",
      confirmButtonText: $translate.instant('users.notice.ok'),
    });
  };

  var setAlertMessages = function() {
    var allMessages = AlertMessage.get();

    vm.alertMessages = _.filter(allMessages, function(message) {
      return message.level === 1;
    });
  };

  var useLanguageStored = function() {
    var storedLocale = LocalStore.loadPreferredLocale();
    if (storedLocale) {
      $translate.use(storedLocale);
    }
  };
  useLanguageStored();

  vm.showDeleteConfirmationMessage = function(callback) {
    SweetAlert.swal({
      title: $translate.instant('users.company.field.areYouSure'),
      text:  $translate.instant('users.company.field.youAreGoing'),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText:  $translate.instant('users.company.field.deleteIt'),
      cancelButtonText: $translate.instant('users.company.field.cancel'),
      closeOnConfirm: true,
    }, function(confirm){
      if (confirm === true) {
        callback();
      }
    });
  };

  vm.setLanguage = function(language, shouldSave) {
     $translate.use(language.locale);
     vm.me.language = language;
     LocalStore.savePreferredLocale(language.locale);
     amMoment.changeLocale(language.locale.toLowerCase());

     shouldSave = typeof shouldSave !== 'undefined' ? shouldSave : true;
     if (shouldSave) {
       Me.updatePrefferedLocale(language.locale);
     }
   };
  vm.goToPublicLogin = function() {
    Session.clear();
    $state.transitionTo('public.login');
  };

  if (Session.isLoggedIn()) {
    Me.reload()
    .then(function (result) {
      // load service that requires user session
      $rootScope.$broadcast(UI_EVENTS.appLoaded, result);
      $rootScope.$broadcast(UI_EVENTS.showNewTermsAndConditions);


      if (vm.me.isPrimaryUser === true) {
        AlertMessage.reload();

        $scope.$on('$stateChangeSuccess', function(ev, data) {
          AlertMessage.reload();
        });
      }
    });
  } else {
    vm.goToPublicLogin();
  }

  $scope.$on(API_EVENTS.internalError, showInternalServiceError);

  $scope.$on(SERVICE_EVENTS.meUpdated, setMe);
  $scope.$on(SERVICE_EVENTS.alertMessagesUpdated, setAlertMessages);

  $scope.$on(AUTH_EVENTS.logoutSuccess, setMe);
  $scope.$on(AUTH_EVENTS.logoutSuccess, vm.goToPublicLogin);
  $scope.$on(AUTH_EVENTS.notAuthenticated, vm.goToPublicLogin);
}

module.exports = UsersBaseCtrl;
