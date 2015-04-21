/* The Viewer holds the logic for navigation within the viewer,
 * and rendering each viewer page
 */

window.Viewer = new function() {
  var MENU0 = 'partials/_menu_page0.html';
  var MENU1 = 'partials/_menu_page1.html';
  var DRVING0 = 'partials/_driving_page0.html';
  var RUNNING0 = 'partials/_running_page0.html';
  var RUNNING1 = 'partials/_running_page1.html';


  var MENU_APP = 0;
  var DRIVING_APP = 1;
  var RUNNING_APP = 2;
  var page,
      app,
      pages = {
    0: 2,
    1: 1,
    2: 2,
  }

  var viewerContainer;

  this.init = function(viewerObject) {
    // Set variables to default values, and render the first page
    viewerContainer = viewerObject;
    page = 1;
    app = MENU_APP;
    this.render();
  };

  this.goBack = function() {
    // down button is clicked, so navigate back
    if (app != MENU_APP) {
      app = MENU_APP;
      page = 0;
      this.render();
    }
  };

  this.goUp = function() {
    // The viewer itself is clicked
    if (app != MENU_APP) {
      //click in app
      this.clicked();
    } else {
      //in menu so launch selected app
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
    /* render displays a viewer page by calling the render method
     * for the specific app we want to view. These methods will use
     * jquery to load a partial into the viewer window, and if needed
     * make any appropriate class calls.
     */
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

  this.clicked = function() {
    //clicked is when an open app is clicked
    switch(app) {
      case DRIVING_APP:
        clickDriving();
        break;
      case RUNNING_APP:
        clickRunning();
        break;
    };
  }

  // PRIVATE

  var renderMenu = function() {
    if (page == DRIVING_APP - 1) {
      //driving
      renderDrivingMenu();
    } else {
      //running
      renderRunningMenu();
    }
  };

  var renderDriving = function() {
    viewerContainer.load(DRVING0);
  };

  var clickDriving = function() {
    //no extra behaviour for the driving app
  }

  var renderRunning = function() {
    if (page == 0) {
      viewerContainer.load(RUNNING0, function() {
        //Once loaded, start the D3 content
        PieChart.init();
      });
    } else {
      viewerContainer.load(RUNNING1, function() {
        //Once loaded, start the D3 content
        BarChart.init();
      });
    }
  };

  var clickRunning = function() {
    // d3 visualisations swap their data
    if (page == 0) {
      PieChart.swap();
    } else {
      BarChart.swap();
    }
  }

  var renderDrivingMenu = function() {
    viewerContainer.load(MENU0);

    Background.setDriving();
  };

  var renderRunningMenu = function() {
    viewerContainer.load(MENU1);

    Background.setRunning();
  };
};