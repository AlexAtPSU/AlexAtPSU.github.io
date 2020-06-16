// Globals 1
var companies = ["DTF"];

// On Load
$(function(){
	console.log("Start");

	var company = $(".company.card").last().clone(true);
	company.attr("id", "DTF");
	company.appendTo(".companies");

	newCustomer("DTF","Dennis");

	$('form.customer').submit(function(e){
		e.preventDefault();
		var data = formToDict(this);
		newCustomer($(this).parents(".company").attr("id"),data["customer"]);
		$(this).find("input[type=text").val("");
	});

	$('form#settings-form').submit(function(e){
		e.preventDefault();
		var data = formToDict(this);
		saveCookies(data);
	});

	$(".name > input[type=text]").on("keydown", function(e) {
		list = $(this).parents(".names").find(".name > input[type=text]");
		if (e.keyCode == 9) { // go to new customer box // NOT WORKING
            $(this).parents(".company").find(".customer > div > input[type=text]").focus();
        }
		if (e.ctrlKey) {
			if (e.keyCode == 46 || e.keyCode == 8) { // clear customer // NOT WORKING
	            $(this).parents(".name").find(".btn-clear").click();
	        }
	        if (e.keyCode == 38) { // up
	            if(list.index(this) > 0){
	            	list[list.index(this) - 1].focus();
	            }
	        }
	        if (e.keyCode == 40) { // down
	            if(list.index(this) < list.length -1){
	            	list[list.index(this) + 1].focus();
	            }else{
	            	$(this).parents(".company").find(".customer > div > input[type=text]").focus();
	            }
	        }
	    }
    });
    $(".customer > div > input[type=text]").on("keydown", function(e) {
		list = $(this).parents(".company").find(".name > input[type=text]");
		if (e.ctrlKey) {
	        if (e.keyCode == 38) { // up
	            if(list.length > 0){
	            	list[list.length -1].focus();
	            }
	        }
	    }
    });
});

function loadCookies(){

	applySettings();
}

function saveCookies(settings){
	$.each( settings, function( key, value ) {
		p( key + ": " + value );
		Cookies.set(key, value);
	});
	p(Cookies.get());
}

function applySettings(){
	
}

function companyCards(num){
	for (var i = 0; i < num; i++) {
		
	}
}


function newCustomer(comp, cust, date){
	if (!date)
		date = new Date();
	if (cust.length > 0)
		cust = cust.toUpperCase()
	if (cust.length > 1) // Later Setup option for this (~ && bool)
		cust = cust[0] + cust.substring(1).toLowerCase();
	var box = $(".name").last().clone(true);
	box.find(".date").val(date);
	box.find("input[type=text]").val(cust);
	box.find('button').css("display", "none");
	box.css("display", "none").css("bottom","-100px");
	box.appendTo("#"+comp+" > .names");
	box.animate({height:"show",bottom:"0px"}, function(){
		$(this).find("button").animate({width:"show"},100);

		blink($(this).find("input[type=text]"));
	});

	// blink(box.find("input[type=text]"));
}

function p(text){ // quick console for testing
	console.log(text);
}

function formToDict(form){
	//Object.assign({}, a, b); // combine two dictionaries
	var result = {};
	$.each($(form).serializeArray(), function() {
		result[this.name] = this.value;
	});
	return result;
}

function deleteCust(obj){
	list = $(obj).parents(".names").find(".name > input[type=text]");
	current = $(obj).parents(".name").find("input[type=text]");
    if(list.index(current) < list.length -1){
    	list[list.index(current) + 1].focus();
    } else if(list.index(current) == list.length -1 && list.length > 1) {
    	list[list.index(current) - 1].focus();
    } else {
		$(current).parents(".company").find(".customer > div > input[type=text]").focus();
    }
	$(obj).parents(".name").remove();
}

function loadTimer(obj){
	var date = new Date($(obj).parents(".name").find(".date").val());
	$(obj).parents(".company").find(".timer").text("Time: "+(Math.abs(new Date() - date)/1000).toClock());
}

Number.prototype.toClock = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes + ':' + seconds;
}

function blink(obj){
	var blink_time = 500
	var timer = setInterval(function(){
			$(obj).parents(".name").find("input[type=text]").toggleClass("bg-danger text-white");
	},blink_time);
	setTimeout(function(){
		clearTimeout(timer);
	},blink_time * 10);
}

function loadModal(){
	$("#home-tab").click();
}
