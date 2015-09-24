'use strict';

/**
 * @ngInject
 */
function RestangularConfig(Restangular, APP_CONFIG, LocalStore, $rootScope) {
  Restangular.setBaseUrl(APP_CONFIG.apiUrl);

  // Restangular.setRequestSuffix('.json');

  Restangular.setDefaultHeaders({
    "Accept": "application/vnd.lamplight-users-v1+json",
    "Accept-Language": LocalStore.loadPreferredLocale()
  });

  Restangular.setDefaultHttpFields({
    timeout: 10000
  });

  Restangular.setResponseExtractor(function(response, operation) {

    var newResponse = response;
    //getList expect to get an array
    if (operation === 'getList') {
      delete newResponse.restangularEtag;
      newResponse = []
      angular.forEach(response, function(value, key) {
        if (key !== 'restangularEtag') newResponse.push(value)
      });
      return [].concat.apply([], newResponse)
    }

    if (angular.isArray(response)) {
      angular.forEach(newResponse, function(value, key) {
        newResponse[key].originalElement = angular.copy(value);
      });
    } else {
      if (response) {
        newResponse.originalElement = angular.copy(response);
      }
    }
    return newResponse;
  });

  Restangular.setFullRequestInterceptor(function(element, operation, route, url, headers, params) {
    var extraParams = {};
    var newHeaders = headers;

    var authToken = LocalStore.loadAuthToken();
    if (authToken) {
      newHeaders = _.extend(headers, {Authorization: 'Token token="' + authToken + '"'})
    }
    
    var currentLocale = LocalStore.loadPreferredLocale();
    if (currentLocale) {
      newHeaders = _.extend(headers, {"Accept-Language": currentLocale});
    }

    return {
      element: element,
      params: _.extend(params, extraParams),
      headers: newHeaders
    };
  });
}

module.exports = RestangularConfig;
