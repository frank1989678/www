;(function($, window, undefined){

function move(elem, k) {
	var curr   = elem.find(".curr").index(),
		 count = elem.find("li").size();
	curr += k;	
	curr = count === curr ? 0 : curr;
	elem.find("li").eq(curr).addClass("curr").siblings().removeClass("curr");
}

$.fn.autoComplete = function(options) {
	var defaults = {
		className: "emailist",
		email: ["qq.com","gmail.com","126.com","163.com","hotmail.com","yahoo.com","yahoo.com.cn","live.com","sohu.com","sina.com"]
	};
	var minW = $(this).outerWidth() - 2;
	var params = $.extend({}, defaults, options || {}); //合并参数

	var ul = $('<ul></ul>');//.css({top:-1 + $(this).outerHeight()+"px"});
	$(this).after(ul);
	var _this = $(this);
	ul.on("mouseenter mouseleave mousedown", "li", function(event) {
		if (event.type === "mousedown") {
			_this.val($(this).text())
		} else if (event.type === "mouseenter") {
			$(this).addClass("hover");
		} else if (event.type === "mouseleave") {
			$(this).removeClass("hover");
		} else {
			
		}
	})

	var setLi = function(e, val) {
		var keycode = e.keyCode ? e.keyCode : e.which,
			arr = val.split("@"),
			li = '',
			i  = params.email.length;
	    if (keycode==38 || keycode==40 || keycode==13 || keycode==27){
	       return false;
		}	
		while (--i) {
			if (typeof arr[1] === "undefined" || arr[1] == "" || params.email[i].indexOf(arr[1]) === 0) {
				li += '<li><span>' + arr[0]  + '@' + params.email[i] + '</span></li>';
			}
		}
		ul.show().html(li).find("li:eq(0)").addClass("curr");
	}

	$(this).blur(function(){ 
		if ($.trim(this.value) == "") {
			this.value = this.defaultValue;
			$(this).addClass("gray");	
		}
		ul.hide();
	}).focus(function(event){
		var val = $.trim(this.value);
		if (val == this.defaultValue) {
			this.value = "";
			$(this).removeClass("gray");	
		} else {
			setLi(event, val);	
		}
	}).keydown(function(event){
		var e = event.keyCode ? event.keyCode : event.which;
		switch(e){
			case 38: // up
				move(ul, -1);
				break;
			case 40: // down
				move(ul, 1);
				break;
			case 13: // enter
				var val = ul.find(".curr").text();
				if (val.length > 0) {
					this.value = val;
					ul.hide();
				}
				break;
			case 27: //Esc
				ul.hide();				
				break;
			// no default
		}
	}).keyup(function(event){
		var val = $.trim(this.value);
		if (val == this.defaultValue || val == "") {
			this.value = "";
			$(this).removeClass("gray");
			ul.hide();
		} else {
			setLi(event, val);	
		}
	})
}

}(jQuery, window));


$(function(){
	$("#email").autoComplete();
})

