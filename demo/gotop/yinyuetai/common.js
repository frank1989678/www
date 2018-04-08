/* 返回顶部 
.ui-return-top{position:fixed;right:0;top:0;display:none;width:50px;height:65px;overflow:hidden;z-index:19;}
.ui-return-top .el{position:absolute;top:0;left:0;width:50px;height:65px;background-image:url(../images/returntop.png);}
*/
(function($, window) {
var isIE6 = !-[1,] && !window.XMLHttpRequest;

function throttle(e, t, n) {
	var r, i, s, o = null,
	u = 0;
	n || (n = {});
	var a = function() {
		u = n.leading === !1 ? 0 : new Date,
		o = null,
		s = e.apply(r, i)
	};
	return function() {
		var f = new Date;
		u || n.leading !== !1 || (u = f);
		var l = t - (f - u);
		return r = this,
		i = arguments,
		0 >= l ? (clearTimeout(o), o = null, u = f, s = e.apply(r, i)) : o || n.trailing === !1 || (o = setTimeout(a, l)),
		s
	}
}
function ReturnTop() {
    this.wrap 	= $('<div class="ui-return-top"></div>'); 
    this.el 	= $('<a href="javascript:;" title="返回顶部" class="el"></a>'); 
    this.bottom = 100; 
    this.speed  = 800; 
    this.win 	= $(window); 
    this.doc 	= $(document); 
    this.init();
}
ReturnTop.prototype = {
    init: function() {
    	var e = this;
    	this.wrap.append(this.el);
    	this.doc.ready(function() {
            e.wrap.appendTo(document.body);
            e.position().bindEvent().scrollEvent();
        }); 
        return this;
    },
    bindEvent: function() {
        var e = this,
            t = throttle(e.scrollEvent, 400),
            n = throttle(e.resizeEvent, 400);

        this.win.scroll(function() {
            t.call(e);
        });

        this.win.resize(function() {
            n.call(e);
        });

        this.wrap.click(function(t) {
            if (e.isRunning) {
            	return e;
            }
            e.isRunning = true;

            $("html, body").animate({
                scrollTop: 0
            }, e.speed);

            e.wrap.animate({
                top: "-" + e.wrap.innerHeight()
            }, e.speed, function() {
                e.isRunning = false;
            }); 
        })
        return this;
    },
    position: function() {
    	var domTxt	= '(document.documentElement)',
    		cssText = 'position:absolute;right:0;top:expression('
					+ domTxt + '.scrollTop + ' + domTxt + '.clientHeight - this.offsetHeight - ' + this.bottom + ');';
		if (!isIE6) {
			cssText = "position:fixed;right:0;";
		}
    	this.wrap.attr({"style" : cssText});
    	return this;
    },
    scrollEvent: function() {
        var t = this.win.scrollTop(),
            h = document.documentElement.clientHeight,
            n = h - this.wrap.innerHeight() - this.bottom,
            e = this;
        if (e.isRunning) {
        	return e;
        }
        t >= h ? isIE6 ? this.wrap.show() : this.hasShow || (this.wrap.css({
            top: h
        }).show().animate({
            top: n
        }, 600), this.hasShow = !0) : (this.wrap.hide(), this.hasShow = !1);
        return this;
    },
    resizeEvent: function() {
        var e = this.win.scrollTop(),
            t = document.documentElement.clientHeight,
            n = t - this.wrap.innerHeight() - this.bottom;
        if (e < t) return;
        this.wrap.css({
            top: isIE6 ? e + n : n
        })
    }
}
new ReturnTop();
}(jQuery, window));