window.Background = new function() {
  var RUNNING_URL = 'http://go4pro.net/wp-content/uploads/2015/02/GoPro-Raj-Kumar-Tamang-The-Great-Himalaya-Trail-1.23.15-Bike-maxresdefault.jpg'
  var DRIVING_URL = 'http://i.ytimg.com/vi/gWdhCFzc228/maxresdefault.jpg'
  var MAX_BLUR_RADIUS = 5.0;
  var TIMER_STEP = 20;
  var TRANSITION_TIME = 500;
  var radiusStep;
  var backgroundBlurRadius;
  var viewerBlurRadius;
  var blurInTimer;
  var blurOutTimer;
  var running;

  this.init = function() {
    this.setDriving();

    backgroundBlurRadius = MAX_BLUR_RADIUS;
    viewerBlurRadius = 0;

    radiusStep = MAX_BLUR_RADIUS / (TRANSITION_TIME / TIMER_STEP);

    $('.bg').foggy({
      backgroundBlurRadius: MAX_BLUR_RADIUS,
      opacity: 1
    });
  };

  this.swap = function() {
    if (running) {
      this.setDriving();
    } else {
      this.setRunning();
    }
  }

  this.setRunning = function() {
    $('#background-img').attr('src', RUNNING_URL);
    running = true;
  };

  this.setDriving = function() {
    $('#background-img').attr('src', DRIVING_URL);
    running = false;
  };

  this.looseFocus = function() {
    clearTimeout(blurOutTimer);
    blurInTimer = setTimeout(function() { blur(); }, TIMER_STEP);
  };

  this.giveFocus = function() {
    clearTimeout(blurInTimer);
    blurOutTimer = setTimeout(function() { unblur(); }, TIMER_STEP);
  };

  // PRIVATE

  var blur = function() {
    backgroundBlurRadius = Math.min(backgroundBlurRadius + radiusStep, MAX_BLUR_RADIUS);
    viewerBlurRadius = Math.max(viewerBlurRadius - radiusStep, 0);

    applyBlur();

    if (backgroundBlurRadius < MAX_BLUR_RADIUS || viewerBlurRadius > 0) {
      blurInTimer = setTimeout(function() { blur(); }, TIMER_STEP);
    }
  };

  var unblur = function() {
    backgroundBlurRadius = Math.max(backgroundBlurRadius - radiusStep, 0);
    viewerBlurRadius = Math.min(viewerBlurRadius + radiusStep, MAX_BLUR_RADIUS);

    applyBlur();

    if (backgroundBlurRadius > 0 || viewerBlurRadius < MAX_BLUR_RADIUS) {
      blurOutTimer = setTimeout(function() { unblur(); }, TIMER_STEP);
    }
  };

  var applyBlur = function() {
    $('.bg').foggy({
      blurRadius: backgroundBlurRadius,
      opacity: 1
    });
    $('#viewer').foggy({
      blurRadius: viewerBlurRadius,
      opacity: 0.5
    });
  };
};