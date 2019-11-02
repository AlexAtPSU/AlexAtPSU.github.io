$(document).ready(function(){
  $("#toggleside").click(function(){
    $("#sidebar").toggleClass("sidebar hiding");
    $("#main").toggleClass("nomarg");
  });
});