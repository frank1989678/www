var flag = !0;
var $toTop = $(".ui-return-top"), $win=$(window);
var a_h = $toTop.height();
var a_btm = 150;   
var act_h = 250; 
$toTop.css("bottom",-a_h); 

var f1 = function(){
    $toTop.css({"bottom" : -a_h});
    flag = !0;
}
var f2 = function(){
    $win.off("scroll resize",scrollFun);
    $toTop.animate({"bottom":a_btm},400,function(){
        flag = !1;
        $toTop.css({"bottom":a_btm});
        $win.on("scroll resize",scrollFun);
        if($win.scrollTop()<act_h) f1();
    });
}

////滚动条滚动事件
scrollFun = function(){
    if($win.scrollTop()<act_h) f1();
    else if(flag) f2();
}

$win.on("scroll resize",scrollFun);
$toTop.click(function(){
        $win.off("scroll resize",scrollFun);  //解绑scrollFun
        $toTop.stop().animate({bottom:$win.height()},500,function(){
            $win.on("scroll resize",scrollFun);  //重绑scrollFun
        });
        $('body,html').stop().animate({scrollTop:0},500);
})