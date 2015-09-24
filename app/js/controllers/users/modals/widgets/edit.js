'use strict';

/**
 * @ngInject
 */
function EditWidgetModalCtrl($rootScope, $scope, $modalInstance, $timeout, updateWidgetCallback, widget, searches, SearchSource, Continent, SERVICE_EVENTS, $translate) {
  var vm = this;
  vm.status = "edit";
  vm.widget = widget;
  vm.widget.setting.name = $translate.instant('users.dashboards.field.' + widget.setting.widgetType);
  vm.allSearches = searches;
  vm.allSearcheSources = [];
  vm.allCountries = [];

  console.log('editing widget', widget);

  var setAvailableChartTypes = function() {
    console.log(vm.widget.setting.widgetType);

    switch (vm.widget.setting.widgetType) {
      case 'sentiment':
        vm.availableChartTypes = ["doughnut", "vbar", "hbar"];
        break;
      case 'source':
        vm.availableChartTypes = ["vbar", "hbar"];
        break;
      case 'map':
        vm.availableChartTypes = ["map", "vbar", "hbar"];
        break;
      case 'language':
        vm.availableChartTypes = ["hbar","vbar", "doughnut"];
        break;
      case 'gender':
        vm.availableChartTypes = ["doughnut", "vbar", "hbar"];
        break;
    }


  };


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
              };
            })
          };
        })
      };
    });
  };

  var setContinents = function() {
    vm.allContinents = Continent.get();
    if (vm.widget.setting.continents === undefined) {
      vm.widget.setting.continents = [];
    }
    vm.widget.setting.continents = continentOptions();
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

  vm.updateWidget = function() {
    var widgetSetting = vm.widget.setting;
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

    updateWidgetCallback(vm.widget);
    $modalInstance.dismiss('edited');
  };


  vm.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $modalInstance.opened.then(function() {
  });

  SearchSource.reload();
  Continent.reload();
  setAvailableChartTypes();

  $scope.$on(SERVICE_EVENTS.continentsUpdated, setContinents);
  $scope.$on(SERVICE_EVENTS.searchSourcesUpdated, setSearchSources);
}

module.exports = EditWidgetModalCtrl;
