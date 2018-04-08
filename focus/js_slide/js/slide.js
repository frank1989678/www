// slide===================>5行
// rollNews================>210行


// 幻灯片===========================================================================================>
;(function(window, undefined) {
var $ = function(id) {
	return document.getElementById(id);
}

var $$ = function(tag, obj) {
	return (typeof obj == 'object' ? obj: $(obj)).getElementsByTagName(tag);
}

/*! 幻灯片滚动切换
 **	@id[string]: 幻灯片的容器wrap 
 **	@speed[number]: 动画速度,数字越大，速度越慢。默认8, 最大20（无动画效果），最小1(此时无动画效果)
 **	@delay[number]: 自动播放时间间隔，默认5000。最大9秒，最小1秒
 **	@timeout[number]: 首次自动播放时延迟多久播放。
 **	@easing [string]: 动画播放效果，当前只有2中，切换(switch：默认)和渐变(opacity)。
 */
function Slide(setting) {
	if (!(this instanceof Slide)) {
		return new Slide(setting);	//强制使用new
	}
	var defaults = Slide.defaults;
	for (var i in defaults) {
		if(setting[i] === undefined) {
			setting[i] = defaults[i];
		}
	}
	this.init(setting.id, setting.speed, setting.delay, setting.timeout, setting.easing);
}

Slide.defaults = {
	speed: 8, 
	delay: 5000,
	timeout: 0,
	easing : "switch"
}

Slide.prototype = {
	init: function(id, speed, delay, timeout, easing) {
		this.wrap = $(id);
		this.ul = $$("ul", this.wrap)[0];	
		this.li = $$("li", this.wrap);
		this.width = this.wrap.clientWidth;
		this.size = this.li.length;	
		this.delay = delay && !isNaN(delay) && delay > 1 && delay < 10 ? delay * 1000 : 5000;	
		this.timeout = timeout && !isNaN(timeout) && timeout > 0 && timeout < 10 ? timeout * 1000 : 0;	
		this.speed = speed && !isNaN(speed) && speed >= 1 && speed <= 20 ? speed : 8;	
		this.easing = easing;
		this.index = 0;		
		this.ul.style.width = this.width * this.size + "px";
		this.li[this.index].style.zIndex = 2;
		this.fnDom();
		var _this = this;
		setTimeout(function() {
			_this.fnAutoPlay();
		}, this.timeout)
	},
	fnDom: function() {
		var _this = this;
		var mybtn = document.createElement('div')
		mybtn.className = 'mybtn';

		var a = $$('a', this.wrap),
			k = this.size,
			btnHtml = '',
			target = '_self';
		while (k-- > 0) {
			target = a[k].target || "_self";
			this.li[k].innerHTML += '<div><em></em><a target="' + target + '" href="' + a[k].href + '">' + (a[k].children[0].alt || '') + '</a></div>';

			btnHtml = '<em' + (k == 0 ? ' class="curr"' : '') + '>' + (k + 1) + '</em>' + btnHtml;
		}
		this.mytit = $$("div", this.ul);
		mybtn.innerHTML = btnHtml;
		this.wrap.appendChild(mybtn);
		this.mybtn = mybtn.children;
		this.height = this.mytit[0].clientHeight;
		mybtn.onmouseover = function(e) {
			var e = e || window.event;
			var elem = e.target || e.srcElement;
			while (elem) {
				if (elem.nodeName.toLowerCase() == "em") {
					clearInterval(_this.interval);
					_this.fnAnimate(parseInt(elem.innerHTML) - 1);
					return false;
				}
				elem = elem.parentNode;
			}
		}
		mybtn.onmouseout = function(e) {
			var e = e || window.event;
			var elem = e.target || e.srcElement;
			while (elem) {
				if (elem.nodeName.toLowerCase() == "em") {
					_this.fnAutoPlay();
					return false;
				}
				elem = elem.parentNode;
			}
		}
	},
	fnNextIndex: function() {
		return (this.index >= this.size - 1) ? 0 : this.index + 1;
	},
	fnAnimate: function(toIndex) {
		switch (this.easing) {
			case "opacity":
				this.fnOpacity(toIndex);
				break;

			case "switch":
			default: 
				this.fnSwitch(toIndex);
				break;
		}
	},
	fnSwitch:function(toIndex) {
		if (this.index == toIndex) return false;
		this.posX = this.width * this.index;
		this.endX = this.width * toIndex;	
		this.posY = this.height;
		this.endY = 0;
		this.mybtn[this.index].className = "";
		this.mybtn[toIndex].className = "curr";
		this.mytit[toIndex].style.bottom = -this.posY + "px";
		this.index = toIndex;
		this.fnPic();
	},
	fnPic: function() {
		var _this = this;
        this.timerAnim && window.clearTimeout(this.timerAnim);
        if (this.posX == this.endX) {
        	this.fnTit();
            return true;
        }
        this.posX += this.endX >= this.posX ? Math.ceil((this.endX - this.posX) / this.speed) : Math.floor((this.endX - this.posX) / this.speed);
        this.ul.style.left = -this.posX + "px";
        
        this.timerAnim = window.setTimeout(function(){_this.fnPic()}, 9);
    },
    fnTit: function() {
    	var _this = this;
		this.timerAnim && window.clearTimeout(this.timerAnim);
    	if (this.posY == this.endY) {
			return true;
		}		

		this.posY += this.endY >= this.posY ? Math.ceil((this.endY - this.posY) / this.speed) : Math.floor((this.endY - this.posY) / this.speed);
		this.mytit[this.index].style.bottom = -this.posY + "px";
		this.timerAnim = window.setTimeout(function(){_this.fnTit()}, 9);
    },
    fnOpacity: function(toIndex) {
    	this.start = 0;
		for (var i = 0; i < this.size; i++) {
		    this.li[i].style.cssText = "z-index:0";
		    this.mybtn[i].className = '';
		    this.mytit[i].style.display = "none";
		}
		this.li[this.index].style.zIndex = 2;
		this.li[toIndex].style.zIndex = 1;
		this.mybtn[toIndex].className = "curr";
		this.mytit[toIndex].style.display = "block";
		this.curLi = this.li[this.index];
		this.index = toIndex;
		this.fnGradual();
    },
    fnGradual: function() {
    	var _this = this;
        this.timerAnim && window.clearTimeout(this.timerAnim);
        if (this.start == 100) {
            this.curLi.style.opacity = this.start/100;
            this.curLi.style.filter = 'Alpha(Opacity=' + this.start + ')';
            this.curLi.style.zIndex = 0;
            return;
        }
		this.start += (100 - this.start)/this.speed;
		this.start = this.start > 0 ? Math.ceil(this.start) : Math.floor(this.start);
        this.curLi.style.opacity = (100-this.start)/100;
        this.curLi.style.filter = 'Alpha(Opacity=' + (100-this.start) + ')';
        this.timerAnim = window.setTimeout(function(){_this.fnGradual()}, 50);   	
    },
    fnAutoPlay: function() {
		var _this = this;
		this.interval = setInterval(function() {
			_this.fnAnimate(_this.fnNextIndex());
		}, this.delay);
	}
}

if (!window.FRANK) {
	window.FRANK = {};
}

window.FRANK.slide = Slide;

}(window));



// 新闻滚动 ====================================================================================================>
;(function(window, undefined) {
var $ = function(id) {
	return document.getElementById(id);
}

var $$ = function(tag, obj) {
	return (typeof obj == 'object' ? obj: $(obj)).getElementsByTagName(tag);
}

function Roll(id, num, delay) {
	if (!(this instanceof Roll)) {
		return new Roll(id, num, delay);	//强制使用new
	}
	this.init(id, num, delay);
}

Roll.prototype = {
	init: function(id, num, delay) {
		this.id = id;
		this.wrap = $(id);
		this.ul = $$("ul", this.wrap)[0];	
		this.num = num || 1;
		this.size = Math.ceil(this.ul.children.length/this.num);	
		this.delay = delay && !isNaN(delay) && delay > 1 && delay < 10 ? delay * 1000 : 5000;	
		this.index = 0;
		this.posX = 0;
		this.h = this.num * this.ul.children[0].clientHeight;
		this.fnBtn();
		this.fnAutoPlay();	
	},
	fnBtn: function() {
		var that = this;
		that.wrap.onclick = function(e) {
			var e = e || window.event;
			var elem = e.target || e.srcElement;
			while (elem) {
				if (elem.nodeName.toLowerCase() == "span") {
					that.fnSwitch(elem.parentNode.className == "up" ? 1 : -1);
					return false;
				}
				elem = elem.parentNode;
			}
		}
		that.wrap.onmouseover = function(e) {
			var e = e || window.event;
			var elem = e.target || e.srcElement;
			while (elem) {
				if (elem.id == that.id) {
					clearInterval(that.interval);
				}
				elem = elem.parentNode;
			}
		}
		that.wrap.onmouseout = function(e) {
			var e = e || window.event;
			var elem = e.target || e.srcElement;
			while (elem) {
				if (elem.id == that.id) {
					that.fnAutoPlay();
					return false;
				}
				elem = elem.parentNode;
			}
		}
	},
	fnNextIndex: function(k) {
		if (k == -1 && this.index == 0) {
			this.index = this.size - 1;
		} else if(this.index == this.size - 1 && k == 1) {
			this.index = 0;
		} else {
			this.index += k;
		}
	},
	fnSwitch:function(k) {
		this.posX = this.h * this.index;
		this.fnNextIndex(k);
		this.endX = this.h * this.index;
		this.fnAnim();
	},
	fnAnim: function() {
		var that = this;
        if (that.timerAnim) {
            window.clearTimeout(that.timerAnim);
        }
        if (that.posX == that.endX) {
            return;
        }
        that.posX += that.endX >= that.posX ? Math.ceil((that.endX - that.posX) / 10) : Math.floor((that.endX - that.posX) / 10);
        that.ul.style.top = -that.posX + "px";
        that.timerAnim = window.setTimeout(function(){that.fnAnim()}, 50);
    },
	fnAutoPlay: function() {
		var that = this;
		that.interval = setInterval(function() {
			that.fnSwitch(1);
		}, that.delay);
	}
}

if (!window.FRANK) {
	window.FRANK = {};
}

window.FRANK.roll = Roll;
}(window));



// 手风琴 ====================================================================================================>
;(function(window, undefined){
function $(id) {
	return document.getElementById(id);
}

function $$(tag, obj) {
	return (typeof obj == 'object' ? obj: $(obj)).getElementsByTagName(tag);
}

// setting img object opacity 
function setOpacity(obj,o) {
	if (obj.filters) obj.filters.alpha.opacity = Math.round(o);
	else obj.style.opacity = o / 100;
}


/*! 手风琴幻灯片
 **	@id[string]: 幻灯片的容器wrap 
 **	@speed[number]: 动画速度,数字越大，速度越慢。默认8, 最大20（无动画效果），最小1(此时无动画效果)
 **	@top[number]: 标题、遮罩的top值
 **	@opacity[number]: 首图片的透明度
 */
function Accordion(setting) {
	if (!(this instanceof Accordion)) {
		return new Accordion(setting);	//强制使用new
	}
	var defaults = Accordion.defaults;
	for (var i in defaults) {
		if(setting[i] === undefined) {
			setting[i] = defaults[i];
		}
	}
	this.init(setting.id, setting.speed, setting.top, setting.opacity);
}

Accordion.defaults = {
	speed: 12, 
	top: 147, 
	opacity: 70 
}

Accordion.prototype = {
	init: function(id, speed, top, oP) {
		this.over   = false;
		this.slides = [];
		this.speed  = speed && !isNaN(speed) && speed >= 1 && speed <= 20 ? speed : 8; 
		this.oP     = oP && !isNaN(oP) && oP >= 10 && oP <= 100 ? oP : 70; 
		this.top    = top && !isNaN(top) ? top : 0; 
		this.wrap   = $(id); //容器
		this.li     = $$("li", this.wrap); //容器内的子元素
		this.size   = this.li.length; //子元素个数
		this.wh     = this.wrap.clientWidth; //容器宽
		this.ht     = this.wrap.clientHeight; //容器高
		this.wr     = this.li[0].clientWidth; //容器内第一个子元素宽
		this.mx     = this.wh/this.size; //横向比例
		this.mz     = (this.wh - this.wr) / (this.size - 1);
		for (var i = 0; i < this.size; i++) {
			this.slides[i] = new Animate(this, i);
		}
		this.view   = this.slides[0];
		/* ==== on mouseout event ==== */
		var _this   = this;
		this.wrap.onmouseout = function() {
			_this.mouseout();
			return false;
		}	
	},
	run: function() {
		var i = this.size;
		while (i--) {
			this.slides[i].anim();
			this.slides[i].tit();
		}	
	},
	mouseout: function() {
		this.over = false;
		setOpacity(this.view.img, this.oP);
	}
}

function Animate(parent, N) {
	this.parent = parent;
	this.N 		= N;
	this.speed  = parent.speed;
	this.obj    = parent.li[N]; //容器内的子元素
	this.txt    = $$("span", this.obj)[0];
	this.img    = $$("img", this.obj)[0];		
	this.posX = 0; //(N == 0 ? N : (N-1)) * parent.mx;
	this.endX = N * parent.mx;	
	this.posY = parent.ht;
	this.endY = parent.ht;
	this.bkg  = document.createElement("em"); //遮罩
	this.obj.insertBefore(this.bkg, this.txt);
	if (N == 0) {
		this.obj.style.borderLeft = '0';
	}	

	this.anim();	
	setOpacity(this.img, parent.oP);

	/* ==== mouse events ==== */
	this.obj.parent = this;
	this.obj.onmouseover = function() {
		this.parent.over();
	}
	this.obj.onmouseout = function() {
		this.parent.out();
	}
}

Animate.prototype = {
	/* ==== target positions ==== */
	calc : function() {
		var that = this.parent;
		// left slides
		for (var i = 0; i <= this.N; i++) {
			that.slides[i].endX = i * that.mz;
		}

		// right slides
		for (var i = this.N + 1; i < that.size; i++) {
			that.slides[i].endX = that.wr + (this.N - 1) * that.mz + (i-this.N) * that.mz;
		}
		that.run();
	},
	out: function() {
		this.endY = this.parent.ht
		var that = this.parent;
		for (var i = 0; i < that.size; i++) {
			that.slides[i].endX = i * that.mx;
		}
		this.timerAnim2 && window.clearTimeout(this.timerAnim2);  
		this.timerAnim2 = window.setTimeout(function(){that.run()}, 16); //防止在元素上切换时的抖动效果
	},
	over : function() {
		this.endY = this.parent.top;
		this.parent.over = true;
		this.parent.view = this;
		this.calc();
		setOpacity(this.img, 100);
	},
	anim: function() {
        var _this = this;
        this.timerAnim && window.clearTimeout(this.timerAnim);     
        if (this.posX == this.endX) {
            return;
        }
        this.posX += this.endX >= this.posX ? Math.ceil((this.endX - this.posX) / this.speed) : Math.floor((this.endX - this.posX) / this.speed);
        this.obj.style.left = this.posX + "px";
        this.timerAnim = window.setTimeout(function(){_this.anim()}, 16);
	},
	tit: function() {
		var _this = this;
		this.timerTit && window.clearTimeout(this.timerTit);
    	if (this.posY == this.endY) {
			return true;
		}		
		this.posY += this.endY >= this.posY ? Math.ceil((this.endY - this.posY) / this.speed) : Math.floor((this.endY - this.posY) / this.speed);
		this.bkg.style.top = this.txt.style.top = this.posY + "px";
		this.timerTit = window.setTimeout(function(){_this.tit()}, 16);
	}
}


if (!window.FRANK) {
	window.FRANK = {};
}

window.FRANK.accordion = Accordion;
}(window));
