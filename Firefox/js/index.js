$(function() {
  // When page is ready:
  Background.init();
  Viewer.init($('#viewer-content'));

  UiListeners.hook();
});

window.UiListeners =  new function() {
  // Handles binding all the elements

  this.hook = function() {
    bindViewer();
    bindButtons();
  };

  // PRIVATE

  var bindViewer = function() {
    $('#viewer-content').click(function(){
      Viewer.goUp();
    });

    $('#viewer').hover(
      function(){
        //mouseIn
        Background.looseFocus();
      }, function() {
        //mouseOut
        Background.giveFocus();
      }
    );
  };

  var bindButtons = function() {
    $('#left-button').click(function(){
      Viewer.goLeft();
    });

    $('#right-button').click(function(){
      Viewer.goRight();
    });

    $('#back-button').click(function(){
      Viewer.goBack();
    });
  };
};