'use strict';

/**
 * @ngInject
 */
function Routes($stateProvider, $locationProvider, $urlRouterProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider
  .state('public', {
    templateUrl: 'public/base.html',
    controller: 'PublicBaseCtrl as publicBase'
  })
  .state('public.register_step1', {
    url: '/register/step1',
    templateUrl: 'public/register/step1.html',
    controller: 'PublicRegisterStep1IndexCtrl as publicRegisterStep1',
    title: 'Register Step 1'
  })
  .state('public.register_step2', {
    url: '/register/step2',
    templateUrl: 'public/register/step2.html',
    controller: 'PublicRegisterStep2IndexCtrl as publicRegisterStep2',
    params: {
      email: null,
      password: null,
      companyName: null
    },
    title: 'Register Step 2'
  })
  .state('public.register_step3', {
    url: '/register/step3',
    templateUrl: 'public/register/step3.html',
    controller: 'PublicRegisterStep3IndexCtrl as publicRegisterStep3',
    params: {
      email: null,
      password: null,
      companyName: null,
      title: null,
      givenName: null,
      familyName: null,
      jobTitle: null,
      officePhoneNumber: null,
      mobilePhoneNumber: null,
      industryId: null,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      countryId: null
    },
    title: 'Register Step 3'
  })
  .state('public.login', {
    url: '/login',
    templateUrl: 'public/login/index.html',
    controller: 'PublicLoginIndexCtrl as publicLogin',
    title: 'Login'
  })
  .state('public.forgot_password', {
    url: '/forgot_password',
    templateUrl: 'public/forgotPassword/index.html',
    controller: 'PublicForgotPasswordIndexCtrl as publicForgotPassword',
    title: 'Forgot Password'
  })
  .state('public.reset_password', {
    url: '/reset_password?resetPasswordToken',
    templateUrl: 'public/resetPassword/index.html',
    controller: 'PublicResetPasswordIndexCtrl as publicResetPassword',
    title: 'Reset Password'
  })
  .state('public.confirmation', {
    url: '/confirmation?confirmationToken',
    templateUrl: 'public/confirmation/index.html',
    controller: 'PublicConfirmationIndexCtrl as publicConfirmation',
    title: 'Account Confirmation'
  })
  .state('public.invitation', {
    url: '/invitation?invitationToken',
    templateUrl: 'public/invitation/index.html',
    controller: 'PublicInvitationIndexCtrl as publicInvitation',
    title: 'Invitation'
  })
  .state('public.404', {
    url: '/404',
    templateUrl: 'public/pages/404.html',
    controller: 'PublicPagesNotFoundCtrl as publicPagesNotFound',
    title: 'Page Not Found'
  })

  .state('users', {
    url: '/users',
    templateUrl: 'users/base.html',
    controller: 'UsersBaseCtrl as usersBase'
  })
  .state('users.home', {
    url: '/home',
    templateUrl: 'users/home/index.html',
    controller: 'UsersHomeIndexCtrl as usersHome',
    title: 'Home'
  })
  .state('users.dashboards', {
    url: '/dashboards',
    templateUrl: 'users/dashboards/index.html',
    controller: 'UsersDashboardsIndexCtrl as usersDashboards',
    title: 'Dashboards'
  })
  .state('users.dashboard_new', {
    url: '/dashboards/new',
    templateUrl: 'users/dashboards/new.html',
    controller: 'UsersDashboardsNewCtrl as usersDashboardNew',
    title: 'New Dashboard'
  })
  .state('users.dashboard_edit', {
    url: '/dashboards/edit/:id',
    templateUrl: 'users/dashboards/edit.html',
    controller: 'UsersDashboardsEditCtrl as usersDashboardEdit',
    title: 'Edit Dashboard'
  })
  .state('users.dashboard_show', {
    url: '/dashboards/:id',
    templateUrl: 'users/dashboards/show.html',
    controller: 'UsersDashboardsShowCtrl as usersDashboardShow',
    title: 'Show Dashboard'
  })
  .state('users.reports', {
    url: '/reports',
    templateUrl: 'users/reports/index.html',
    controller: 'UsersReportsIndexCtrl as usersReports',
    title: 'Reports'
  })
  .state('users.searches', {
    url: '/searches',
    templateUrl: 'users/searches/index.html',
    controller: 'UsersSearchesIndexCtrl as usersSearches',
    title: 'Searches'
  })
  .state('users.search_new', {
    url: '/searches/new',
    templateUrl: 'users/searches/new.html',
    controller: 'UsersSearchesNewCtrl as usersSearchNew',
    title: 'New Search'
  })
  .state('users.search_edit', {
    url: '/searches/edit/:id',
    templateUrl: 'users/searches/edit.html',
    controller: 'UsersSearchesEditCtrl as usersSearchEdit',
    title: 'Edit Search'
  })
  .state('users.search_show', {
    url: '/searches/show/:id',
    templateUrl: 'users/searches/show.html',
    controller: 'UsersSearchesShowCtrl as usersSearchShow',
    title: 'Show Search'
  })
  .state('users.company_edit', {
    url: '/company/edit',
    templateUrl: 'users/company/edit.html',
    controller: 'UsersCompanyEditCtrl as usersCompanyEdit',
    title: 'Company Account'
  })
  .state('users.company_users', {
    url: '/company/users',
    templateUrl: 'users/company/users/index.html',
    controller: 'UsersCompanyUsersIndexCtrl as usersCompanyUsers',
    title: 'Company Users'
  })
  .state('users.company_user_new', {
    url: '/company/users/new',
    templateUrl: 'users/company/users/new.html',
    controller: 'UsersCompanyUsersNewCtrl as usersCompanyUserNew',
    title: 'New Company User'
  })
  .state('users.company_user_edit', {
    url: '/company/users/edit/:id',
    templateUrl: 'users/company/users/edit.html',
    controller: 'UsersCompanyUsersEditCtrl as usersCompanyUserEdit',
    title: 'Edit Company User'
  })
  .state('users.profile', {
    url: '/company/users/profile',
    templateUrl: 'users/profile/show.html',
    controller: 'UsersProfileShowCtrl as usersProfileShow',
    title: 'My Profile'
  })
  .state('users.alert_messages', {
    url: '/alert_messages',
    templateUrl: 'users/alertMessages/index.html',
    controller: 'UsersAlertMessagesIndexCtrl as usersAlertMessages',
    title: 'Alert Messages'
  })
  .state('users.alert_settings', {
    url: '/alert_settings',
    templateUrl: 'users/alertSettings/index.html',
    controller: 'UsersAlertSettingsIndexCtrl as usersAlertSettings',
    title: 'Alert Settings'
  })
  .state('users.alert_setting_new', {
    url: '/alert_settings/new',
    templateUrl: 'users/alertSettings/new.html',
    controller: 'UsersAlertSettingsNewCtrl as usersAlertSettingNew',
    title: 'New Alert Setting'
  })
  .state('users.alert_setting_edit', {
    url: '/alert_settings/edit/:id',
    templateUrl: 'users/alertSettings/edit.html',
    controller: 'UsersAlertSettingsEditCtrl as usersAlertSettingEdit',
    title: 'Edit Alert Setting'
  })
  .state('users.support_help', {
    url: '/support/help',
    templateUrl: 'users/support/help/index.html',
    controller: 'UsersSupportHelpIndexCtrl as usersSupportHelp',
    title: 'Support | Help'
  })
  .state('users.package', {
    url: '/package/',
    templateUrl: 'users/package/index.html',
    controller: 'UsersPackageIndexCtrl as usersPackage',
    title: 'Package Usage'
  })
  .state('users.support_training', {
    url: '/support/training',
    templateUrl: 'users/support/training/index.html',
    controller: 'UsersSupportTrainingIndexCtrl as usersSupportTraining',
    title: 'Support | Training'
  });

  $urlRouterProvider.when('/', '/login');
  $urlRouterProvider.otherwise('/404');
}

module.exports = Routes;
