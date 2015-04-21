/*
 * BarChart is contains the logic for rending the information on the barchart page
 * This includes a D3 barchart and some text elements on the page.
 */

window.BarChart = new function() {
  var jsonData;

  var view,
      DAILY = "daily",
     WEEKLY = "weekly";

  var margin,
      width,
      height,
      x,
      y,
      xAxis,
      chart,
      chartData;

  this.init = function() {
    // Initialise variables
    margin = {top: 0, right: 30, bottom: 30, left: 40};
     width = $('#bar-chart').width() - margin.left - margin.right;
    height = $('#bar-chart').height() - margin.top - margin.bottom;

    x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    y = d3.scale.linear()
        .range([height, 0]);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    chart = d3.select("#bar-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    view = DAILY;

    initialLoad();
  };

  this.swap = function() {
    // swap views (data sets)
    if (view == DAILY) {
      setWeeklyView();
    } else {
      setDailyView();
    }
  };

  // PRIVATE

  //these small helper methods return values based on the json data
  var weeklyRunning = function() {
    return sumArray(jsonData.weekly.map( function(d) { return d.running; }));
  };

  var weeklyWalking = function() {
    return sumArray(jsonData.weekly.map( function(d) { return d.walking; }));
  };

  var dailyRunning = function() {
    return sumArray(jsonData.daily.map( function(d) { return d.running; }));
  };

  var dailyWalking = function() {
    return sumArray(jsonData.daily.map( function(d) { return d.walking; }));
  };

  var setDailyView = function() {
    view = DAILY;
    update();
  };

  var setWeeklyView = function() {
    view = WEEKLY;
    update();
  };

  var update = function() {
    // update redraws the chart with whatever data is currently set. AND animates the transition
    chartData = jsonData[view];
    updateScale();

    chart.selectAll(".running")
        .data(chartData);

    chart.selectAll(".walking")
        .data(chartData);

    updateAxis();

    chart.selectAll(".walking")
        .transition()
        .duration(750)
        .attr("y", function(d) { return y(d.walking); })
        .attr("height", function(d) { return height - y(d.walking); });

    chart.selectAll(".running")
        .transition()
        .duration(750)
        .attr("y", function(d) { return y(d.walking + d.running); })
        .attr("height", function(d) { return height - y(d.walking + d.running); });

    updateText();
  };

  var updateText = function() {
    // Update the text components of the page
    if (view == DAILY) {
      $('#title').html('This Weeks Exercise');
      $('#walking-amount').html(dailyWalking());
      $('#running-amount').html(dailyRunning());
    } else {
      $('#title').html('Previous Weeks\' Exercise');
      $('#walking-amount').html(weeklyWalking());
      $('#running-amount').html(weeklyRunning());
    }

  };

  var updateScale = function() {
    y.domain([0, d3.max(chartData, function(d) { return d.walking + d.running; })]);
  };

  var updateAxis = function() {
    //reset the axis to use the new data
    chart.select(".x.axis").remove()

    x.domain(chartData.map( function(d) { return d.name; }));

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  };

  var initialLoad = function() {
    // load the data from json and perform the initial draw operations
    d3.json("json/weekly-stats.json", function(error, data) {
      jsonData = data;
      chartData = jsonData[view];

      updateAxis();

      var newBar = chart.selectAll("bar")
          .data(chartData)
        .enter();

        //By setting the height of the bars to 0, and then calling update,
        //the bars will animate in from the bottom when the page is first
        //loaded

        newBar.append("rect")
          .attr("class", "bar running")
          .attr("x", function(d) { return x(d.name); })
          .attr("y", function(d) { return y(0); })
          .attr("height", function(d) { return 0; })
          .attr("width", x.rangeBand());

      newBar.append("rect")
          .attr("class", "bar walking")
          .attr("x", function(d) { return x(d.name); })
          .attr("y", function(d) { return y(0); })
          .attr("height", function(d) { return 0; })
          .attr("width", x.rangeBand());

      update();
    });
  };

  var sumArray = function(array) {
    var sum = 0;
    array.forEach(function(entry){
      sum += entry;
    });
    return sum;
  };
}