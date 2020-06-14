// On Load
$(function(){
	console.log("Start");

	newCustomer("DTF","Dennis");

	$('form.customer').submit(function(e){
		e.preventDefault();
		var data = formToDict(this);
		p(data);
		newCustomer(data["company"],data["customer"]);
		$(this).find("input[type=text").val("");
	});
});


function newCustomer(comp, cust){
	var box = $(".name").last().clone(true);
	box.find(".date").val(new Date());
	box.find("input[type=text]").val(cust);
	box.appendTo(".company."+comp+" > .names");
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
	$(obj).parent().parent().remove();
}

function checkTimer(obj){
	var date = new Date($(obj).parents(".name").find(".date").val());
	var open = $(obj).parent().hasClass("show");
	$(obj).parents(".company").find(".timer").text("Time: "+(Math.abs(new Date() - date)/1000).toClock());
	open = $(obj).parent().hasClass("show");
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
	var time = 500
	var timer = setInterval(function(){
			$(obj).parents(".name").find("input[type=text]").toggleClass("bg-danger text-white");
	},time);
	setTimeout(function(){
		clearTimeout(timer);
	},time * 10);
}