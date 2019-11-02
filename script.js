var sidebar = true;

$(document).ready(function(){
  $("#toggleside").click(function(){
    $("#sidebar").toggleClass("hiding");
    $("#main").toggleClass("nomarg");
    if(sidebar){
    	$("#toggleside").val("»");
    	sidebar = false;
    }else{
    	$("#toggleside").val("«");
    	sidebar = true;
    }
  });
});

$(document).ready(function(){
  $("#contact").click(function(){
	$("#main").prepend("<iframe src='contact.html'>");
  });
});