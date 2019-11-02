$(document).ready(function(){
  $("#toggleside").click(function(){
    $("#sidebar").toggleClass("hiding");
    $("#main").toggleClass("nomarg");
  });
});

$(document).ready(function(){
  $("#contact").click(function(){
	$("#main").prepend("<iframe src='contact.html'>");
  });
});