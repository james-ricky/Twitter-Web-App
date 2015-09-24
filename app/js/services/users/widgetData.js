'use strict';

/**
 * @ngInject
 */
function WidgetData($log, $q, $rootScope, Restangular, LocalStore, SERVICE_EVENTS, AUTH_EVENTS) {

  var service = {};
  var self = this;

  service.loadData = function(widget, dashboardId, startDate, endDate) {
    var data = {
      dashboardId: dashboardId,
      widgetType: widget.setting.widgetType,
      chartType: widget.setting.chartType,
      granularity: widget.setting.granularity,
      feedCount: widget.setting.feedCount,
      offset: widget.setting.offset,
      startDate: startDate,
      endDate: endDate,
      filterOptions: widget.setting.filterOptions
    };

    return Restangular.all('users').one('widget_data').withHttpConfig({timeout: 30000}).get(data);
  };

  return service;

}

module.exports = WidgetData;
