'use strict';

/**
 * @ngInject
 */
function WidgetFilter() {
  return {
    restrict: 'E',
    templateUrl: "users/modals/widgets/widget_filter.html",
    scope: {
      widgetSetting: '=',
      widgetModal: '='
    }
  };
}


module.exports = WidgetFilter;
