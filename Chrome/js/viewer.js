window.Viewer = new function() {
  var MENU_APP = 0;
  var DRIVING_APP = 1;
  var RUNNING_APP = 2;
  var page;
  var app;
  var pages = {
    0: 2,
    1: 2,
    2: 3,
  }

  var svg;

  this.init = function() {
    svg = d3.select("#d3-content");
    console.log(svg);
    page = 0;
    app = MENU_APP;
  };

  this.goBack = function() {
    if (app != MENU_APP) {
      app = MENU_APP;
      page = 0;
      this.render();
    }
  };

  this.goUp = function() {
    if (app != MENU_APP) {
      //click in app
    } else {
      app = page + 1;
      page = 0;
      this.render();
    }
  }

  this.goLeft = function() {
    if (page == 0) {
      page = pages[app] - 1;
    } else {
      page -= 1;
    }
    this.render();
  };

  this.goRight = function() {
    page = (page + 1) % pages[app];
    this.render();
  };

  this.render = function() {
    switch(app) {
      case MENU_APP:
        renderMenu();
        break;
      case DRIVING_APP:
        renderDriving();
        break;
      case RUNNING_APP:
        renderRunning();
        break;
    };
  }

  // PRIVATE

  var renderMenu = function() {
    console.log("menu " + page);
    if (page == DRIVING_APP - 1) {
      //driving
      renderDrivingMenu();
    } else {
      //running
      renderRunningMenu();
    }
  };

  var renderDriving = function() {
    console.log("driving " + page);
  };

  var renderRunning = function() {
    console.log("running " + page);
  };

  var renderDrivingMenu = function() {
    Background.setDriving();

    svg.select('*').remove();
  };

  var renderRunningMenu = function() {
    Background.setRunning();

    svg.select('*').remove();
  };
};