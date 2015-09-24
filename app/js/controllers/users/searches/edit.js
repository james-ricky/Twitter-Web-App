'use strict';

/**
 * @ngInject
 */
function UsersSearchesEditCtrl($rootScope, $scope, $state, $stateParams, $filter, ivhTreeviewMgr, Search, SearchSource, SearchPurpose, Industry, Continent, Restangular, LocalStore, SERVICE_EVENTS) {
  var vm = this;
  var today = $filter('date')(new Date(), 'yyyy-MM-dd')
  // var availableLanguages = ["en-US", "zh-TW"];
  var defaultLanguageValue = "en"

  vm.search = {
    minDate: new Date(),
    startNow: false,
    startDateOpened: false,
    endDateOpened: false,
    continents: []
  };

  vm.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  vm.allSearchSources = [];
  vm.allSearchPurposes = [];
  vm.allIndustries = [];
  vm.allContinents = [];


  var setSearchSources = function() {
    vm.allSearchSources = SearchSource.get();

    var tempSources = {};
    _.each(vm.search.sourceIds, function(searchSourceId) {
      tempSources[searchSourceId] = true;
    });
    vm.search.searchSources = tempSources;
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

  vm.updateSearch = function() {
    Search.update(vm.search);
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

  vm.detectChineseCharacter = function(keywordGroup) {
    // if (containsChineseCharacters(keywordGroup)) {
    //   keywordGroup.language = availableLanguages[1];
    // }
  };

  reloadSearch();

  $scope.$on(SERVICE_EVENTS.searchPurposesUpdated, setSearchPurposes);
  $scope.$on(SERVICE_EVENTS.industriesUpdated, setIndustries);
  $scope.$on(SERVICE_EVENTS.continentsUpdated, setContinents);
  $scope.$on(SERVICE_EVENTS.reloadAfterChangeLanguage, reloadSearch);

  $scope.$on(SERVICE_EVENTS.searchSourcesUpdated, setSearchSources);
  $scope.$on(SERVICE_EVENTS.searchUpdated, redirectToSearchesIndex);
}

module.exports = UsersSearchesEditCtrl;
