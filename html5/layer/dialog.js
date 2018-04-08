;!function(win){

"use strict";

var doc = document, 
	query = 'querySelectorAll', 
	claname = 'getElementsByClassName', 
	S = function(s){
	  return doc[query](s);
	};

var fx = {
	timer: {},
	extend: function(a, b) {
		b = b || {};
		for (var i in a) {
			if (!b[i]) {
				b[i] = a[i];
			}
		}
		return b;
	},
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.deleteEvent) {
            element.deleteEvent("on" + type, handler);
        } 
    },
	touch: function(elem, fn) {
		elem.addEventListener('click', function(e) {
			fn.call(this, e);
		}, false);
	},
	addClass: function(el, className) {
		if (el.classList) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	},
	removeClass: function(el, className) {
		if (el.classList) {
			el.classList.remove(className);
		} else {
			el.className -= ' ' + className;
		}
	}
}


var dom 		= {},
	idx 		= 1,
	_zIndex 	= 19890607;

var defaults = {
	className: 'dialog',
	content: '<div></div>',		// 消息内容
	title: '\u6d88\u606f',		// 标题. 默认'消息'
	yesFn: null,				// 确定按钮回调函数
	yes: '\u786E\u5B9A',		// 确定按钮文本. 默认'确定'，传入null不显示
	onFn: null,					// 取消按钮回调函数
	no: '\u53D6\u6D88',			// 取消按钮文本. 默认'取消', 传入null不显示
	width: 320,					// 内容宽度
	time: null,					// 自动关闭时间
	lock: true,				    // 是否锁屏
	shadeClose: false,		 	// 点击遮罩关闭
	background: '#000',			// 遮罩颜色
	opacity: .7,				// 遮罩透明度
	duration: 300,				// 遮罩透明度渐变动画速度
	fixed: true					// 是否静止定位
};



//默认配置
var defaults2 = {
	type: 0
	,shade: true
	,shadeClose: true
	,fixed: true
	,anim: 'scale' //默认动画类型
};

function Dialog(options) {
	if (!(this instanceof Dialog)) {
		return new Dialog(options);
	} else {
		this.opts = fx.extend(defaults, options);
		this.id = idx++;	
		return this.init();	
	}
}

Dialog.prototype = {
	init: function() {
		this.view();
		this.lock();
		// fx.addClass(doc.body, 'dialog-lock');
	},
	view: function () {
		var opts = this.opts,
			templete = [];

		var layerbox = doc.createElement('div');
		layerbox.id = 'dialog' + this.id;
		layerbox.className = opts.className;
		templete.push(opts.lock ? '<div class="dialog-shade" style="background:' + opts.background + ';opacity:' + opts.opacity +';"><\/div>' : '');
		templete.push('<div class="dialog-main">');
		templete.push(opts.title ? '<div class="dialog-title">' + opts.title + '<\/div>' : '');
		templete.push('<div class="dialog-content">' + opts.content  + '<\/div>');
		templete.push('<div class="dialog-button">');
		templete.push(opts.no  ? '<span class="dbtn no">'  + opts.no  + '<\/span>' : '');
		templete.push(opts.yes ? '<span class="dbtn yes">' + opts.yes + '<\/span>' : '');
		templete.push('</div>');
		templete.push('<div class="dialog-close"><\/div>');
		templete.push('</div>');
		layerbox.innerHTML = templete.join('');
		document.body.appendChild(layerbox);

		this.dom = {};
		this.dom.el = S('#dialog' + this.id)[0];
		this.dom.shade = this.dom.el.getElementsByClassName('dialog-shade')[0];
		this.dom.close = this.dom.el.getElementsByClassName('dialog-close')[0];
		this.dom.no = this.dom.el.getElementsByClassName('no')[0];
		this.dom.yes = this.dom.el.getElementsByClassName('yes')[0];

		this.position();
  		this.action();
		return this;
	},
	position: function() {
	},
	action: function() {
		var that = this;
		var opts = this.opts;
		//自动关闭
		if (opts.time) {
			fx.timer[that.id] = setTimeout(function() {
				layer.close(that.id);
			}, opts.time * 1e3);
		}

		if (opts.yes) {
			that.dom.yes.addEventListener('click', function(e) {
				opts.yesFn ? opts.yesFn.call(that) : that.close();
			}, false);
		}
		if (opts.no) {
			that.dom.no.addEventListener('click', function(e) {
				opts.noFn && opts.noFn();
				that.close();
			}, false);
		}

		this.dom.close.addEventListener('click', function(e) {
			that.close();
		}, false);

		//点遮罩关闭
		if (opts.lock && opts.shadeClose) {
			that.dom.shade.addEventListener('click', function(e) {
				that.close();
			}, false);
		}
	},
	lock: function() {
		// 禁止滚动
		if (this.opts.lock) {
			this.dom.el.addEventListener('touchmove', function(e) {
				e.preventDefault();
				e.stopPropagation();
			})
			fx.addClass(doc.body, 'dialog-lock');
		}
	},
	close: function() {
	    var ibox = S('#dialog'+this.id)[0];
	    if(!ibox) return;
	    ibox.innerHTML = '';
	    doc.body.removeChild(ibox);
	    clearTimeout(fx.timer[this.id]);
	    delete fx.timer[this.id];
	    fx.removeClass(doc.body, 'dialog-lock');
	},
	mask: function() {

	}
}

win.dialog = Dialog;

}(window);