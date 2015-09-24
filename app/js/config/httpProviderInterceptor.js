'use strict';

/**
 * @ngInject
 */
function HttpProviderInterceptor($httpProvider) {
  $httpProvider.interceptors.push([
    "$injector",
    function ($injector) {
      return $injector.get("AuthInterceptor");
    }
  ]);
}

module.exports = HttpProviderInterceptor;
