'use strict';

/**
 * @ngInject
 */
function FlotWidget($rootScope,$window, $timeout, SERVICE_EVENTS) {
  return {
    restrict: 'EA',
    template: '<div></div>',
    scope: {
      dataset: '=',
      options: '=',
      callback: '=',
      setting: '='
    },
    link: function(scope, element, attributes) {
      var height, init, onDatasetChanged, onOptionsChanged, onReset, plot, plotArea, width, _ref, _ref1;
      plot = null;
      width = attributes.width || '100%';
      height = attributes.height || '100%';
      if (((_ref = scope.options) != null ? (_ref1 = _ref.legend) != null ? _ref1.container : void 0 : void 0) instanceof jQuery) {
        throw 'Please use a jQuery expression string with the "legend.container" option.';
      }
      if (!scope.dataset) {
        scope.dataset = [];
      }
      if (!scope.options) {
        scope.options = {
          legend: {
            show: false
          }
        };
      }

      var w = angular.element($window);

      scope.getWindowDimensions = function () {
          return {
              'h': w.height(),
              'w': w.width()
          };
      };
      scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
          scope.windowHeight = newValue.h;
          scope.windowWidth = newValue.w;

          if(newValue.w !== oldValue.w) {
            onReset();
          };
      }, true);

      w.bind('resize', function () {
          scope.$apply();
      });

      plotArea = $(element.children()[0]);
      plotArea.css({
        width: width,
        height: height
      });
      init = function() {
        var plotObj = $.plot(plotArea, scope.dataset, scope.options);
        if (scope.callback) {
          scope.callback(plotObj);
        }
        return plotObj;
      };
      onDatasetChanged = function(dataset) {
        if (plot) {
          plot.setData(dataset);
          plot.setupGrid();
          plot.draw();
        } else {
          plot = init();
        }
      };
      scope.$watch('dataset', onDatasetChanged, true);

      onOptionsChanged = function() {
        plot = init();
      };
      scope.$watch('options', onOptionsChanged, true);

      onReset = function() {
        $timeout(function() {
          var placeholder = plot.getPlaceholder();

          // somebody might have hidden us and we can't plot
          // when we don't have the dimensions
          if (placeholder.width() == 0 || placeholder.height() == 0)
              return;

          plot.resize();
          plot.setupGrid();
          plot.draw();

          $rootScope.$broadcast(SERVICE_EVENTS.dashboardWidgetSizeChanged);
        }, 100);
      };
      scope.$watch('setting', onReset, true);

    }
  };
}

module.exports = FlotWidget;
