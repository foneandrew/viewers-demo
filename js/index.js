$(document).ready( function() {

});

$(function() {
  Background.init();

  UiListeners.hook();
});

window.UiListeners =  new function() {
  this.hook = function() {
    bindViewer();
  };

  var bindViewer = function() {
    $('#viewer').click(function(){
      Background.swap();
    })

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
};