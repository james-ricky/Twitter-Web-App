'use strict';

var angular = require('angular');

// angular modules

require('angular-ui-router');
require('angular-animate');
require('angular-cookies');
require('angular-touch');
require('angular-sanitize');
require('angular-bootstrap');
require('angular-sweetalert');
require('angular-google-chart');
require('allmighty-autocomplete');
require('moment-locale');
require('angular-moment');
require('angular-translate');
require('jspdf');
require('./libs/jquery-ui');
require('./libs/ivh-treeview');

require('angular-ui-sortable');
require('zeroclipboard');
require('noty');
require('jquery');
require('jquery.slimscroll');
require('restangular');
require('ng-tags-input');
require('braintree-web');
require('./templates');

// create and bootstrap application
angular.element(document).ready(function() {
  var appSettings = require('./constants');

  var requires = [
    'templates',
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'restangular',
    'ui.router',
    'ui.bootstrap',
    'oitozero.ngSweetAlert',
    'angularMoment',
    'lamplight.env',
    'ngTagsInput',
    'pascalprecht.translate',
    'ui.sortable',
    'autocomplete',
    'ivh.treeview',
    'infinite-scroll',
    'googlechart'
  ];

  // mount on window for testing
  window.app = angular.module('lamplight', requires);

  var app = angular.module('lamplight');

  app.controller('PublicBaseCtrl', require('./controllers/public/base'));
  app.controller('PublicLoginIndexCtrl', require('./controllers/public/login/index'));
  app.controller('PublicRegisterStep1IndexCtrl', require('./controllers/public/register/step1'));
  app.controller('PublicRegisterStep2IndexCtrl', require('./controllers/public/register/step2'));
  app.controller('PublicRegisterStep3IndexCtrl', require('./controllers/public/register/step3'));
  app.controller('PublicForgotPasswordIndexCtrl', require('./controllers/public/forgotPassword/index'));
  app.controller('PublicConfirmationIndexCtrl', require('./controllers/public/confirmation/index'));
  app.controller('PublicResetPasswordIndexCtrl', require('./controllers/public/resetPassword/index'));
  app.controller('PublicInvitationIndexCtrl', require('./controllers/public/invitation/index'));
  app.controller('PublicPagesNotFoundCtrl', require('./controllers/public/pages/notFound'));
  app.controller('PublicTermsAndConditionsModalCtrl', require('./controllers/public/modals/termsAndConditions/show'));

  app.controller('UsersBaseCtrl', require('./controllers/users/base'));
  app.controller('UsersHomeIndexCtrl', require('./controllers/users/home/index'));
  app.controller('UsersHeaderCtrl', require('./controllers/users/layout/header'));
  app.controller('UsersNavCtrl', require('./controllers/users/layout/nav'));
  app.controller('FirstTimeLoginModalCtrl', require('./controllers/users/modals/firstTimeLogin/show'));
  app.controller('UsersSearchesIndexCtrl', require('./controllers/users/searches/index'));
  app.controller('UsersSearchesNewCtrl', require('./controllers/users/searches/new'));
  app.controller('UsersSearchesEditCtrl', require('./controllers/users/searches/edit'));
  app.controller('UsersSearchesShowCtrl', require('./controllers/users/searches/show'));
  app.controller('UsersDashboardsIndexCtrl', require('./controllers/users/dashboards/index'));
  app.controller('UsersDashboardsNewCtrl', require('./controllers/users/dashboards/new'));
  app.controller('UsersDashboardsEditCtrl', require('./controllers/users/dashboards/edit'));
  app.controller('UsersDashboardsShowCtrl', require('./controllers/users/dashboards/show'));
  app.controller('NewWidgetModalCtrl', require('./controllers/users/modals/widgets/new'));
  app.controller('EditWidgetModalCtrl', require('./controllers/users/modals/widgets/edit'));
  app.controller('UsersReportsIndexCtrl', require('./controllers/users/reports/index'));
  app.controller('UsersCompanyEditCtrl', require('./controllers/users/company/edit'));
  app.controller('UsersCompanyUsersIndexCtrl', require('./controllers/users/company/users/index'));
  app.controller('UsersCompanyUsersNewCtrl', require('./controllers/users/company/users/new'));
  app.controller('UsersCompanyUsersEditCtrl', require('./controllers/users/company/users/edit'));
  app.controller('UsersProfileShowCtrl', require('./controllers/users/profile/show'));
  app.controller('UsersAlertMessagesIndexCtrl', require('./controllers/users/alertMessages/index'));
  app.controller('UsersAlertSettingsIndexCtrl', require('./controllers/users/alertSettings/index'));
  app.controller('UsersAlertSettingsNewCtrl', require('./controllers/users/alertSettings/new'));
  app.controller('UsersAlertSettingsEditCtrl', require('./controllers/users/alertSettings/edit'));
  app.controller('UsersSupportHelpIndexCtrl', require('./controllers/users/support/help/index'));
  app.controller('UsersSupportTrainingIndexCtrl', require('./controllers/users/support/training/index'));
  app.controller('UsersPackageIndexCtrl', require('./controllers/users/package/index'));
  app.controller('UsersTermsAndConditionsModalCtrl', require('./controllers/users/modals/termsAndConditions/show'));




  app.service('ModalWithBlurBackground', require('./services/modalWithBlurBackground'));

  app.service('ResetPasswordInstruction', require('./services/public/resetPasswordInstruction'));
  app.service('ResetPassword', require('./services/public/resetPassword'));
  app.service('Registration', require('./services/public/registration'));
  app.service('Confirmation', require('./services/public/confirmation'));
  app.service('Session', require('./services/public/session'));
  app.service('InvitationConfirmation', require('./services/public/invitationConfirmation'));
  app.service('Industry', require('./services/public/industry'));
  app.service('Country', require('./services/public/country'));
  app.service('PaymentPlan', require('./services/public/paymentPlan'));
  app.service('TermsAndConditions', require('./services/public/termsAndConditions'));
  app.service('FairUsePolicy', require('./services/public/fairUsePolicy'));
  app.service('PrivacyPolicy', require('./services/public/privacyPolicy'));

  app.service('Me', require('./services/users/me'));
  app.service('Company', require('./services/users/company'));
  app.service('FirstTimeWalkthrough', require('./services/users/firstTimeWalkthrough'));
  app.service('CompanyUser', require('./services/users/companyUser'));
  app.service('Search', require('./services/users/search'));
  app.service('Dashboard', require('./services/users/dashboard'));
  app.service('Continent', require('./services/users/continent'));
  app.service('Template', require('./services/users/template'));
  app.service('AlertMessage', require('./services/users/alertMessage'));
  app.service('AlertSetting', require('./services/users/alertSetting'));
  app.service('SearchSource', require('./services/users/searchSource'));
  app.service('SearchPurpose', require('./services/users/searchPurpose'));
  app.service('WidgetData', require('./services/users/widgetData'));
  app.service('UserPackage', require('./services/users/userPackage'));
  app.service('LatestTermsAndConditions', require('./services/users/latestTermsAndConditions'));



  app.directive('loadingOverlay', require('./directives/loadingOverlay'));
  app.directive('customSelect', require('./directives/customSelect'));
  app.directive('slimScroll', require('./directives/slimScroll'));
  app.directive('collapseNav', require('./directives/nav/collapseNav'));
  app.directive('highlightActive', require('./directives/nav/highlightActive'));
  app.directive('toggleNavCollapsedMin', require('./directives/nav/toggleNavCollapsedMin'));
  app.directive('toggleOffCanvas', require('./directives/nav/toggleOffCanvas'));
  app.directive('widgetFilter', require('./directives/widgets/widgetFilter'));
  app.directive('uiSelectRequired', require('./directives/uiSelectRequired'));
  app.directive('infiniteScroll', require('./directives/ngInfiniteScroll'));

  app.filter('formatSearchPerMonth', require('./filters/formatSearchesPerMonth'));
  app.filter('formatMentionsPerMonth', require('./filters/formatMentionsPerMonth'));
  app.filter('formatTopupMentionsPerMonth', require('./filters/formatTopupMentionsPerMonth'));


  app.factory('AuthInterceptor', require('./factories/authInterceptor'));
  app.factory('LocalStore', require('./factories/localStore'));

  app.constant('API_EVENTS', appSettings.apiEvents);
  app.constant('AUTH_EVENTS', appSettings.authEvents);
  app.constant('UI_EVENTS', appSettings.uiEvents);
  app.constant('SERVICE_EVENTS', appSettings.serviceEvents);

  app.config(require('./config/routes'));
  app.config(require('./config/httpProviderInterceptor'));
  app.config(require('./config/translate'));
  app.config(require('./config/ivhTreeview'));

  app.run(require('./initializers/pageTitle'));
  app.run(require('./initializers/bodyCssClass'));
  app.run(require('./initializers/restangular'));

  angular.bootstrap(document, ['lamplight']);

});
