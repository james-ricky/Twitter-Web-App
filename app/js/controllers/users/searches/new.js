'use strict';

/**
* @ngInject
*/
function UsersSearchesNewCtrl($rootScope, $scope, $state, $filter, Search, SearchSource, SearchPurpose, Industry, Continent, SERVICE_EVENTS) {
  var vm = this;
  var today = $filter('date')(new Date(), 'yyyy-MM-dd')
  // var availableLanguages = ["en", "zh-TW"];
  var defaultLanguageValue = "en";

  vm.search = {
    allSources: true,
    minDate: new Date(),
    startDate: today,
    startDateOpened: false,
    startNow: true,
    endDate: today,
    endDateOpened: false,
    neverEnd: true,
    continents: {},
    searchSources: {},
    keywordGroups: [
      {
        language: defaultLanguageValue
      }
    ]
  };

  vm.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  vm.allSearchSources = [];
  vm.allSearchPurposes = [];
  vm.allIndustries = [];
  vm.allContinents = [];

  var reloadNewSearch = function () {
      SearchPurpose.reload();
      Industry.reload();
      Continent.reload();
      SearchSource.reload();
  };

  var setSearchSources = function() {
    vm.allSearchSources = SearchSource.get();

    _.each(vm.allSearchSources, function(searchSource) {
      vm.search.searchSources[searchSource.id] = true;
    });
  };

  var setSearchPurposes = function() {
    vm.allSearchPurposes = SearchPurpose.get();
  };

  var setIndustries = function() {
    vm.allIndustries = Industry.get();
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
              return {
                name: country.name,
                value: country.id,
                selected: true
              }
            })
          };
        })
      };
    });
  };

  // var containsChineseCharacters = function(args) {
  //   var keywordGroup = args[0];
  //   var event = args[1];
  //   if (keywordGroup.language != 'zh-TW') {
  //     if (event.target.value != '' && containsChineseCharactersInString(event.target.value)) {
  //       keywordGroup.language = "zh-TW";
  //     }
  //   }
  // };
  //
  // var containsChineseCharactersInString = function(str) {
  //   var re1 = new RegExp("[\u4E00-\uFA29]+");
  //   var re2 = new RegExp("[\uE7C7-\uE7F3]+");
  //
  //   str = str.replace(/(^\s*)|(\s*$)/g,'');
  //   return re1.test(str) || re2.test(str);
  // };

  var redirectToSearchesIndex = function() {
    $state.transitionTo('users.searches');
  };

  vm.toggleOpenStartDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    vm.search.startDateOpened = !vm.search.startDateOpened;
  };

  vm.toggleOpenEndDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    vm.search.endDateOpened = !vm.search.endDateOpened;
  };

  vm.selectedAtLeastOneContinent = function () {
    return Object.keys(vm.search.continents).some(function (key) {
      return vm.search.continents[key];
    });
  };

  vm.addKeywordGroup = function() {
    vm.search.keywordGroups.push({
      language: defaultLanguageValue
    });
  };

  vm.deleteKeywordGroup = function(index) {
    vm.search.keywordGroups.splice(index, 1);
  };

  vm.createSearch = function() {
    Search.create(vm.search);
  };

  // vm.detectChineseCharacter = function(keywordGroup) {
  //   if (containsChineseCharacters(keywordGroup)) {
  //     keywordGroup.language = availableLanguages[1];
  //   }
  // };

  SearchPurpose.reload();
  Industry.reload();
  Continent.reload();
  SearchSource.reload();

  $scope.$on(SERVICE_EVENTS.searchPurposesUpdated, setSearchPurposes);
  $scope.$on(SERVICE_EVENTS.industriesUpdated, setIndustries);
  $scope.$on(SERVICE_EVENTS.continentsUpdated, setContinents);
  $scope.$on(SERVICE_EVENTS.reloadAfterChangeLanguage, reloadNewSearch);

  $scope.$on(SERVICE_EVENTS.searchSourcesUpdated, setSearchSources);
  $scope.$on(SERVICE_EVENTS.searchCreated, redirectToSearchesIndex);
}

module.exports = UsersSearchesNewCtrl;
