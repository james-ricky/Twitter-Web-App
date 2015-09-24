'use strict';

/**
 * @ngInject
 */
function ToggleOffCanvas() {
  return {
    restrict: 'A',
    link: function(scope, ele, attrs) {
      return ele.on('click', function() {
        return $('#app').toggleClass('on-canvas');
      });
    }
  };
}

module.exports = ToggleOffCanvas;
