/* The background class handles changing backgrounds, and emulating
 * the users depth of field when wearing the viewers, by blurring
 * out certain elements
 */

window.Background = new function() {
  var RUNNING_URL = 'img/running_background.jpg'
  var DRIVING_URL = 'img/driving_background.jpg'
  var MAX_BLUR_RADIUS = 3.0;
  var MIN_TRANSPARENCY = 0.5;
  var TIMER_STEP = 20;
  var TRANSITION_TIME = 100;
  var radiusStep,
      tranparencyStep,
      backgroundBlurRadius,
      viewerBlurRadius,
      viewerTransparency,
      blurInTimer,
      blurOutTimer,
      running;

  this.init = function() {
    //Set up the class

    this.setRunning();

    backgroundBlurRadius = MAX_BLUR_RADIUS;
    viewerBlurRadius = 0;
    viewerTransparency = 1;

    radiusStep = MAX_BLUR_RADIUS / (TRANSITION_TIME / TIMER_STEP);
    tranparencyStep = (1 - MIN_TRANSPARENCY) / (TRANSITION_TIME / TIMER_STEP);

    $('.bg').css('filter', 'blur(5px)');
  };

  this.setRunning = function() {
    $('#background-img').attr('src', RUNNING_URL);
    running = true;
  };

  this.setDriving = function() {
    $('#background-img').attr('src', DRIVING_URL);
    running = false;
  };

  // Focus is in terms of the background. So if we giveFocus, we give focus to the background and remove focus from the viewer

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
    // calculates new blur and transparency values, and loops until fully blurred/un-blurred
    backgroundBlurRadius = Math.min(backgroundBlurRadius + radiusStep, MAX_BLUR_RADIUS);
    viewerBlurRadius = Math.max(viewerBlurRadius - radiusStep, 0);
    viewerTransparency = Math.min(viewerTransparency + tranparencyStep, 1);

    applyBlur();

    if (backgroundBlurRadius < MAX_BLUR_RADIUS || viewerBlurRadius > 0 || viewerTransparency < 1) {
      blurInTimer = setTimeout(function() { blur(); }, TIMER_STEP);
    }
  };

  var unblur = function() {
    // calculates new blur and transparency values, and loops until fully blurred/un-blurred
    backgroundBlurRadius = Math.max(backgroundBlurRadius - radiusStep, 0);
    viewerBlurRadius = Math.min(viewerBlurRadius + radiusStep, MAX_BLUR_RADIUS);
    viewerTransparency = Math.max(viewerTransparency - tranparencyStep, MIN_TRANSPARENCY);

    applyBlur();

    if (backgroundBlurRadius > 0 || viewerBlurRadius < MAX_BLUR_RADIUS || viewerTransparency > MIN_TRANSPARENCY) {
      blurOutTimer = setTimeout(function() { unblur(); }, TIMER_STEP);
    }
  };

  var applyBlur = function() {
    // Apply the calculated blur values to the elements
    $('.bg').css('filter', 'blur(' + backgroundBlurRadius + 'px)');
    $('#viewer').css('filter', 'blur(' + viewerBlurRadius + 'px)');
    $('#viewer-content').css('opacity', viewerTransparency);
    console.log(viewerTransparency)
  };
};