'use strict';

/**
 * @ngInject
 */
function UsersSearchesShowCtrl($rootScope, $scope, $state, $stateParams, $filter, ivhTreeviewMgr, Search, SearchSource, SearchPurpose, Industry, Continent, Restangular, LocalStore, SERVICE_EVENTS) {
  var vm = this;
  var defaultLanguageValue = "en";

  vm.allSearchSources = [];
  vm.allSearchPurposes = [];
  vm.allIndustries = [];
  vm.allContinents = [];
  vm.startDate = null;
  vm.endDate = null;

  var setSearchSources = function() {
    vm.allSearchSources = SearchSource.get();

    var tempSources = {};
    _.each(vm.search.sourceIds, function(searchSourceId) {
      tempSources[searchSourceId] = _.capitalize(searchSourceId.replace("source_",""));
    });
    vm.search.searchSources = tempSources;

  };

  var setDate = function() {
     vm.startDate =  _.trunc(vm.search.startDate,{'length': 10, 'omission':''});
     vm.endDate =  _.trunc(vm.search.endDate,{'length': 10, 'omission':''});
  };

  var setSearchPurposes = function() {
    vm.allSearchPurposes = SearchPurpose.get();
    vm.search.searchPurpose = _.find(vm.allSearchPurposes, function(searchPurpose) {
      return searchPurpose.id === vm.search.searchPurposeId;
    });
  };

  var setIndustries = function() {
    vm.allIndustries = Industry.get();

    vm.search.industry = _.find(vm.allIndustries, function(industry) {
      return industry.id === vm.search.industryId;
    });
  };

  var setContinents = function() {
    vm.allContinents = Continent.get();

    vm.search.continents = _.map(vm.allContinents, function(continent) {
      return {
        name: continent.name,
        selected: true,
        children: _.map(continent.regions, function(region) {
          return {
            name: region.name,
            selected: true,
            children: _.map(region.countries, function(country) {
              var selected = _.include(vm.search.countryIds, country.id);
              return {
                name: country.name,
                value: country.id,
                selected: selected
              };
            })
          };
        })
      };
    });

    ivhTreeviewMgr.validate(vm.search.continents);
  };

  var reloadSearch = function() {
    if (LocalStore.loadAuthToken()) {
      Restangular.all('users').one('searches', $stateParams.id).get().then(function(result) {

        vm.search = result.search;
        vm.search.neverEnd = vm.search.endDate === null;

        SearchPurpose.reload();
        Industry.reload();
        Continent.reload();
        SearchSource.reload();
      }, function(result) {

        $log.warn("error reloading search", result);

        vm.search = null;
      });
    } else {
      vm.search = null;
    }
  };

  var redirectToSearchesIndex = function() {
    $state.transitionTo('users.searches');
  };

  reloadSearch();

  $scope.$on(SERVICE_EVENTS.searchPurposesUpdated, setSearchPurposes);
  $scope.$on(SERVICE_EVENTS.industriesUpdated, setIndustries);
  $scope.$on(SERVICE_EVENTS.continentsUpdated, setContinents);
  $scope.$on(SERVICE_EVENTS.reloadAfterChangeLanguage, reloadSearch);

  $scope.$on(SERVICE_EVENTS.searchSourcesUpdated, setSearchSources);
  $scope.$on(SERVICE_EVENTS.searchSourcesUpdated, setDate);
  $scope.$on(SERVICE_EVENTS.searchUpdated, redirectToSearchesIndex);

}

module.exports = UsersSearchesShowCtrl;
