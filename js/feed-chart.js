// FeedChart class
// Variables needed: window.apikey_read, window.emoncms_path
// Libraries needed: jQuery, flot, flot.time, flot.selection, date.format, chart-view, timeseries
//
// Parameters:
//   divId: id of the graph container
//   feeds: array of feed objects
//     id: id of the feed
//     color (optional): color of the feed
//     legend (optional): legend of the feed
//   options: object of configuration options
//     defaultRange: default interval for the visualization (in days)
//     pWidth: percentaje of screen width (from 0 to 1)
//     pHeight: percentaje of screen height (from 0 to 1)
//     updateinterval: time between updates in live mode (in ms)
//     selectable: chart can be selected and zoomed in (boolean)
function FeedChart(divId, feeds, options) {
  "use strict";

  // Parameter Properties
  // ID of the div where the graph is drawn
  this.divId = divId;
  // Options
  // Default interval drawn
  this.defaultRange = options.defaultRange;
  // Percentaje of the screen width
  this.pWidth = options.pWidth;
  // Percentaje of the screen height
  this.pHeight = options.pHeight;
  // Time between updates in live mode (in ms)
  this.updateinterval = options.updateinterval;
  // Chart can be selected and zoomed in
  this.selectable = options.selectable;
  // Feed ids, colors and legends
  this.feeds = [];
  this.feed_colors = [];
  this.feed_legends = [];
  for(var feedid in feeds) {
    var feed = feeds[feedid];
    this.feeds.push(feed.id);
    if (typeof feed.color !== "undefined") {
      this.feed_colors["f" + feed.id] = feed.color;
    } else {
      this.feed_colors["f" + feed.id] = null;
    }
    if (typeof feed.legend !== "undefined") {
      this.feed_legends["f" + feed.id] = feed.legend;
    } else {
      this.feed_legends["f" + feed.id] = null;
    }
  }

  // Object Properties
  // Live (setInterval)
  this.live = false;
  // Auto update
  this.autoupdate = true;
  // Reload the chart
  this.reload = true;
  // Last update
  this.lastupdate = 0;
  // View
  this.view = new ChartView();
  this.view.timewindow(this.defaultRange);
  // Data store
  this.datastore = {};
  // Timeseries
  this.timeseries = new TimeSeries(this.datastore);

  // Set default range
  this.view.timewindow(this.defaultRange);

  // Placeholder bound
  this.placeholder_bound = $("#" + divId);
  // Placeholder
  this.placeholder_bound.append($("<div/>", {id: divId + "_plot"}));
  this.placeholder = $("#" + divId + "_plot");

  // Bind selection
  var self = this;
  if(this.selectable) {
    this.placeholder.bind("plotselected", function (event, ranges) {
      self.view.start = ranges.xaxis.from;
      self.view.end = ranges.xaxis.to;

      self.autoupdate = false;
      self.reload = true;

      var now = +new Date();
      if (Math.abs(self.view.end - now) < 30000) {
        self.autoupdate = true;
      }

      self.draw();
    });
  }

  // Resize event
  $(window).resize(function() {
    self.resize();
    self.draw();
  });

  // Functions
  // Show graph
  this.show = function() {
    this.resize();
    this.livefn();
    var self = this;
    this.live = setInterval(function() {
      self.livefn();
    }, this.updateinterval);
    this.draw();
  };

  // Resize graph
  this.resize = function() {
    this.placeholder_bound.width((this.pWidth * 100) + "%");
    var width = this.placeholder_bound.width();
    var height = $(window).height() * this.pHeight;

    if(height > width) {
      height = width;
    }

    this.placeholder.width(width);
    this.placeholder_bound.height(height);
    this.placeholder.height(height);
  };

  // Hide graph
  this.hide = function() {
    clearInterval(this.live);
  };

  // Update graph
  this.livefn = function() {
    // Check if the updater ran in the last 60s
    //   If it did not the app was sleeping
    //   and so the data needs a full reload
    var now = +new Date();
    if((now - this.lastupdate) > 60000) {
      this.reload = true;
    }
    this.lastupdate = now;

    // If autoupdate active
    if(this.autoupdate) {
      for(var feedid in this.feeds) {
        var feed = this.feeds[feedid];
        var feedData = this.getData(feed, now, now + 1000, 1);
        if(feedData.length >= 1) {
          this.timeseries.append("f" + feed, feedData[0][0], parseInt(feedData[0][1]));
          this.timeseries.trimstart("f" + feed, this.view.start * 0.001);
        }
      }
      var timerange = this.view.end - this.view.start;
      this.view.end = now;
      this.view.start = this.view.end - timerange;
    }

    // Draw the graph
    this.draw();
  };

  // Draw graph
  this.draw = function() {
    // fplot options
    var options = {
      lines: {
        fill: false
      },
      xaxis: {
        mode: "time",
        timezone: "browser",
        min: this.view.start,
        max: this.view.end
      },
      yaxes: [
        {
          min: 0
        }
      ],
      grid: {
        hoverable: true,
        clickable: true
      },
      selection: {
        mode: "x"
      },
      legend: {
        show: true,
        pos: "ne",
        backgroundOpacity: 0.5,

      }
    };

    // Number of datapoints
    var npoints = 1500;
    var interval = Math.round(((this.view.end - this.view.start) / npoints) / 1000);
    if(interval < 1) {
      interval = 1;
    }
    npoints = parseInt((this.view.end - this.view.start) / (interval * 1000));

    // Load data on init or reload
    if(this.reload) {
      this.reload = false;
      this.view.start = 1000 * Math.floor((this.view.start / 1000) / interval) * interval;
      this.view.end = 1000 * Math.ceil((this.view.end / 1000) / interval) * interval;

      for(var i in this.feeds) {
        var feed = this.feeds[i];
        var feedData = this.getData(feed, this.view.start, this.view.end, interval);
        // Fix single data exception
        if(feedData.length == 1) {
          feedData[1] = feedData[0];
        }
        this.timeseries.load("f" + feed, feedData);
      }
    }

    // Initialize plot data
    var plot_data = [];

    // Data start
    var datastart = this.view.start;
    // ?
    for(var z in this.datastore) {
      datastart = this.datastore[z].data[0][0];
      npoints = this.datastore[z].data.length;
    }

    // Push data
    for(var z = 0; z < npoints; z++) {
      var time = datastart + (1000 * interval * z);
      for(var i in this.feeds) {
        var feed = this.feeds[i];
        if((this.datastore["f" + feed].data[z] != undefined) && (this.datastore["f" + feed].data[z][1] != null)) {
        // Append even null data if no fill option is wanted
        // if(this.datastore["f" + feed].data[z] != undefined) {
          if(plot_data["f" + feed] == undefined) {
            plot_data["f" + feed] = [];
          }
          plot_data["f" + feed].push([time, this.datastore["f" + feed].data[z][1]]);
        }
      }
    }

    // Axis options
    options.xaxis.min = this.view.start;
    options.xaxis.max = this.view.end;

    // Data for the plot
    var series = [];
    for(var i in plot_data) {
      var feed_data = plot_data[i];
      var seriesData = {
        data: feed_data,
        color: this.feed_colors[i],
        lines: {
          lineWidth: 0.2,
          fill: 0.7
        },
        label: this.feed_legends[i]
      };
      series.push(seriesData);
    }

    // If no data retrieved, return
    if(series.length == 0) {
      return;
    }

    // Call fplot
    $.plot(this.placeholder, series, options);
  };

  // Get feed data
  this.getData = function(id, start, end, interval) {
    var data = [];
    $.ajax({
      url: window.emoncms_path + "/feed/data.json?apikey=" + window.apikey_read,
      data: "id="+id+"&start="+start+"&end="+end+"&interval="+interval+"&skipmissing=0&limitinterval=0",
      dataType: "json",
      async: false,
      success: function(data_in) {
        data = data_in;
      }
    });
    return data;
  };
};

//
// FeedChartFactory module
//   Creates FeedCharts with controls
(function (FeedChartFactory, $, undefined) {
  "use strict";

  // Creates a new FeedChart
  //
  // Parameters:
  //   divId: id of the graph container
  //   feeds: array of feed objects
  //     id: id of the feed
  //     color (optional): color of the feed
  //     legend (optional): legend of the feed
  //   options: object of configuration options
  //     defaultRange: default interval for the visualization (in days)
  //     pWidth: percentaje of screen width (from 0 to 1)
  //     pHeight: percentaje of screen height (from 0 to 1)
  //     updateinterval: time between updates in live mode (in ms)
  //     selectable: chart can be selected and zoomed in (boolean)
  //     controls: append controls to the chart (boolean)
  FeedChartFactory.create = function (containerId, feeds, options) {
    // Default options
    var defaultOptions = {
      defaultRange: 7,
      pWidth: 1,
      pHeight: 0.5,
      updateinterval: 10000,
      selectable: true,
      controls: true,
      feedsStyle: []
    };
    // Merge defaultOptions and options, without modifying defaultOptions
    var chartOptions = $.extend({}, defaultOptions, options);

    if(chartOptions.controls === true) {
      // Controlbar
      var controlbar = $("<div/>", {class: "fchartbar"});
      // Append the controlbar to the container
      $("#"+containerId).append(controlbar);
    }

    // Append the chart div to the container
    $("#"+containerId).append($("<div/>", {id: containerId + "_chart", class: "flinechart"}));
    // Chart
    var fchart = new FeedChart(containerId + "_chart", feeds, chartOptions);

    // Append controls
    if(chartOptions.controls === true) {
      // Chart controls
      // 1h
      $("<span/>", {text: "1h", click: function() {
        fchart.view.timewindow(1/24.0);
        fchart.reload = true;
        fchart.autoupdate = true;
        fchart.draw();
      }}).appendTo(controlbar);
      // 8h
      $("<span/>", {text: "8h", click: function() {
        fchart.view.timewindow(8/24.0);
        fchart.reload = true;
        fchart.autoupdate = true;
        fchart.draw();
      }}).appendTo(controlbar);
      // D
      $("<span/>", {text: "D", click: function() {
        fchart.view.timewindow(1);
        fchart.reload = true;
        fchart.autoupdate = true;
        fchart.draw();
      }}).appendTo(controlbar);
      // W
      $("<span/>", {text: "W", click: function() {
        fchart.view.timewindow(7);
        fchart.reload = true;
        fchart.autoupdate = true;
        fchart.draw();
      }}).appendTo(controlbar);
      // M
      $("<span/>", {text: "M", click: function() {
        fchart.view.timewindow(30);
        fchart.reload = true;
        fchart.autoupdate = true;
        fchart.draw();
      }}).appendTo(controlbar);
      // Y
      $("<span/>", {text: "Y", click: function() {
        fchart.view.timewindow(365);
        fchart.reload = true;
        fchart.autoupdate = true;
        fchart.draw();
      }}).appendTo(controlbar);
      // Zoom in
      $("<span/>", {text: "+", click: function() {
        fchart.view.zoomin();
        fchart.reload = true;
        fchart.autoupdate = false;
        fchart.draw();
      }}).appendTo(controlbar);
      // Zoom out
      $("<span/>", {text: "-", click: function() {
        fchart.view.zoomout();
        fchart.reload = true;
        fchart.autoupdate = false;
        fchart.draw();
      }}).appendTo(controlbar);
      // Pan left
      $("<span/>", {text: "<", click: function() {
        fchart.view.panleft();
        fchart.reload = true;
        fchart.autoupdate = false;
        fchart.draw();
      }}).appendTo(controlbar);
      // Pan right
      $("<span/>", {text: ">", click: function() {
        fchart.view.panright();
        fchart.reload = true;
        fchart.autoupdate = false;
        fchart.draw();
      }}).appendTo(controlbar);
    }

    // Show fchart
    fchart.show();

    // Return chart
    return fchart;
  };
}(window.FeedChartFactory = window.FeedChartFactory || {}, jQuery));