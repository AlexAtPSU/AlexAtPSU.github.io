// Globals
var companies = [];
var pictures = {"DoorDash":"https://bluelemon.com/wp-content/uploads/2019/05/logo-doordash-.png","PostMates":"https://promoaffiliates.com/wp-content/uploads/2017/03/PostmatesLogoLong.png","Caviar":"https://ww1.prweb.com/prfiles/2014/06/30/12214945/caviar_orange_wordmark.png","UberEats":"https://flyclipart.com/downloadpage/images/uber-eats-logo-37792.png/37792","GrubHub":"https://res.cloudinary.com/popmenu/image/upload/c_limit,f_auto,h_1440,q_auto,w_1440/eykrtyhpcfiybielo3yy.png"};
var colors = {};
var blink_time = 500;
var times = {};
var casing = 0;

// On Load
$(function(){
	console.log("Start");

	loadCookies();

	$('form.customer').submit(function(e){
		e.preventDefault();
		var data = formToDict(this);
		if(data["customer"])
			newCustomer($(this).parents(".company").attr("id"),data["customer"]);
		$(this).find("input[type=text").val("");
	});

	$('form#settings-form').submit(function(e){
		e.preventDefault();
		var data = formToDict(this);
		saveCookies(data);
		if(confirm('To apply changes,\n the page will now reload.'))
			window.location.reload();
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
	var sett = Cookies.get();
	var num = sett["num"];
	if(!sett["num"]){
		num = 0;
	}

	for(var i = 1; i <= num; i++){
		if(sett["comp"+i])
			companies.push(sett["comp"+i]);
	}

	if(num == 0){
		companies.push("DTF");
		num = 1;
	}
	if(num > companies.length){
		num = companies.length;	
	}

	var keys = Object.keys(sett);
	for(var i = 0; i < keys.length; i++){
		if(keys[i].search("-color") > 0)
			colors[keys[i].replace("-color","")] = sett[keys[i]];
		if(keys[i].search("-pic") > 0)
			pictures[keys[i].replace("-pic","")] = sett[keys[i]];
	}

	loadJumps(num);

	if(sett["info1"]){
		$("#info1").html(sett["info1"]);
		$("#info1-box").val(sett["info1"]);
	}

	if(sett["info2"]){
		$("#info2").html(sett["info2"]);
		$("#info2-box").val(sett["info2"]);
	}

	casing = parseInt(sett["casing"]);
	companyCards(num);
	updateNumComps(num);

	settingsTabs(num)
	applySettings();
}

function saveCookies(settings){
	$.each( settings, function( key, value ) {
		Cookies.set(key, value,{expires: 365});
	});
	p(Cookies.get());
}

function applySettings(){
	
}

function companyCards(num){
	var company;
	var nameNoSpace;
	for (var i = 0; i < num; i++) {
		nameNoSpace = companies[i].replace(" ", "");
		company = $(".company.card").last().clone(true);
		company.attr("id", nameNoSpace);
		if(pictures[nameNoSpace])
			company.find("img").attr("src", pictures[nameNoSpace]);
		if(colors[nameNoSpace])
			company.css("background",colors[nameNoSpace]);
		company.appendTo(".companies");
	}
}


function newCustomer(comp, cust, date){
	if (!date)
		date = new Date();
	if (cust.length > 0)
		cust = cust.toUpperCase()
	if (cust.length > 1 && !casing) // Later Setup option for this (~ && bool)
		cust = cust[0] + cust.substring(1).toLowerCase();
	var box = $(".name").last().clone(true);
	box.find(".date").val(date);
	box.find("input[type=text]").val(cust);

	box.find(".jump-column").each(function(){
		if ($(this).text().replace(" ", "") == comp) {
			$(this).addClass("d-none");
		}
	});

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

function deleteCust(obj, dontsave){
	list = $(obj).parents(".names").find(".name > input[type=text]");
	current = $(obj).parents(".name").find("input[type=text]");
    if(list.index(current) < list.length -1){
    	list[list.index(current) + 1].focus();
    } else if(list.index(current) == list.length -1 && list.length > 1) {
    	list[list.index(current) - 1].focus();
    } else {
		$(current).parents(".company").find(".customer > div > input[type=text]").focus();
    }
    if(!dontsave)
    	storeTime(obj);
	$(obj).parents(".name").remove();
}

function deleteColumn(obj){
	$(obj).parents(".company").find(".name").each(function(){
		storeTime($(this).find("input[type=text]"));
		$(this).remove();
	});

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
	var timer = setInterval(function(){
			$(obj).parents(".name").find("input[type=text]").toggleClass("bg-danger text-white");
	},blink_time);
	setTimeout(function(){
		clearTimeout(timer);
		$(obj).parents(".name").find("input[type=text]").removeClass("bg-danger text-white");
	},blink_time * 10);
}

function loadModal(){
	$("#home-tab").click();
}

function updateNumComps(newNum){
	$("#num-companies").val(newNum);
	num = parseInt(newNum);
	var curNum = $(".settings-option").length;
	for (curNum = $(".settings-option").length; curNum < num+1; curNum = $(".settings-option").length) {
		$("#selectCompany").append("<option class='settings-option' value='"+(curNum)+"'>Tab "+curNum+"</option>");
		if(companies[curNum-1]){
			name = companies[curNum-1];
		}else{
			name = "Name" + curNum;
		}
		$(".settings-names").append("<div class='col-sm-9 settings-name d-none'><input type='text' value='"+name+"' name=comp"+curNum+" class='form-control'></div>");
	}
	for(var i = curNum; num+1 < i; i--){
		$($(".settings-option")[i-1]).addClass("d-none");
	}
	for(var i = 1; i < num; i++){
		$($(".settings-option")[i]).removeClass("d-none");
	}
}

function showCompNameBox(selection){
	var cur = selection.options[selection.selectedIndex].value;
	for(var i = 0; i < $(".settings-name").length; i++){
		if (i != cur){
			$($(".settings-name")[i]).addClass("d-none");
		}else{
			$($(".settings-name")[i]).removeClass("d-none");
		}
	}
}

function settingsTabs(num){
	for(var i = 0; i < num; i++){
		name = companies[i].replace(" ", "");
		$("#myTabs").append("<li class='nav-item'><a class='nav-link' id='"+name+"-tab' data-toggle='tab' href='#"+name+"-tab-cont' role='tab' aria-controls='"+name+"-tab-cont' aria-selected='false'>"+companies[i]+"</a></li>");

		clone = $(".company-tab").last().clone(true);
		clone.attr("aria-labelledby", name+"-tab-cont");
		clone.attr("id",name+"-tab-cont");
		$(clone.find("label")[0]).attr("for",name+"-pic");
		$(clone.find("input")[0]).val(pictures[name]).attr("name",name+"-pic");


		$(clone.find("label")[1]).attr("for",name+"-color");
		color = "#efebda";
		if(colors[name])
			color = colors[name];
		$(clone.find("input")[1]).attr("name",name+"-color").val(color);

		$("#settings-form").append(clone);
	}
}

function resetTimer(obj){
	$(obj).parents(".name").find(".date").val(new Date());
}

function storeTime(obj){
	var time = Math.abs((new Date() - new Date($(obj).parents(".name").find(".date").val()))/1000);
	var comp = $(obj).parents(".company").attr("id");
	if(!times[comp])
		times[comp] = [];
	times[comp].push(time);

	var average = getMean(times[comp]);
	var sd = getSD(times[comp]);
	$("#"+comp+"-tab-cont").find(".average-time").text(average.toClock());
	$("#"+comp+"-tab-cont").find(".sd-time").text(sd.toClock());
}

function loadJumps(num){
	for(var i = 0; i < num; i++){
		$(".jumpColumn").last().append("<a class='dropdown-item jump-column' href='#' onclick='jumpToColumn(this,"+i+")'>"+companies[i]+"</a>");
	}
}

function jumpToColumn(obj, num){
	$("#"+companies[num].replace(" ","")).find(".names").append($(obj).parents(".name"));
	$(obj).parents(".dropdown-menu").find(".jump-column").each(function(){
		if ($(this).text() == companies[num]) {
			$(this).addClass("d-none");
		}else{
			$(this).removeClass("d-none");
		}
	});
}

let getMean = function (data) {
    return data.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / data.length;
};

let getSD = function (data) {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (data.length - 1));
};

