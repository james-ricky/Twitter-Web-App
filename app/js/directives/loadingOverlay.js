'use strict';

/**
 * @ngInject
 */
function LoadingOverlay($http, $translate, $filter) {
  var translatedLoading = "";
  return {
    restrict: 'A',
    link: function (scope) {
      scope.isLoading = function() {
        return $http.pendingRequests.length > 0;
      };

      scope.nowLoadingNoty = null;

      scope.$watch(scope.isLoading, function(v) {
        if (v) {
          if (scope.nowLoadingNoty === null) {
            scope.nowLoadingNoty = noty({
              text: $translate.instant('public.loading.field.loading'),
              type: 'success',
              layout: 'topCenter',
              theme: 'bootstrapTheme'
            });
          }
        } else {
          if (scope.nowLoadingNoty !== null) {
            scope.nowLoadingNoty.close();
            scope.nowLoadingNoty = null;
          }
        }
      });
    }
  };
}

module.exports = LoadingOverlay;
