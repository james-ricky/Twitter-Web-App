'use strict';

/**
 * @ngInject
 */
function Search($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  self.searches = [];

  self.set = function (searches) {
    $log.debug("set searches", searches);

    self.searches = searches;

    $rootScope.$broadcast(SERVICE_EVENTS.searchesUpdated, searches);
  };

  var filterSelected = function(object) {
    return _.reduce(object, function(result, value, key) {
      if (value) {
        result[key] = value;
      }
      return result;
    }, {});
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

  var formatParams = function(params) {
    var keywordGroups = _.map(params.keywordGroups, function(keywordGroup) {
      return {
        language: keywordGroup.language,
        containsAll: _.map(keywordGroup.containsAll, function(containsAll) {
          return containsAll.text;
        }),
        containsAny: _.map(keywordGroup.containsAny, function(containsAny) {
          return containsAny.text;
        }),
        notContainsAll: _.map(keywordGroup.notContainsAll, function(notContainsAll) {
          return notContainsAll.text;
        }),
        notContainsAny: _.map(keywordGroup.notContainsAny, function(notContainsAny) {
          return notContainsAny.text;
        }),
      }
    });

    var selectedSources = filterSelected(params.searchSources);
    var sourceIds = _.map(selectedSources, function(selected, id, third) {
      return id;
    });

    var countryIds = filterSelectedCountries(params.continents);

    var endDate = params.neverEnd ? null : params.endDate;
    var startDate = params.startNow ? null : params.startDate;

    return {
      allSources: params.allSources,
      sourceIds: sourceIds,
      endDate: endDate,
      keywordGroups: keywordGroups,
      name: params.name,
      searchPurposeId: params.searchPurpose.id,
      industryId: params.industry.id,
      countryIds: countryIds,
      startDate: startDate
    };
  };

  service.get = function () {
    return self.searches;
  };

  service.reload = function () {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('searches').getList().then(function (result) {

        $log.debug("reloaded searches", result);

        self.set(result);

        return result;

      }, function(result) {

        $log.warn("error reloading searches", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.create = function (params) {
    var data = formatParams(params);

    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').all('searches').post(data).then(function (result) {

        $log.debug("create search", result);

        $rootScope.$broadcast(SERVICE_EVENTS.searchCreated, result);

        return result;

      }, function(result) {

        $log.warn("error creating search", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.update = function (params) {
    var data = formatParams(params);

    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('searches', params.id).customPUT(data).then(function (result) {

        $log.debug("update search", result);

        $rootScope.$broadcast(SERVICE_EVENTS.searchUpdated, result);

        return result;

      }, function(result) {

        $log.warn("error updating search", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  service.delete = function (search) {
    if (LocalStore.loadAuthToken()) {
      return Restangular.all('users').one('searches', search.id).remove().then(function (result) {

        $log.debug("delete search", result);

        $rootScope.$broadcast(SERVICE_EVENTS.searchDeleted, search.id);

        return result;

      }, function(result) {

        $log.warn("error deleting search", result);

        return $q.reject(result);

      });
    } else {

      self.set(null);

      return $q.reject();
    }
  };

  return service;

}

module.exports = Search;
