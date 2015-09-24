'use strict';

/**
 * @ngInject
 */
function UsersDashboardsShowCtrl($scope, $rootScope, $state, $stateParams, $filter, $log, $timeout, $translate, Dashboard, WidgetData, Restangular, LocalStore, SweetAlert, ModalWithBlurBackground, SERVICE_EVENTS) {
  var vm = this;
  var resizeFlag = false;
  var color = {
    primary: '#5B90BF',
    success: '#A3BE8C',
    info: '#7FABD2',
    infoAlt: '#B48EAD',
    warning: '#EBCB8B',
    danger: '#BF616A',
    gray: '#DCDCDC',
    positive: '#59B559',
    negative: '#C53939',
    neutral: '#AAAAAA'
  };

  vm.startDateOpened = false;

  vm.dashboard = {
    liveData: true
  };

  vm.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  vm.sortableOptions = {
    'ui-floating': true,
    handle: '> .myHandle',
    update: function(e, ui) {},
    stop: function(e, ui) {
      saveWidgetSettings();
    }
  };

  vm.toggleOpenStartDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    vm.startDateOpened = !vm.startDateOpened;
  };

  vm.availableSizeOptions = [12, 6, 4];

  vm.setResizeFlag = function() {
    resizeFlag = true;
    $rootScope.$broadcast('resizeMsg');
    $rootScope.$broadcast(SERVICE_EVENTS.dashboardWidgetSizeChanged);
    saveWidgetSettings();
  };

  vm.showDeleteWidgetConfirmationMessage = function(widgetIndex) {
    $scope.usersBase.showDeleteConfirmationMessage(function() {
      vm.widgets.splice(widgetIndex, 1);
      saveWidgetSettings();
    });
  };

  vm.showAddWidgetModal = function() {
    ModalWithBlurBackground.open({
      templateUrl: "users/modals/widgets/new.html",
      controller: "NewWidgetModalCtrl as newWidgetModal",
      size: "lg",
      scope: $scope,
      resolve: {
        addWidgetCallback: function() {
          return function(widget) {
            var newWidget = {
              setting: {
                widgetType: widget.widgetType,
                chartType: widget.chartType,
                granularity: widget.granularity,
                filterType: widget.filterType,
                filterOptions: widget.filterOptions,
                cols: 12
              },
              chartData: [],
              chartOptions: {}
            };

            vm.widgets.push(newWidget);

            saveWidgetSettings();

            reloadData(_.last(vm.widgets));
          };
        },
        searches: function() {
          return vm.dashboard.searches;
        }
      }
    });
  };

  vm.isEditableWidget = function(widget) {
    switch (widget.setting.filterType) {
      case "":
        return false;
      default:
        return true;
    }
    return false;
  };

  vm.showEditWidgetModal = function(widget) {
    ModalWithBlurBackground.open({
      templateUrl: "users/modals/widgets/edit.html",
      controller: "EditWidgetModalCtrl as editWidgetModal",
      size: "lg",
      scope: $scope,
      resolve: {
        updateWidgetCallback: function() {
          return function(widget) {

            saveWidgetSettings();

            reloadData(widget);
          };
        },
        widget: function() {
          return widget;
        },
        searches: function() {
          return vm.dashboard.searches;
        }
      }
    });
  };

  vm.exportToPDF = function() {
    // var doc = new jsPDF('p', 'pt', [docWidth, docHeight]);

    var y = 0;

    _.forEach(vm.widgets, function(widget, index) {
      var widgetClassName = ".widget-" + index;
      // var widgetClassName = "."  + "widget-0";
      // var widget = vm.widgets[0];

      if (widget.setting.chartType !== 'feed') {

          // var cssSelector = widgetClassName + " " + "svg";
          // var svg = document.querySelector(cssSelector);
          // if (svg !== undefined) {
          //   svgAsDataUri(svg, {}, function(uri) {
          //     var image = document.createElement('img');
          //     image.src = uri;
          //     image.onload = functwion() {
          //       var canvas = document.createElement('canvas');
          //       var context = canvas.getContext('2d');
          //       var dataUrl;
          //
          //       canvas.width = image.width;
          //       canvas.height = image.height;
          //       context.drawImage(image, 0, 0, image.width, image.height);
          //       dataUrl = canvas.toDataURL('image/jpeg');
          //       // doc.addImage(dataUrl, 'JPEG', 0, 0, image.width, image.height);
          //       // doc.save();
          //       console.log(dataUrl);
          //     };
          //   });
          // }

          // var chart_div = document.getElementById("chart-div-" + index);
          var chart_div = document.createElement('div');
          chart_div.setAttribute("style", "height:300px; width: 4000px;");
          var chart;
          switch (widget.chart.type) {
            case "LineChart":
              chart = new google.visualization.LineChart(chart_div);
              break;
            case "BarChart":
              chart = new google.visualization.BarChart(chart_div);
              break;
            case "ColumnChart":
              chart = new google.visualization.ColumnChart(chart_div);
              break;
            case "PieChart":
              chart = new google.visualization.PieChart(chart_div);
              break;

          }

          google.visualization.events.addListener(chart, 'ready', function() {
            console.log(chart.getImageURI());
          });

          var data = widget.chart.data;
          var options = $.extend(true, {}, widget.chart.options);
          chart.draw(data, options);
          debugger;
      }
    });
  };

  vm.availableGranularityOptions = ['hourly', 'daily', 'weekly', 'monthly'];

  vm.setGranularity = function(widget) {
    saveWidgetSettings();
    reloadData(widget);
  };

  vm.availableFeedCountOptions = [10, 20, 30, 40];

  vm.setFeedCount = function(widget) {
    saveWidgetSettings();
    reloadData(widget);
  };

  var saveWidgetSettings = function() {
    var widgetSettings = _.map(vm.widgets, function(widget) {
      return widget.setting;
    });
    Dashboard.updateWidgetSettings(vm.dashboard.id, widgetSettings);
  };

  var afterResize = function() {
    if (resizeFlag) {
      saveWidgetSettings();
    }
  };

  var getSentimentValue = function(key, result) {
    var sentimentObject = _.find(result, function(point) {
      return point._id === key;
    });
    return sentimentObject ? sentimentObject.num : 0;
  };

  var reloadDashboard = function() {
    if (LocalStore.loadAuthToken()) {
      Restangular.all('users').one('dashboards', $stateParams.id).get().then(function(result) {
        vm.dashboard = result.dashboard;

        var earliestSearchStartDate = _.min(_.map(vm.dashboard.searches, function(search) {
          return new Date(search.startDate);
        }));

        vm.dashboard.earliestSearchStartDate = moment(earliestSearchStartDate).startOf('day').toDate();
        vm.dashboard.startDate = moment(earliestSearchStartDate).format('YYYY-MM-DD');
        vm.dashboard.liveData = true;
        vm.dashboard.endDate = moment().endOf('day').format('YYYY-MM-DD');

        vm.widgets = _.map(vm.dashboard.widgetSettings, function(widgetSetting) {
          var granularity = null;
          if (widgetSetting.chartType === 'timeSeries') {
            if (widgetSetting.granularity) {
              granularity = widgetSetting.granularity;
            } else {
              granularity = 'daily';
            }
          }
          return {
            setting: {
              cols: widgetSetting.cols,
              widgetType: widgetSetting.widgetType,
              filterType: widgetSetting.filterType,
              chartType: widgetSetting.chartType,
              granularity: granularity,
              filterOptions: widgetSetting.filterOptions,
              showWidgetOption: !_.isEmpty(widgetSetting.filterOptions)
            },
            chartData: [],
            chartOptions: {},
            loading: true,
            noDataAvailable: true
          };
        });


        console.log(vm.widgets);
        regularlyPollingWidgetData();

        $scope.$watch(function() {
          return vm.dashboard.startDate;
        }, startDateChanged);

        $scope.$watch(function() {
          return vm.dashboard.liveData;
        }, endDateChanged);

        $scope.$watch(function() {
          return vm.dashboard.endDate;
        }, endDateChanged);

      }, function(result) {

        $log.warn("error reloading dashboard", result);

        vm.dashboard = null;
      });
    } else {
      vm.dashboard = null;
    }
  };

  var labelFormatter = function(label, series) {
    return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
  }

  var formatFilterTooltip = function(widget) {
    var filterContent = _.map(widget.setting.filterOptions, function(filterOptionValue, filterOptionKey) {
      if (filterOptionKey === 'genders') {
        return "<strong><u>" + $translate.instant('users.dashboards.field.' + filterOptionKey) + "</u></strong>:<br/> " + filterOptionValue.join(", ");
      } else if (filterOptionKey === 'searches') {
        var searchIds = _.keys(filterOptionValue);
        var searchNames = _.map(searchIds, function(searchId) {
          return _.find(vm.dashboard.searches, function(search) {
            return search.id === searchId;
          }).name;
        });
        return "<strong><u>" + $translate.instant('users.dashboards.field.' + filterOptionKey) + "</u></strong>:<br/> " + searchNames.join(", ");
      } else {
        return "<strong><u>" + $translate.instant('users.dashboards.field.' + filterOptionKey) + "</u></strong>:<br/> " + filterOptionValue.join(", ");
      }
    }).join('<br/>');

    return "<div class='widget-filter-options'><h4>" + $translate.instant('users.dashboards.field.filter') + ":</h4>" + filterContent + "</div>";
  };

  var setTimeSeriesChart = function(widget, result) {
    var chartStartDate = moment(vm.dashboard.startDate).startOf('day').toDate();
    var chartEndDate = moment(vm.dashboard.endDate).endOf('day').toDate();
    var chart = {};
    chart.type = "LineChart";
    chart.data = {"cols": [], "rows": []};

    switch (widget.setting.granularity) {
      case 'weekly':
        chart.data['cols'].push({id: 't', label: "Time", type: "String"});
        break;
      case 'monthly':
        chart.data['cols'].push({id: 't', label: "Time", type: "String"});
        break;
      default:
        chart.data['cols'].push({id: 'dt', label: "Time", type: "datetime"});
        break;
    }

    _.forEach(result, function(series) {
      // data.addColumn('number', series._id);
      chart.data["cols"].push({id:'s', label: series._id, type: "number"});
    });

    var allTicks = _.uniq(_.flatten(_.map(result, function(series) {
      return _.map(series.data, function(point) {
        return point.key;
      });
    })));

    allTicks.sort(function(a, b) {
      return new Date(a) - new Date(b);
    });

    _.forEach(allTicks, function(tick) {
      var row = {c: []};
      switch (widget.setting.granularity) {
        case 'weekly':
          row.c.push({v: tick});
          break;
        case 'monthly':
          row.c.push({v: tick});
          break;
        default:
          row.c.push({v: new Date(tick)});
          break;
      }

      _.forEach(result, function(series) {
        var pointCount = series.data.length;
        var i = 0;
        var found = false;
        while (!found && i < pointCount) {
          var point = series.data[i];
          if (point.key == tick) {
            found = true;
            row.c.push({v: point.num});
          }
          i += 1;
        }

        if (!found) {
          row.c.push({v: 0});
        }
      });
      chart.data["rows"].push(row)
    });

    chart.options = {
      hAxis: {
        title: 'Time',
        format: 'd/m/yy',

        viewWindow: {
          min: new Date(allTicks[0]),
          max: chartEndDate
        },
        gridlines: {
          count: -1,
          units: {
            days: {
              format: ["MMM dd"]
            },
            hours: {
              format: ["HH:mm", "ha"]
            },
          }
        },
        minorGridlines: {
          units: {
            hours: {
              format: ["hh:mm:ss a", "ha"]
            },
            minutes: {
              format: ["HH:mm a Z", ":mm"]
            }
          }
        }
      },
      vAxis: {
        gridlines: {
          count: 5
        }
      },
      chartArea: {
        left: '7.5%',
        top: '5%',
        width: '75%',
        height: '75%'
      }
    };


    widget.chart = chart;
  };

  var setVbarChart = function(widget, result) {
    var chart = {};
    chart.type = "ColumnChart";
    chart.data = {
      "cols": [{
        id: "fiter",
        label: "FiterType",
        type: "string"
      }, ],
      "rows": []
    };

    chart.options = {
      displayExactValues: true,
      legend: {
        position: 'right',
        textStyle: {
          color: 'black',
          fontSize: 10
        },
        alignment: 'center'
      },
      vAxis: {
        gridlines: {
          count: 8
        }
      },

      chartArea: {
        left: '5%',
        top: '5%',
        width: '80%',
        height: '80%'
      }
    };

    _.forEach(result, function(series) {
      var col = {
        id: series._id + "-id",
        label: series._id,
        type: 'number'
      };
      chart.data.cols.push(col);
    });

    var allTicks = _.uniq(_.flatten(_.map(result, function(series) {
      return _.map(series.data, function(point) {
        return point.key;
      });
    })));


    _.forEach(allTicks, function(tick) {
      var row = {
        c: [{
          v: tick
        }]
      };

      chart.data.rows.push(row);
    });

    _.forEach(result, function(series) {
      _.forEach(series.data, function(point) {
        _.forEach(chart.data.rows, function(row) {
          var rowLabelKey = row.c[0].v;
          if (point.key === rowLabelKey) {
            var v = {
              v: point.num
            };
            row.c.push(v);
          }
        });
      });
    });

    widget.chart = chart;
  };

  var setHbarChart = function(widget, result) {
    var chart = {};
    chart.type = "BarChart";

    chart.data = {
      "cols": [{
        id: "fiter",
        label: "FiterType",
        type: "string"
      }, ],
      "rows": []
    };

    chart.options = {
      displayExactValues: true,
      legend: {
        position: 'right',
        textStyle: {
          color: 'black',
          fontSize: 10
        },
        alignment: 'center'
      },
      vAxis: {
        gridlines: {
          count: 8
        }
      },
      chartArea: {
        left: '7.5%',
        top: 0,
        width: '75%',
        height: '90%'
      }
    };

    var allTicks = _.uniq(_.flatten(_.map(result, function(series) {
      return _.map(series.data, function(point) {
        return point.key;
      });
    })));

    _.forEach(result, function(series) {
      var col = {
        id: series._id + "-id",
        label: series._id,
        type: 'number'
      };
      chart.data.cols.push(col);
    });

    _.forEach(allTicks, function(tick) {
      var row = {
        c: [{
          v: tick
        }]
      };

      chart.data.rows.push(row);
    });

    _.forEach(result, function(series) {
      _.forEach(series.data, function(point) {
        _.forEach(chart.data.rows, function(row) {
          var rowLabelKey = row.c[0].v;
          if (point.key === rowLabelKey) {
            var v = {
              v: point.num
            };
            row.c.push(v);
          }
        });
      });
    });

    widget.chart = chart;
  };

  var setDoughnutChart = function(widget, result) {
    var chart = {};
    chart.type = "PieChart";
    chart.options = {
      displayExactValues: true,
      pieHole: 0.35,
      chartArea: {
        left: '27.5%',
        top: 0,
        width: '100%',
        height: '100%'
      },
      tooltip: {
        showColorCode: true,
        text: 'both',
        trigger: 'focus'
      }
    };

    if (widget.setting.widgetType === 'sentiment') {
      var positiveSentiment = getSentimentValue('positive', result);
      var negativeSentiment = getSentimentValue('negative', result);
      var neutralSentiment = getSentimentValue('neutral', result);
      var total = positiveSentiment + negativeSentiment + neutralSentiment;

      widget.metaData = {};
      widget.metaData.netSentiment = Math.round(100 * (positiveSentiment - negativeSentiment) / total);
      if (widget.metaData.netSentiment > 0) {
        widget.metaData.netSentimentLabel = '+' + widget.metaData.netSentiment;
      } else if (widget.metaData.netSentiment < 0) {
        widget.metaData.netSentimentLabel = widget.metaData.netSentiment;
      } else {
        widget.metaData.netSentimentLabel = '0';
      }

      chart.options.slices = {
          0: {
            color: color.positive
          },
          1: {
            color: color.negative
          },
          2: {
            color: color.neutral
          }
      };
      chart.data = [
        ['Sentiment', 'Value'],
        ['postive', positiveSentiment],
        ['negative', negativeSentiment],
        ['neutral', neutralSentiment]
      ];

    } else {
      chart.data = [
        [widget.setting.chartType, 'Value']
      ];

      _.forEach(result, function(point) {
        chart.data.push([point._id, point.num]);
      });
    }

    chart.formatters = {};
    widget.chart = chart;
  };

  var setMapChart = function(widget, result) {
    var chart = {};
    chart.type = "GeoChart";



    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Lat');
    data.addColumn('number', 'Long');
    data.addColumn('number', 'Sentiment');
    var maxSentimentValue = 0;
    var minSentimentValue = 0;

    var groupedLocationData = _.groupBy(result, function(point) {
      return Math.floor(point.geo[0] * 10) / 10 + "," + Math.floor(point.geo[1] * 10) / 10;
    });

    var groupedLocationKeys = Object.keys(groupedLocationData);

    _.forEach(groupedLocationKeys, function(key) {
      var row = [];
      var locationData = groupedLocationData[key];
      var lngLatValues = key.split(",");
      var sentimentValue = 0;

      _.forEach(locationData, function(data) {
        if (data.sentiment === 'negative') {
          sentimentValue -= 1;
        } else if (data.sentiment === 'positive') {
          sentimentValue += 1;
        }
      });

      if (sentimentValue > maxSentimentValue) {
        maxSentimentValue = sentimentValue;
      }

      if (sentimentValue < minSentimentValue) {
        minSentimentValue = sentimentValue;
      }

      row.push(parseFloat(lngLatValues[1]));
      row.push(parseFloat(lngLatValues[0]));
      row.push(sentimentValue);
      data.addRow(row);
    });



    chart.data = data;
    chart.options = {
      backgroundColor: {
        fill: 'transparent',
        stroke: '#FFF',
        strokeWidth: 0
      },
      colorAxis: {
        minValue: minSentimentValue,
        maxValue: maxSentimentValue,
        colors: [color.negative, color.neutral, color.positive]
      },
      legend: 'none',
      datalessRegionColor: '#f5f5f5',
      displayMode: 'markers',
      resolution: 'countries',
      keepAspectRatio: true,
      magnifyingGlass: {
        enable: false
      }
    };

    if (minSentimentValue === 0) {
      chart.options.colorAxis.colors = [color.neutral, color.positive];
    }

    chart.formatters = {};
    widget.chart = chart;

  };

  var setFeedChart = function(widget, result) {
    widget.chartData = _.map(result, function(feed) {
      return {
        id: feed.id,
        platform: feed.platform,
        content: feed.content,
        avatar_url: feed.avatar_url,
        platform_profile_url: feed.platform_profile_url,
        feed_url: feed.feed_url
      };
    });
  };

  var reloadData = function(widget) {
    WidgetData.loadData(widget, vm.dashboard.id, vm.dashboard.startDate, vm.dashboard.endDate).then(function(result) {
      widget.loading = false;
      widget.setting.showWidgetOption = !_.isEmpty(widget.setting.filterOptions);
      if (widget.setting.showWidgetOption) {
        var filterContent = _.map(widget.setting.filterOptions, function(filterOptionValue, filterOptionKey) {
          if (filterOptionKey === 'genders') {
            return "<strong><u>" + $translate.instant('users.dashboards.field.' + filterOptionKey) + "</u></strong>:<br/> " + filterOptionValue.join(", ");
          } else if (filterOptionKey === 'searches') {
            var searchIds = _.keys(filterOptionValue);
            var searchNames = _.map(searchIds, function(searchId) {
              return _.find(vm.dashboard.searches, function(search) {
                return search.id === searchId;
              }).name;
            });
            return "<strong><u>" + $translate.instant('users.dashboards.field.' + filterOptionKey) + "</u></strong>:<br/> " + searchNames.join(", ");
          } else {
            return "<strong><u>" + $translate.instant('users.dashboards.field.' + filterOptionKey) + "</u></strong>:<br/> " + filterOptionValue.join(", ");
          }
        }).join('<br/>');
        widget.setting.filterOptionsDisplay = "<div class='widget-filter-options'><h4>" + $translate.instant('users.dashboards.field.filter') + ":</h4>" + filterContent + "</div>";
        widget.setting.filterOptionsDisplay = formatFilterTooltip(widget);

      } else {
        widget.setting.filterOptionsDisplay = "";
      }
      if (result.length === 0) {
        widget.noDataAvailable = true;
      } else {
        widget.noDataAvailable = false;
        if (widget.setting.chartType === 'timeSeries') {
          setTimeSeriesChart(widget, result);
        } else if (widget.setting.chartType === 'vbar') {
          setVbarChart(widget, result);
        } else if (widget.setting.chartType === 'hbar') {
          setHbarChart(widget, result);
        } else if (widget.setting.chartType === 'feed') {
          setFeedChart(widget, result);
        } else if (widget.setting.chartType === 'doughnut') {
          setDoughnutChart(widget, result);
        } else if (widget.setting.chartType === 'map') {
          setMapChart(widget, result);
        }
      }
    }, function(result) {
      widget.loading = false;
      widget.noDataAvailable = true;
      $log.warn("error loading widget data", result);
    });
  };

  vm.loadMore = function(widget) {
    if (widget.loadingMore === true ){
      return;
    } else {
      widget.loadingMore = true;
    }

    if (widget.setting.offset === undefined) {
      widget.setting.offset = 1;
    } else {
      widget.setting.offset += 1;
    }

    WidgetData.loadData(widget, vm.dashboard.id, vm.dashboard.startDate, vm.dashboard.endDate).then(function(result) {
      _.forEach(result, function(chartData) {
        widget.chartData.push(chartData);
      });
    })
    .finally(function() {
      widget.loadingMore = false;
    });
  };

  vm.nextPageDisabledClass = function(widget) {
    return widget.loadingMore === true ? "disabled" : "";
  }

  var startDateChanged = function(newVal, oldVal) {
    if (oldVal !== newVal) {
      vm.dashboard.startDate = moment(vm.dashboard.startDate).startOf('day').format('YYYY-MM-DD');

      _.each(vm.widgets, function(widget) {
        reloadData(widget);
      });
    }
  };

  var endDateChanged = function(newVal, oldVal) {
    if (oldVal !== newVal) {
      if (vm.dashboard.liveData) {
        vm.dashboard.endDate = moment().endOf('day').format('YYYY-MM-DD');
      } else {
        vm.dashboard.endDate = moment(vm.dashboard.endDate).endOf('day').format('YYYY-MM-DD');
      }

      _.each(vm.widgets, function(widget) {
        reloadData(widget);
      });
    }
  };

  reloadDashboard();

  var pollingInterval = 300000;
  var regularlyPollingWidgetDataTimeoutPromise;
  var regularlyPollingWidgetData = function() {
    _.each(vm.widgets, function(widget) {
      reloadData(widget);
    });

    regularlyPollingWidgetDataTimeoutPromise = $timeout(regularlyPollingWidgetData, pollingInterval);
  };
  $scope.$on('$destroy', function() {
    if (regularlyPollingWidgetDataTimeoutPromise) {
      $timeout.cancel(regularlyPollingWidgetDataTimeoutPromise);
    }
  });

  $scope.$on(SERVICE_EVENTS.dashboardWidgetSizeChanged, afterResize);

  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

  var isExternal = function (url) {
    return url && url.lastIndexOf('http',0) == 0 && url.lastIndexOf(window.location.host) == -1;
  }

  var inlineImages = function(el, callback) {
    var images = el.querySelectorAll('image');
    var left = images.length;
    if (left == 0) {
      callback();
    }
    for (var i = 0; i < images.length; i++) {
      (function(image) {
        var href = image.getAttribute('xlink:href');
        if (href) {
          if (isExternal(href.value)) {
            console.warn("Cannot render embedded images linking to external hosts: "+href.value);
            return;
          }
        }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        href = href || image.getAttribute('href');
        img.src = href;
        img.onload = function() {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          image.setAttribute('xlink:href', canvas.toDataURL('image/png'));
          left--;
          if (left == 0) {
            callback();
          }
        }
        img.onerror = function() {
          console.log("Could not load "+href);
          left--;
          if (left == 0) {
            callback();
          }
        }
      })(images[i]);
    }
  }

  var  styles = function(el, selectorRemap) {
    var css = "";
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      if (isExternal(sheets[i].href)) {
        console.warn("Cannot include styles from other hosts: "+sheets[i].href);
        continue;
      }
      var rules = sheets[i].cssRules;
      if (rules != null) {
        for (var j = 0; j < rules.length; j++) {
          var rule = rules[j];
          if (typeof(rule.style) != "undefined") {
            var match = null;
            try {
              match = el.querySelector(rule.selectorText);
            } catch(err) {
              console.warn('Invalid CSS selector "' + rule.selectorText + '"', err);
            }
            if (match) {
              var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
              css += selector + " { " + rule.style.cssText + " }\n";
            } else if(rule.cssText.match(/^@font-face/)) {
              css += rule.cssText + '\n';
            }
          }
        }
      }
    }
    return css;
  }

  var svgAsDataUri = function(el, options, cb) {
    options = options || {};
    options.scale = options.scale || 1;
    var xmlns = "http://www.w3.org/2000/xmlns/";

    inlineImages(el, function() {
      var outer = document.createElement("div");
      var clone = el.cloneNode(true);
      var width, height;
      if(el.tagName == 'svg') {
        var box = el.getBoundingClientRect();
        width = box.width;
        height = box.height;
      } else {
        var box = el.getBBox();
        width = box.x + box.width;
        height = box.y + box.height;
        clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));

        var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.appendChild(clone);
        clone = svg;
      }

      clone.setAttribute("version", "1.1");
      clone.setAttributeNS(xmlns, "xmlns", "http://www.w3.org/2000/svg");
      clone.setAttributeNS(xmlns, "xmlns:xlink", "http://www.w3.org/1999/xlink");
      clone.setAttribute("width", width * options.scale);
      clone.setAttribute("height", height * options.scale);
      clone.setAttribute("viewBox", "0 0 " + width + " " + height);
      outer.appendChild(clone);

      var css = styles(el, options.selectorRemap);
      var s = document.createElement('style');
      s.setAttribute('type', 'text/css');
      s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
      var defs = document.createElement('defs');
      defs.appendChild(s);
      clone.insertBefore(defs, clone.firstChild);

      var svg = doctype + outer.innerHTML;
      var uri = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
      if (cb) {
        cb(uri);
      }
    });
  };
}

module.exports = UsersDashboardsShowCtrl;
