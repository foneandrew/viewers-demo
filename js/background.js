window.Background = new function() {
  var RUNNING_URL = 'http://go4pro.net/wp-content/uploads/2015/02/GoPro-Raj-Kumar-Tamang-The-Great-Himalaya-Trail-1.23.15-Bike-maxresdefault.jpg'
  var DRIVING_URL = 'http://i.ytimg.com/vi/gWdhCFzc228/maxresdefault.jpg'
  var MAX_BLUR_RADIUS = 5.0;
  var MIN_BLUR_OPACITY = 1;
  var TIMER_STEP = 20;
  var TRANSITION_TIME = 500;
  var radiusStep;
  var opacityStep;
  var blurRadius;
  var blurOpacity;
  var blurInTimer;
  var blurOutTimer;
  var running;

  this.init = function() {
    this.setRunning();

    blurOpacity = MIN_BLUR_OPACITY;
    blurRadius = MAX_BLUR_RADIUS;

    radiusStep = MAX_BLUR_RADIUS / (TRANSITION_TIME / TIMER_STEP);
    opacityStep = MIN_BLUR_OPACITY / (TRANSITION_TIME / TIMER_STEP);

    $('.bg').foggy({
      blurRadius: MAX_BLUR_RADIUS,
      opacity: MIN_BLUR_OPACITY
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
    blurRadius = Math.min(blurRadius + radiusStep, MAX_BLUR_RADIUS);
    blurOpacity = Math.max(blurOpacity - opacityStep, MIN_BLUR_OPACITY);

    applyBlur();

    if (blurRadius < MAX_BLUR_RADIUS || blurOpacity > MIN_BLUR_OPACITY) {
      blurInTimer = setTimeout(function() { blur(); }, TIMER_STEP);
    }
  };

  var unblur = function() {
    blurRadius = Math.max(blurRadius - radiusStep, 0);
    blurOpacity = Math.min(blurOpacity + opacityStep, 1);

    applyBlur();

    if (blurRadius > 0 || blurOpacity < 1) {
      blurOutTimer = setTimeout(function() { unblur(); }, TIMER_STEP);
    }
  };

  var applyBlur = function() {
    $('.bg').foggy({
      blurRadius: blurRadius,
      opacity: blurOpacity
    });
  };
};