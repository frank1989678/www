$(document).ready(function() {
    //关注
    $(".top-follow").hover(function() {
        $(this).find(".follow-on").show();
    }, function() {
        $(this).find(".follow-on").hide();
    });
    $(".top-follow").one("mouseover", function() {
        if ($("#sina_anywhere_iframe").length == 0) {
            $("body").append('<script id="wbScript" src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js" type="text/javascript" charset="utf-8"></script>');
        }
    });
    //HEAD购物车
    $(".top-help").hover(function() {
        $(this).find(".hp-nav").show();
    }, function() {
        $(this).find(".hp-nav").hide();
    });
    //帮助
    $(".user-shoping").hover(function() {
        $(this).find(".cart-list").show();
    }, function() {
        $(this).find(".cart-list").hide();
    });
    //搜索提示
    var defaultKeyword = "输入关键字";
    var footKeyword = "输入邮箱或手机";
    var $headSch = $(".search-area .sch-key");
    var $footRss = $(".rss-box .tx-ipt");
    $headSch.focus(function() {
        if ($headSch.val() == defaultKeyword) {
            $headSch.val("");
        }
    });
    $headSch.blur(function() {
        if ($headSch.val() == "") {
            $headSch.val(defaultKeyword);
        }
    });
    $footRss.focus(function() {
        if ($footRss.val() == footKeyword) {
            $footRss.val("");
        }
    });
    $footRss.blur(function() {
        if ($footRss.val() == "") {
            $footRss.val(footKeyword);
        }
    });
    //商品分类
    $(".sort-nav ul li").hover(function() {
        $(this).addClass("current").find(".sub-sort").show();
    }, function() {
        $(this).removeClass("current").find(".sub-sort").hide();
    });
    //TABS
    jQuery.jqtabs = function(tabTit, on, tabCon, event) {
        $(tabCon).each(function() {
            $(this).children().hide();
            $(this).children().eq(0).show();
        });
        $(tabTit).each(function() {
            $(this).children().eq(0).addClass(on);
        });
        $(tabTit).children().bind(event, function() {
            $(this).addClass(on).siblings().removeClass(on);
            var index = $(tabTit).children().index(this);
            $(tabCon).children().eq(index).show().siblings().hide();
            return false;
        });
    };
    $.jqtabs(".star-tabs", "active", ".star-area", "hover");
    //明星单品
    $.jqtabs(".sct-tabs", "active", ".sc-info", "hover");
    //1F
    $.jqtabs(".bind-tit", "active", ".bind-info", "click");
	//积分商城
	$.jqtabs(".inte-tabs", "active", ".inte-cont", "hover");
    //列表页排序按钮样式
    $(".fo-rank li").click(function() {
        $(this).addClass("curr").siblings().removeClass("curr rise down");
    });
    $(".fo-rank li .jg").click(function() {
        if ($(this).parent().hasClass("rise")) {
            $(this).parent().removeClass("rise").addClass("curr down");
        } else {
            $(this).parent().addClass("curr rise").removeClass("down");
        }
    });
    //登录/注册/绑定输入框焦点样式
    $(".focus-bd .tx-ipt").focus(function() {
        $(this).addClass("focus");
        $(this).parent().find(".hint").show();
        if ($(this).parent().find("label.fieldError").is(":visible") == false) {
            $(this).parent().find(".hint").show();
        } else {
            $(this).parent().find(".hint").hide();
        }
    });
    $(".focus-bd .tx-ipt").blur(function() {
        $(this).removeClass("focus");
        $(this).parent().find(".hint").hide();
    });
    $(".favor-phone").hover(function() {
        $(this).find(".qrcode").fadeIn(100);
    }, function() {
        $(this).find(".qrcode").fadeOut(100);
    });
    //注册协议弹窗关闭
    $(".agree-btn input").click(function() {
        $(this).parent().parent().hide();
        $(".mask-layer").fadeOut(50);
    });
    //加入购物车的数量
    if ($(".quantity").val() <= 1) {
        $("#decrease").addClass("disabled");
    }
    $(".quantity").bind("keyup", function() {
        var buyNumObj = $(".quantity"), buyNumber = parseInt(buyNumObj.val(), 10), perNumber = parseInt($(".quantity").attr("max"), 10), perMinNumber = parseInt($(".quantity").attr("min"), 10), reg = /^[1-9]\d{0,3}$/, defaultBuyNum = 1;
        if (reg.test(buyNumber)) {
            if (buyNumber < perMinNumber) {
                buyNumber = perMinNumber;
                alert("您最少购买" + perMinNumber + "件！");
            } else if (buyNumber > perNumber) {
                buyNumber = perNumber;
                alert("您最多可以购买" + perNumber + "件！");
            }
            buyNumObj.val(buyNumber);
        } else {
            buyNumObj.val(defaultBuyNum);
        }
        return false;
    });
    //增加
    $("#increase").click(function() {
        var buyNumObj = $(".quantity"), buyNumber = parseInt(buyNumObj.val(), 10), perNumber = parseInt($(".quantity").attr("max"), 10), reg = /^[1-9]\d{0,3}$/, defaultBuyNum = 1;
        if (reg.test(buyNumber)) {
            if (buyNumber + 1 > perNumber) {
                buyNumber = perNumber;
                $(this).addClass("disabled");
                alert("您最多可以购买" + perNumber + "件！");
            } else {
                buyNumber++;
                $("#decrease").removeClass("disabled");
            }
            buyNumObj.val(buyNumber);
        } else {
            buyNumObj.val(defaultBuyNum);
        }
        return false;
    });
    //减少
    $("#decrease").click(function() {
        var buyNumObj = $(".quantity"), buyNumber = parseInt(buyNumObj.val(), 10), perMinNumber = parseInt($(".quantity").attr("min"), 10), reg = /^[1-9]\d{0,3}$/, defaultBuyNum = 1;
        if (reg.test(buyNumber)) {
            if (buyNumber > perMinNumber) {
                buyNumber--;
                buyNumObj.val(buyNumber);
                $("#increase").removeClass("disabled");
            }
            if (buyNumber <= perMinNumber) {
                $(this).addClass("disabled");
            }
        } else {
            buyNumObj.val(defaultBuyNum);
        }
        return false;
    });
    //赠品&优惠信息
    $("div.pim .dd .fold").click(function() {
        $(this).toggleClass("hide");
        $(this).parent().find(".gift-list").toggle(50);
        $(this).parent().find(".fav-info").toggleClass("hone");
        if ($(this).hasClass("hide")) {
            $(this).text("展开");
        } else {
            $(this).text("收起");
        }
    });
    //商品详细介绍TAB
    $("#intro_tabs li .js").click(function() {
        $(this).parents(".intro-tit").next(".intro-area").find(".intro-item").show();
        $(this).parent().addClass("active").siblings().removeClass("active");
    });
    $("#intro_tabs li .pj").click(function() {
        $(this).parents(".intro-tit").next(".intro-area").find(".intro-item").show();
        $(this).parents(".intro-tit").next(".intro-area").find(".intr,.know,.serve").hide();
        $(this).parent().addClass("active").siblings().removeClass("active");
    });
	$(".primary .all-comment-num").click(function() {
		var allCommNum = "#intro_tabs li .pj"
        $(allCommNum).parents(".intro-tit").next(".intro-area").find(".intro-item").show();
        $(allCommNum).parents(".intro-tit").next(".intro-area").find(".intr,.know,.serve").hide();
        $(allCommNum).parent().addClass("active").siblings().removeClass("active");
    });
    $("#intro_tabs li .wd").click(function() {
        $(this).parents(".intro-tit").next(".intro-area").find(".intro-item").show();
        $(this).parents(".intro-tit").next(".intro-area").find(".intr,.comm,.know,.serve").hide();
        $(this).parent().addClass("active").siblings().removeClass("active");
    });
    $("#intro_tabs li .xz").click(function() {
        $(this).parents(".intro-tit").next(".intro-area").find(".intro-item").show();
        $(this).parents(".intro-tit").next(".intro-area").find(".intr,.serve").hide();
        $(this).parent().addClass("active").siblings().removeClass("active");
    });
    $("#intro_tabs li .fw").click(function() {
        $(this).parents(".intro-tit").next(".intro-area").find(".intro-item").show();
        $(this).parents(".intro-tit").next(".intro-area").find(".intr,.know").hide();
        $(this).parent().addClass("active").siblings().removeClass("active");
    });
    //商品详细页FIXED
    $("#intro_top").find(".intro-tit").topSuction({
        fixCls:"int-fixed"
    });
    //左侧F菜单
    $(window).scroll(function() {
        var wh = $(window).height(), Froll = $(window).scrollTop(), Grow = 680;
        if (Froll > Grow) {
            $(".floor-nav").fadeIn();
        } else {
            $(".floor-nav").fadeOut();
        }
        if ($.browser.msie && $.browser.version <= 6) {
            $(".floor-nav").css("top", wh - 290 - 30 + $(window).scrollTop() + "px");
        }
    });
    $(".floor-nav ul li a").click(function(event) {
        var floor = this.rel;
        var id = "#" + floor;
        $("html,body").animate({
            scrollTop:$(id).offset().top
        }, 600);
    });
    //右侧固定菜单
    $(".right-navbar ul li").hover(function() {
        $(this).find(".hvr>span").show();
        $(this).find(".cust").stop().fadeIn();
        $(this).find(".hvr").stop().animate({
            width:"125px"
        }, 100);
    }, function() {
        $(this).find(".hvr>span").hide();
        $(this).find(".cust").stop().fadeOut();
        $(this).find(".hvr").stop().animate({
            width:"35px"
        }, 100);
    });
    //返回顶部
    $(".right-navbar ul .goback").click(function() {
        $("body,html").animate({
            scrollTop:0
        }, 1e3);
        return false;
    });
    //新浪微博秀
    $("#lppzWeiboShow").wbShow({
        addHtml:'<iframe width="390" height="300" class="share_self"  frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php?language=&width=390&height=320&fansRow=2&ptype=1&speed=0&skin=1&isTitle=0&noborder=1&isWeibo=1&isFans=0&uid=1851770484&verifier=c6fd2b80&dpc=1"></iframe>',
        findCls:"iframe.share_self"
    });
    //底部加关注显示
    $("#weiBoAttention").wbShow({
        addHtml:'<script id="wbScript" src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js" type="text/javascript" charset="utf-8"></script>',
        findCls:"iframe"
    });
	/* 团购列表 */
	$(".group-list li").hover(function(){
		$(this).addClass("hover").find(".add-buy-btn").show();
	},function(){
		$(this).removeClass("hover").find(".add-buy-btn").hide();
	})
	/* 积分商品 */
	$(".inte-list li").hover(function(){
		$(this).addClass("hover").find(".add-cart-btn").show();
	},function(){
		$(this).removeClass("hover").find(".add-cart-btn").hide();
	})
	/* 兑换优惠券 */
	$(".hot-cpn-list ul li").hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});
	$(".inte-cpn-list ul li").hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});
	/* MSG弹层关闭 */
	$(".msg-popups .shut-btn").click(function(){
		msgPopusClose();
	});
	// 商品组合
	$("#suitListWrap").css({"width":($("#suitListWrap li").width()+50)*$("#suitListWrap li").length});
	$("#suitListWrap li:last-child").addClass("sl-last")
});

//商品详情图片控制
jQuery(window).load(function() {
    var maxwidth = 700;
    $(".description img").each(function() {
        if ($(this).width() > maxwidth) {
            autoheight = $(this).height() * (maxwidth / $(this).width());
            $(this).width(maxwidth);
            $(this).height(autoheight);
        }
    });
});

//滚动显示
$.fn.wbShow = function(option) {
    option = option || {};
    var addHtml = option.addHtml || "";
    var findCls = option.findCls || "";
    var $self = this, $win = $(window);
    if (!$self.length) return;
    var offset = $self.offset(), fTop = offset.top - $win.height();
    var onShow = true;
    $win.scroll(function() {
        var dTop = $(document).scrollTop();
        if (fTop < dTop) {
            if ($self.find(findCls).length == 0) {
                if (onShow) {
                    $self.append(addHtml);
                    onShow = false;
                }
            }
        } else {}
        return false;
    });
};

//滚动显示执行
$.fn.wbExecute = function(option) {
    option = option || {};
    var exeFun = option.exeFun || new Function();
    var $self = this, $win = $(window);
    if (!$self.length) return;
    var offset = $self.offset(), fTop = offset.top - $win.height();
    $win.scroll(function() {
        var dTop = $(document).scrollTop();
        if (fTop < dTop) {
            if (!$self.hasExecute) {
                $self.hasExecute = true;
                exeFun.call();
            }
        } else {}
        return false;
    });
};

//定位
$.fn.topSuction = function(option) {
    option = option || {};
    var fixCls = option.fixCls || "fixed";
    var fixedFunc = option.fixedFunc;
    var resetFunc = option.resetFunc;
    var $self = this;
    var $win = $(window);
    if (!$self.length) return;
    var offset = $self.offset();
    var fTop = offset.top;
    var fLeft = offset.left;
    // 暂存
    $self.data("def", offset);
    $win.resize(function() {
        $self.data("def", $self.offset());
    });
    $win.scroll(function() {
        var dTop = $(document).scrollTop();
        if (fTop < dTop) {
            $self.addClass(fixCls);
            $("#intro_tabs li a").attr("href", "#intro_top");
            if (fixedFunc) {
                fixedFunc.call($self, fTop);
            }
        } else {
            $self.removeClass(fixCls);
            $("#intro_tabs li a").attr("href", "javascript:;");
            if (resetFunc) {
                resetFunc.call($self, fTop);
            }
        }
    });
};

//弹出窗口
function hasUp(obj) {
    var _x = ($(window).width() - $(obj).outerWidth()) / 2;
    var _y = ($(window).height() - $(obj).outerHeight()) / 2 + $(document).scrollTop();
    if ($(obj).size() > 0) {
        $(obj).css({
            left:_x,
            top:_y
        }).show();
        $(obj).focus();
        $("body").append('<div class="mask-layer"></div>');
    }
};

function msgPopusClose(){
	$(".msg-popups").hide();
	$(".mask-layer").remove();
};

function cueUp(obj) {
    var _x = ($(window).width() - $(obj).outerWidth()) / 2;
    var _y = ($(window).height() - $(obj).outerHeight()) / 2 + $(document).scrollTop();
    if ($(obj).size() > 0) {
        $(obj).css({
            left:_x,
            top:_y
        }).show();
        $(obj).focus();
    }
};

//倒计时函数
function updateEndTime(type)
{
 var date = new Date();
 var time = date.getTime();  //当前时间距1970年1月1日之间的毫秒数
 $(".end-time").each(function(i){
 var endDate =this.getAttribute("endTime"); //结束时间字符串
 //转换为时间日期类型
 var endDate1 = eval('new Date(' + endDate.replace(/\d+(?=-[^-]+$)/, function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
 var endTime = endDate1.getTime(); //结束时间毫秒数
 var lag = (endTime - time) / 1000; //当前时间和结束时间之间的秒数
 var mst = endTime -time;
  if(lag > 0)
  {
   var second = Math.floor(lag % 60);    
   var minite = Math.floor((lag / 60) % 60);
   var hour = Math.floor((lag / 3600) % 24);
   var day = Math.floor((lag / 3600) / 24);
   var ms = (parseInt(mst%1000).toString()).charAt(0);
   if (type == "1"){
	   if(day > 0){
			$(this).html('<span class="day">'+day+'</span>天<span class="hour">'+hour+'</span>时<span class="minite">'+minite+'</span>分<span class="second">'+second+"."+ms+'</span>秒');
	   }else{
			$(this).html('<span class="hour">'+hour+'</span>时<span class="minite">'+minite+'</span>分<span class="second">'+second+"."+ms+'</span>秒');
	   };
   }else if(type == "2"){
	   if(day > 0){
			$(this).html('<span class="day">'+day+'</span>天<span class="hour">'+hour+'</span>时<span class="minite">'+minite+'</span>分<span class="second">'+second+'</span>秒');
	   }else{
			$(this).html('<span class="hour">'+hour+'</span>时<span class="minite">'+minite+'</span>分<span class="second">'+second+'</span>秒');
	   };
   }
  }else{
   $(this).html("团购已经结束啦！");
   }
 });
 if (type == "1"){//显示毫秒
	setTimeout('updateEndTime(1)',100);
 }else if(type == "2"){
	setTimeout('updateEndTime(2)',1000);
 }
}
//开始&结束时间倒计时
function startToEndTime(type)
{
 var date = new Date();
 var time = date.getTime();  //当前时间距1970年1月1日之间的毫秒数
 $(".start-end-time").each(function(i){
 var endDate =this.getAttribute("endTime"); //结束时间字符串
 var startDate =this.getAttribute("startTime"); //结束时间字符串
 //转换为时间日期类型
 var endDate1 = eval('new Date(' + endDate.replace(/\d+(?=-[^-]+$)/, function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
 var startDate1 = eval('new Date(' + startDate.replace(/\d+(?=-[^-]+$)/, function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
 var endTime = endDate1.getTime(); //结束时间毫秒数
 var startTime = startDate1.getTime(); //开始时间毫秒数
 var lag = (endTime - time) / 1000; //当前时间和结束时间之间的秒数
 var ahead = (startTime - time) / 1000; //当前时间和开始时间之间的秒数
 var mst = endTime -time;
  if(ahead < 0 && lag > 0)
  {
   var second = Math.floor(lag % 60);    
   var minite = Math.floor((lag / 60) % 60);
   var hour = Math.floor((lag / 3600) % 24);
   var day = Math.floor((lag / 3600) / 24);
   var ms = (parseInt(mst%1000).toString()).charAt(0);
   if (type == "1"){
	   if(day > 0){
			$(this).html('<span class="day">'+day+'</span>天<span class="hour">'+hour+'</span>时<span class="minite">'+minite+'</span>分<span class="second">'+second+"."+ms+'</span>秒');
	   }else{
			$(this).html('<span class="hour">'+hour+'</span>时<span class="minite">'+minite+'</span>分<span class="second">'+second+"."+ms+'</span>秒');
	   };
   }else if(type == "2"){
	   if(day > 0){
			$(this).html('<span class="day">'+day+'</span>天<span class="hour">'+hour+'</span>时<span class="minite">'+minite+'</span>分<span class="second">'+second+'</span>秒');
	   }else{
			$(this).html('<span class="hour">'+hour+'</span>时<span class="minite">'+minite+'</span>分<span class="second">'+second+'</span>秒');
	   };
   }
  }else if(ahead > 0){
	$(this).html("即将于"+startDate+"开始");
  }else{
	$(this).html("团购已经结束啦！");
   }
 });
 if (type == "1"){//显示毫秒
	setTimeout('startToEndTime(1)',100);
 }else if(type == "2"){
	setTimeout('startToEndTime(2)',1000);
 }
}