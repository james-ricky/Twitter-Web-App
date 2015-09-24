'use strict';

/**
 * @ngInject
 */
function NewWidgetModalCtrl($rootScope, $scope, $modalInstance, $timeout, Search, Continent, SERVICE_EVENTS, searches, SearchSource, addWidgetCallback, $translate) {
  var vm = this;
  vm.status = "new";
  vm.allSearches = searches;
  vm.allSearcheSources = [];
  vm.allCountries = [];
  vm.widgetSettings = [
    {
      name: $translate.instant('users.dashboards.field.volume'),
      widgetType: "volume",
      chartType: "timeSeries",
      granularity: "daily",
      filterType: "",
      filterOptions: {},
      continents: [],
      languages: {}
    },
    {
      name: $translate.instant('users.dashboards.field.sentiment'),
      widgetType: "sentiment",
      chartType: "doughnut",
      filterType: "",
      filterOptions: {},
      continents: [],
      languages: {}
    },
    {
      name: $translate.instant('users.dashboards.field.source'),
      widgetType: "source",
      chartType: "vbar",
      filterType: "",
      filterOptions: {},
      continents: [],
      languages: {}
    },
    {
      name: $translate.instant('users.dashboards.field.map'),
      widgetType: "map",
      chartType: "map",
      filterType: "",
      filterOptions: {},
      continents: [],
      languages: {}
    },{
      name: $translate.instant('users.dashboards.field.language'),
      widgetType: "language",
      chartType: "hbar",
      filterType: "",
      filterOptions: {},
      continents: [],
      languages: {}
    },
    {
      name: $translate.instant('users.dashboards.field.gender'),
      widgetType: "gender",
      chartType: "doughnut",
      filterType: "",
      filterOptions: {},
      continents: [],
      languages: {}
    },
    {
      name: $translate.instant('users.dashboards.field.conversation'),
      widgetType: "conversation",
      chartType: "feed",
      filterType: "",
      filterOptions: {},
      continents: [],
      languages: {}
    },
    {
      name: $translate.instant('users.dashboards.field.influence'),
      widgetType: "influence",
      chartType: "feed",
      filterType: "",
      filterOptions: {},
      continents: [],
      languages: {}
    }
  ];

  var setSearchSources = function() {
    var allSourceIds = [];
    var temp = [];
    var allSearchSources = SearchSource.get();
    var selectedSearch = vm.allSearches;
    _.each(selectedSearch, function(search) {
      allSourceIds += search.sourceIds;
    });

    _.each(allSearchSources, function(searchSource) {
      if (allSourceIds.includes(searchSource.id)) {
        temp.push(searchSource);
      }
    });

    vm.allSearchSources = temp;
  };

  var setContinents = function() {
    vm.allContinents = Continent.get();
    vm.widgetSettings.forEach(function(widget) {
      widget.continents = continentOptions();
    });
  };

  var continentOptions = function() {
    return _.map(vm.allContinents, function(continent) {
      return {
        name: continent.name,
        selected: false,
        children: _.map(continent.regions, function(region) {
          return {
            name: region.name,
            selected: false,
            children: _.map(region.countries, function(country) {
              return {
                name: country.name,
                value: country.id,
                selected: false
              }
            })
          };
        })
      };
    });
  };

  var filterSelectedCountries = function(continents) {
    var selectedCountryIds = [];

    _.each(continents, function(continent) {
      _.each(continent.children, function(region) {
        _.each(region.children, function(country) {
          if (country.selected === true) {
            selectedCountryIds.push(country.value);
          }
        });
      });
    });

    return selectedCountryIds;
  };

  var filterSelected = function(object) {
    var selectedValues = _.reduce(object, function(result, value, key) {
      if (value) {
        result[key] = value;
      }
      return result;
    }, {});

    return _.map(selectedValues, function(selected, id) {
      return id;
    });
  };

  vm.addWidget = function(widgetSetting) {
    switch (widgetSetting.filterType) {
      case 'location':
        widgetSetting.filterOptions.countryIds = filterSelectedCountries(widgetSetting.continents);
        break;
      case 'language':
        widgetSetting.filterOptions.languages = filterSelected(widgetSetting.languages);
        break;
      case 'source':
        widgetSetting.filterOptions.sourceIds = filterSelected(widgetSetting.searchSources);
        break;
      case 'sentiment':
        widgetSetting.filterOptions.sentiments = filterSelected(widgetSetting.sentiments);
        break;
      case 'gender':
        widgetSetting.filterOptions.genders = filterSelected(widgetSetting.genders);
        break;
    }

    addWidgetCallback(widgetSetting);

    $modalInstance.dismiss('added');
  };

  vm.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $modalInstance.opened.then(function() {
  });

  SearchSource.reload();
  Continent.reload();

  $scope.$on(SERVICE_EVENTS.continentsUpdated, setContinents);
  $scope.$on(SERVICE_EVENTS.searchSourcesUpdated, setSearchSources);
}

module.exports = NewWidgetModalCtrl;
