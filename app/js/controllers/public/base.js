'use strict';

/**
 * @ngInject
 */
function PublicBaseCtrl($scope, $rootScope, $state, $translate, Session, LocalStore, API_EVENTS, SERVICE_EVENTS, SweetAlert, Country, $filter) {
  var vm = this;

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

  vm.language = vm.allLanguages[0];

  var useLanguageStored = function() {
    var storedLocale = LocalStore.loadPreferredLocale();
    if (storedLocale) {
      vm.language = _.find(vm.allLanguages, function(language) {
        return language.locale === storedLocale;
      });

      $translate.use(vm.language.locale);
    }
  };

  vm.setLanguage = function(language) {
    $translate.use(language.locale);
    vm.language = language;
    LocalStore.savePreferredLocale(language.locale);
    $rootScope.$broadcast(SERVICE_EVENTS.reloadAfterChangeLanguage );

  };

  var goToUserDashboard = function() {
    $state.transitionTo('users.home');
  };

  var showInternalServiceError = function (event, options) {
    SweetAlert.swal({
      title: $translate.instant('users.notice.internalError'),
      text: $translate.instant('users.notice.tryLater'),
      type: "warning",
      confirmButtonText: $translate.instant('users.notice.ok'),
    });
  };

  if (Session.isLoggedIn()) {
    if (_.include(['public.reset_password', 'public.confirmation', 'public.invitation'], $state.current.name)) {
      Session.logout();
    } else {
      goToUserDashboard();
    }
  }

  useLanguageStored();

  $scope.$on(API_EVENTS.internalError, showInternalServiceError);

}

module.exports = PublicBaseCtrl;
