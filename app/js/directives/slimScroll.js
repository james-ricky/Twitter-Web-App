'use strict';

/**
 * @ngInject
 */
function SlimScroll() {
  return {
    restrict: 'A',
    scope: {
      scrollData: "="
    },
    link: function(scope, ele, attrs) {
      scope.$watchCollection('scrollData', function(newCollection, oldCollection) {
        if (oldCollection && oldCollection.length > 0 && newCollection.length > oldCollection.length) {
          var target = $(ele.children('div:nth-child(1)')[0]);
          var scrollTo = target.height() * (oldCollection.length - 1);
          ele.slimScroll({scrollTo: scrollTo, animate: true});
        }
      });

      return ele.slimScroll({
        height: attrs.scrollHeight || '100%',
        alwaysVisible: attrs.scrollAll
      });
    }
  };
}

module.exports = SlimScroll;
