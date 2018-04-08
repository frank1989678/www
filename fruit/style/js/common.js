// JavaScript Document
var REG = [
	/^[1-9][0-9]*$/,//num
	/^((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8}$/,//mobile
	/(^\d{3}-\d{8}|\d{4}-\d{7}|\d{4}-\d{8})(-\d{3,})?$/,//tel
	/[A-Za-z0-9]{4,12}/,//username
	/^[1-9]\d{4,8}$///qq
]
$(function() {
	goTop();
	footprint();
	myseach();
	site();
})

function nopic(el){
	el.src = "style/images/noimg.gif";
	el.onerror = null;	
}


function footprint(){
	var el = $("#footprint");
	if (el.length == 0) {
		return null;	
	}
	if(!cookieFn.cookieEnable()) {
		el.html("<li>您的浏览器禁用了cookie，请先开启cookie</li>");
		document.getElementById().removeAttribute();
	} else {
		//cookieFn.getCookie("footprint")
	}
}

function show(e, k) {
	var c = e.className;
	if(!k) {
		e.className = c + "ss";	
	} else {
		e.className = c.replace("ss","");
	}
}

function check(e, k) {
	var s = !0;
	switch (k) {
		case 0:
			s = REG[0].test(e.value);
			console.log(e.getAttribute("data-value"))
			e.value = s ? e.value : e.getAttribute("data-value");
			e.setAttribute("data-value", e.value);
			break;
			
		// 没有 default:
	}
}

function plus(id, k) {
	var e = document.getElementById(id),
		c = parseInt(e.value);
	if (c < 999 && c > 0 && (c / k != -1)) {
		e.value = parseInt(e.value) + k;
	}
}

keys = [
	{0:"boluo",1:"bl",2:"菠萝"},
	{0:"ganju",1:"gj",2:"柑桔"},
	{0:"hongsheguo",1:"hsg",2:"红蛇果"},
	{0:"hongti",1:"ht",2:"红提"},
	{0:"huolongguo",1:"hlg",2:"火龙果"},
	{0:"lanmei",1:"lm",2:"蓝莓"},
	{0:"li",1:"l",2:"梨"},
	{0:"lihe",1:"lh",2:"礼盒"},
	{0:"liulian",1:"ll",2:"榴莲"},
	{0:"longyan",1:"ly",2:"龙眼"},
	{0:"mangguo",1:"mg",2:"芒果"},
	{0:"mihoutao",1:"mht",2:"猕猴桃"},
	{0:"mugua",1:"mg",2:"木瓜"},
	{0:"ningmeng",1:"nm",2:"柠檬"},
	{0:"pingguo",1:"pg",2:"苹果"},
	{0:"putao",1:"pt",2:"葡萄"},
	{0:"qiyiguo",1:"qyg",2:"奇异果"},
	{0:"shanzu",1:"sz",2:"山竹"},
	{0:"shengnvguo",1:"sng",2:"圣女果"},
	{0:"shiliu",1:"sl",2:"石榴"},
	{0:"taozi",1:"tz",2:"桃子"},
	{0:"xiangjiao",1:"xj",2:"香蕉"},
	{0:"youzi",1:"yz",2:"柚子"},
	{0:"yezi",1:"yz",2:"椰子"},
	{0:"yingtao",1:"yt",2:"樱桃"}
]
hots = ["苹果","菠萝","柑桔","红蛇果","石榴","香蕉","龙眼"]

function myseach() {
	$("#key").blur(function(){
		if (this.value == "") {
			this.value = this.defaultValue;
			$(this).addClass("gray");	
		}
		$("#mysearch").hide();
	}).focus(function(event){
		if (this.value == this.defaultValue) {
			this.value = "";
			$(this).removeClass("gray");	
		}
		fillKey(event);	
	}).keydown(function(event){
		var e = event.keyCode ? event.keyCode : event.which;
		switch(e){
			case 38: // up
				move(-1);
				break;
			case 40: // down
				move(1);
				break;
			case 13: // enter
				var val = $("#mysearch").find(".keyover .fl").text();
				if (val.length > 0) {
					$("#key").val($("#mysearch").find(".keyover .fl").text());
				}
				$("#mysearch").hide();
				gosearch();
				break;
			case 27:
				$("#mysearch").hide();				
				break;
			// no default
		}
	}).keyup(function(event){
		fillKey(event);	
	})
	
	$("#keyBtn").click(function(){
		gosearch();
	})
	return false;	
}
function move(k) {
	var auto = $("#mysearch"),
		curr = auto.find(".keyover").index(),
		count = auto.find("li").size();
	curr += k;	
	curr = count === curr ? 0 : (curr == -1) ? (count - 1) : curr;
	auto.find("li").eq(curr).addClass("keyover").siblings().removeClass("keyover");
}


function fillKey(evt){
	var e = evt.keyCode ? evt.keyCode : evt.which,
		val = $("#key").val().toLocaleLowerCase().replace(/\s/ig,''),
		auto = $("#mysearch"),
		str = '';
    if (e==38 || e==40 || e==13 || e==27){
       return null;
	}
	auto.html("");
	if (val.length == 0) {
		for(var j=0;j<hots.length;j++){
			str += '<li' + (str.length==0 ? ' class="keyover"':'') + '><span class="fl">' + hots[j]  + '</span></li>';
		}
	} else {
		for(var j=0;j<keys.length;j++){
			if(keys[j][0].indexOf(val) == 0 || keys[j][1].indexOf(val) == 0 || keys[j][2].indexOf(val) == 0){
				str += '<li' + (str.length==0 ? ' class="keyover"':'') + '><span class="fl">' + keys[j][2]  + '</span><span class="fr">' + keys[j][0] + '</span></li>';
			}
		}
	}
	if (str.length == 0) {
		str = "<li class='off'>对不起，找不到：" + val + "</li>";
	}
	
    str = "<h4 class=\"gray\">\u6C49\u5B57|\u62FC\u97F3|\u9996\u5B57\u6BCD(\u652F\u6301\u952E\u76D8\u2191\u2193)&#12288;&#12288;<a href=\"javascript:void(0);\" class=\"\">\u6E05\u7A7A</a></h4><ul>" + str + "</ul>";
	auto.html(str).show().find("h4>a").click(function(){
		$("#key").val("").focus();
	});
	auto.find("li").mouseover(function(){
		$(this).addClass("on").siblings().removeClass("on");
	}).mousedown(function(){
		$("#key").val($(this).find(".fl").text());
		auto.hide();
	});

}


function gosearch(){
	var key = $("#key");
	if (key.val() == key.get(0).defaultValue || key.val() == '') {
		key.focus();
	}else{
		document.location = 'search.html?key='+ encodeURIComponent(key.val());
	}
	return false;	
}


/**
添加收藏
**/
function addToFavorite() {
	var a = window.location.href;
    var b = document.title;
	try {
		window.external.addFavorite(a, b);
	} catch(e) {
		try {
			window.sidebar.addPanel(a, b, "");
		} catch(e) {
			alert("对不起，您的浏览器不支持此操作!\n请您使用菜单栏或Ctrl+D收藏本站。")
		}
	}
}


/**
返回顶部
**/
function goTop() {
	var div = '<div class="goTop"><a href="javascript:void(0);" hidefocus="true" id="goTop">回顶部</a></div>';
	$("body").append(div)
	var el = document.getElementById("goTop");
	el.style.display = getScrollTop() > 300 ? "show" : "none";
	el.onclick = function() {
		window.scrollTo(0, 0);	
	}
	$(window).scroll(function() {
		if(getScrollTop() > 300)	{
			$(el).fadeIn(300)	
		}else{
			$(el).fadeOut(300)
		}
	})	
}
function getScrollTop() {
	return 	document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
}

 
var cookieFn = {
	loca:window.location.host,
    addCookie: function(hhours,cookieKey, cookieValue){
        var varDate = new Date();
        varDate.setTime(varDate.getTime() + (hhours * 60 * 60 * 1000));
        var varStr = cookieKey + "=" + escape(cookieValue) + ";expires=" + varDate.toGMTString() + ";domain="+this.loca+";path=/";
        document.cookie = varStr;
    },
    getCookie: function(cookieKey) {
        var varArray = document.cookie.split("; ");
        for (var varI = 0; varI < varArray.length; varI++) {
            var varTemp = varArray[varI].split("=");
            if (varTemp[0] == cookieKey) {
                return decodeURI(unescape(varTemp[1]));
            }
        }
        return "";
    },
    delCookie: function(cookieKey) {
        var varDate = new Date();
        varDate.setTime(varDate.getTime() - 1);
        var varCval = "";
        document.cookie = cookieKey + "=" + 1 + ";domain="+this.loca+";path=/;expires=" + varDate.toGMTString();
    },
	cookieEnable: function() {
		var c="jscookietest=valid";  
		document.cookie=c;  
		if(document.cookie.indexOf(c)==-1){  
			return false;
		} else {
			return true;
		}
	} 
}


function lazyload(option) {
	var settings = {
		defObj: null,
		defHeight: 0
	};
	settings = $.extend(settings, option || {});
	var defHeight = settings.defHeight,
	defObj = (typeof settings.defObj == "object") ? settings.defObj.find("img") : $(settings.defObj).find("img");
	var pageTop = function() {
		return document.documentElement.clientHeight + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - settings.defHeight;
	};
	var imgLoad = function() {
		defObj.each(function() {
			if ($(this).offset().top <= pageTop()) {
				var lazysrc = $(this).attr("lazysrc");
				if (lazysrc) {
					$(this).attr("src", lazysrc).removeAttr("lazysrc");
				}
			}
		});
	};
	imgLoad();
	var timer = null;
	$(window).bind("scroll",
	function() {
		if (timer !== null) {
			clearTimeout(timer)
		}
		timer = setTimeout(function() {
			imgLoad()
		},
		100)
	});
};


function iFrameHeight() { 
	var ifm= document.getElementById("iframepage"); 
	ifm.removeAttribute("height");
	var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument; 
	if(ifm != null && subWeb != null) { 
		ifm.height = subWeb.body.scrollHeight; 
	} 
} 

function site() {
	var o = $(".site");
	o.hover(
		function(){
			o.addClass("on");
		},
		function(){
			o.removeClass("on");
		}	
	)

}