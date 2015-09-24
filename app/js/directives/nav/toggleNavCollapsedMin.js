'use strict';

/**
 * @ngInject
 */
function ToggleNavCollapsedMin($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, ele, attrs) {
      var app;
      app = $('.app');
      return ele.on('click', function(e) {
        if (app.hasClass('nav-collapsed-min')) {
          app.removeClass('nav-collapsed-min');
        } else {
          app.addClass('nav-collapsed-min');
          $rootScope.$broadcast('nav:reset');
        }
        return e.preventDefault();
      });
    }
  };
}

module.exports = ToggleNavCollapsedMin;
