'use strict';

/**
 * @ngInject
 */
function OnRun($rootScope, APP_CONFIG) {

  // change page title based on state
  $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    $rootScope.pageTitle = '';

    // if ( toState.title ) {
    //   $rootScope.pageTitle += toState.title;
    //   $rootScope.pageTitle += ' \u2014 ';
    // }

    $rootScope.pageTitle += APP_CONFIG.appTitle;
  });

}

module.exports = OnRun;
