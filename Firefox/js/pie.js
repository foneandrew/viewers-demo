/*
 * PieChart handles all the data elements for the pie chart page (the chart and the text elements).
 * It also simulates adding steps with a pedometer.
 */

window.PieChart = new function() {
      var jsonData = {};

      var TICK_TIME = 1000
          STEP_STEP = 3;

      var view,
          STEPS = "steps",
           TIME = "time";

      var  width,
          height,
          radius,
          timeArc,
          stepArc,
          pie,
          svg,
          chart,
          chartData,
          timer;

          var test = false;

      var TARGET = "pie-target",
           UNDER = "pie-under",
            OVER = "pie-over";

      this.init = function() {
        //load the variables and make the call to the initial renderer

        //stop the timer if it was already going before
        clearTimeout(timer);

        width = $('#pie-chart').width();
        height = $('#pie-chart').height();

        radius = Math.min(width, height) / 2;

        timeArc = d3.svg.arc()
            .outerRadius(radius - 10);

        stepArc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius / 2);

        pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value })

        chart = d3.select("#pie-chart")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        view = STEPS;

        initialLoad();
      };

      this.swap = function() {
        if (view == STEPS) {
          setTimeView();
        } else {
          setStepView();
        }
      }

      // PRIVATE

      var setStepView = function() {
        view = STEPS;
        update();
      };

      var setTimeView = function() {
        view = TIME;
        update();
      };

      var update = function() {
        var arc;

        //update data
        setChartData();

        chart.selectAll("path")
            .data(pie(chartData));

        // determine arc type (doughnut or pie)
        if (view == STEPS) {
          arc = stepArc;
        } else {
          arc = timeArc;
        }

        //(re)draw the arcs with their new shapes and css classes
        chart.selectAll("path")
            .attr("d", arc)
            .attr("class", function(d) { return d.data.type; });

        updateText();
      };

      var updateText = function(){
        //update the text elements on the page.
        //we want to display different things based on what state the data is in
        if (view == TIME) {
          $('#current-measure').html(currentTime());
          $('#target-measure').html(targetTime());
          $('.units').html("mins");
        } else {
          $('#current-measure').html(currentSteps());
          $('#target-measure').html(targetSteps());
          $('.units').html("steps");
        }
        $('#current-measure').removeClass(OVER);
        $('#current-measure').removeClass(UNDER);
        $('#current-measure').addClass(chartData[0].type);

        if (chartData[0].type == OVER) {
          $('#message').html('WELL DONE!');
        } else {
          $('#message').html('You can do it!');
        }
      }

      var initialLoad = function() {
        // get the json from the file
        d3.json("json/todays-data.json", function(error, data) {
          test = true;
          jsonData = data;
          //get the data for the chart
          setChartData();

          //set the data
          var g = chart.selectAll(".arc")
              .data(pie(chartData))
            .enter().append("g")
              .attr("class", "arc");

          g.append("path");

          // start the step counter simulation
          timer = setTimeout(function() { tick(); }, TICK_TIME);

          //draw the chart
          update();
        });
      };

      var setChartData = function() {
        // perform operations on the json data to extract the data we want
        // to display in the chart
        var rawData = jsonData[view];

        // if the current count is more than the target, we want to change
        // how we display the data to reflect this
        if (rawData.target > rawData.current) {
          chartData = [
            {"type":UNDER,"value":rawData.current},
            {"type":TARGET,"value":rawData.target - rawData.current}
          ];
        } else {
          chartData = [
            {"type":OVER,"value":rawData.current - rawData.target},
            {"type":UNDER,"value":rawData.target}
          ];
        }
      };

      var tick = function() {
        // this is the timer that simulates adding steps to the step count
        jsonData.steps.current += Math.ceil(Math.random() * STEP_STEP);
        update();
        timer = setTimeout(function() { tick(); }, TICK_TIME);
      };

      var targetTime = function() {
        return jsonData.time.target;
      };

      var targetSteps = function() {
        return jsonData.steps.target;
      };

      var currentTime = function() {
        return jsonData.time.current;
      };

      var currentSteps = function() {
        return jsonData.steps.current;
      };
    }