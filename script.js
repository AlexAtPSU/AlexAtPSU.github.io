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
  	$("iframe").attr("src", "contact.html");
	//$("#main").prepend("<iframe src='contact.html'>");
  });
});

$(document).ready(function(){
  $("#about").click(function(){
  	$("iframe").attr("src", "carousel.html");
	//$("#main").prepend("<iframe src='contact.html'>");
  });
});
