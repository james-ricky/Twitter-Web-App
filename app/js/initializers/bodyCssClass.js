'use strict';

/**
 * @ngInject
 */
function BodyCssClass($rootScope) {

  // change body class based on state
  $rootScope.$on('$stateChangeSuccess', function(ev, data) {
    $rootScope.controllerName = data.controller;
  })

}

module.exports = BodyCssClass;
