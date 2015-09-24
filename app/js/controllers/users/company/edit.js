'use strict';

/**
 * @ngInject
 */
function UsersCompanyEditCtrl($rootScope, $scope, $state, Me, Company, CompanyUser, Country, Industry, Session, SweetAlert, SERVICE_EVENTS, $translate, $filter) {
  var vm = this;
  vm.me = null;
  vm.company = {
    industry: null,
    country: null,
  };
  vm.companyUsers = [];

  vm.allCountries = [];
  vm.allCompanyIndustries = [];

  var setCountries = function() {
    vm.allCountries = Country.get();

    if (vm.company.countryId) {
      vm.company.country = _.find(vm.allCountries, function(country) {
        return country.id === vm.company.countryId;
      });
    }
  };

  var setIndustries = function() {
    vm.allCompanyIndustries = Industry.get();

    if (vm.company.industryId) {
      vm.company.industry = _.find(vm.allCompanyIndustries, function(industry) {
        return industry.id === vm.company.industryId;
      });
    }
  };

  var setMe = function() {
    vm.me = Me.get();

    Company.reload();
    CompanyUser.reload();
  };

  var setCompany = function() {
    vm.company = Company.get();

    Country.reload();
    Industry.reload();
  };

  var setCompanyUsers = function() {
    vm.companyUsers = _.filter(CompanyUser.get(), function(companyUser) {
      return companyUser.id !== vm.me.id;
    });
  };

  var goToUserHome = function() {
    $state.transitionTo('users.home');
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
      text: $translate.instant('users.company.field.deleteError'),
      type: 'error',
      layout: 'topCenter',
      theme: 'bootstrapTheme',
      timeout: 2000
    });
  };

  vm.showDeleteCompanyConfirmationMessage = function() {
    $scope.usersBase.showDeleteConfirmationMessage(function() {
      Company.delete(vm.company);
    });
  };

  vm.updateCompanyInfo = function() {
    Company.update(vm.company);
  };

  vm.updatePrimaryUser = function() {
    Company.updatePrimaryUser(vm.company.primaryUser);
  };

  Me.reload().then(function (result) {
    setMe();
  });

  $scope.$on(SERVICE_EVENTS.companyUpdated, setCompany);
  $scope.$on(SERVICE_EVENTS.companyUsersUpdated, setCompanyUsers);
  $scope.$on(SERVICE_EVENTS.countriesUpdated, setCountries);
  $scope.$on(SERVICE_EVENTS.industriesUpdated, setIndustries);
  $scope.$on(SERVICE_EVENTS.reloadAfterChangeLanguage, setCompany);

  $scope.$on(SERVICE_EVENTS.companyPrimaryUserUpdated, goToUserHome);

  $scope.$on(SERVICE_EVENTS.companyDeleteSuccess, showDeleteSuccessMessage);
  $scope.$on(SERVICE_EVENTS.companyDeleteFailed, showDeleteFailedMessage);
}

module.exports = UsersCompanyEditCtrl;
