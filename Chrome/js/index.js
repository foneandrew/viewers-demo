$(document).ready( function() {

});

$(function() {
  Background.init();
  Viewer.init();

  UiListeners.hook();
});

window.UiListeners =  new function() {
  this.hook = function() {
    bindViewer();
    bindButtons();
  };

  // PRIVATE

  var bindViewer = function() {
    $('#d3-content').click(function(){
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