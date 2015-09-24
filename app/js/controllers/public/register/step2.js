'use strict';

/**
 * @ngInject
 */

function PublicRegisterStep2IndexCtrl($rootScope, $scope, $state, $stateParams, Registration, Country, Industry, SERVICE_EVENTS, AUTH_EVENTS, $translate, LocalStore, $filter ) {

  var vm = this;

  vm.userInfo = {
    email: $stateParams.email,
    password: $stateParams.password,
    companyName: $stateParams.companyName,
    industry: null,
    country: null,
    title: null
  };
  vm.allCountries = [];
  vm.allCompanyIndustries = [];

  // vm.allTitles = [
  //   {
  //     label: $translate.instant('public.registrations.field.mr'),
  //     value: 'mr'
  //   },
  //   {
  //     label: $translate.instant('public.registrations.field.mrs'),
  //     value: 'mrs'
  //   }
  // ];

  vm.allI18nTitles = {
    'en-US': [
      {
        label: 'Mr.',
        value: 'mr'
      },
      {
        label: 'Miss',
        value: 'ms'
      }
    ],
    'zh-TW': [
      {
        label: '先生',
        value: 'mr'
      },
      {
        label: '女士',
        value: 'ms'
      }
    ]
  };

  vm.errorMessage = "";
  vm.formProcessing = false;

  vm.allTitles = function() {
    return vm.allI18nTitles[$scope.publicBase.language.locale];
  };

  vm.updateRegistrationInfoDetails = function () {
    vm.formProcessing = true;
    vm.errorMessage = "";

    $state.transitionTo('public.register_step3', {
      email: vm.userInfo.email,
      password: vm.userInfo.password,
      companyName: vm.userInfo.companyName,
      title: vm.userInfo.title.value,
      givenName: vm.userInfo.givenName,
      familyName: vm.userInfo.familyName,
      jobTitle: vm.userInfo.jobTitle,
      officePhoneNumber: vm.userInfo.officePhoneNumber,
      mobilePhoneNumber: vm.userInfo.mobilePhoneNumber,
      industryId: vm.userInfo.industry.id,
      addressLine1: vm.userInfo.addressLine1,
      addressLine2: vm.userInfo.addressLine2,
      addressLine3: vm.userInfo.addressLine3,
      countryId: vm.userInfo.country.id
    });
  };

  vm.showErrorMessage = function(event, options) {
    vm.formProcessing = false;
    vm.errorMessage = options;
  };

  var setCountries = function() {
    vm.allCountries = Country.get();
  };

  var setIndustries = function() {
    vm.allCompanyIndustries = Industry.get();

  };

  var redirectToStep1IfStateParamsBlank = function() {
    if (vm.userInfo.email === null) {
      $state.transitionTo('public.register_step1');
    }
  };

  // redirectToStep1IfStateParamsBlank();

  Country.reload();
  Industry.reload();

  $scope.$on(SERVICE_EVENTS.reloadAfterChangeLanguage, function(events, args) {
    Country.reload();
    Industry.reload();
  });

  $scope.$on(SERVICE_EVENTS.countriesUpdated, setCountries);
  $scope.$on(SERVICE_EVENTS.industriesUpdated, setIndustries);
}

module.exports = PublicRegisterStep2IndexCtrl;
