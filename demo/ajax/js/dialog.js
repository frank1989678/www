;(function($, window){
var defaults = {
								// 消息内容
	content: '<div class="ui-dialog-loading"><span>loading..</span></div>',
	title: '\u6d88\u606f',		// 标题. 默认'消息'
	ok: null,			// 确定按钮回调函数,传入false时不显示
	cancel: null,		// 取消按钮回调函数,传入false时不显示
	okVal: '\u786E\u5B9A',		// 确定按钮文本. 默认'确定'
	cancelVal: '\u53D6\u6D88',	// 取消按钮文本. 默认'取消'
	width: 'auto',				// 内容宽度
	padding: '25px 25px 0',		// 内容与边界填充距离
	skin: '',					// 皮肤名(预留接口,尚未实现)
	icon: null,					// 消息图标名称
	time: null,					// 自动关闭时间
	esc: false,					// 是否支持Esc键关闭
	follow: null,				// 跟随某元素(即让对话框在元素附近弹出)
	lock: true,				    // 是否锁屏
	background: '#000',			// 遮罩颜色
	opacity: .7,				// 遮罩透明度
	duration: 300,				// 遮罩透明度渐变动画速度
	fixed: true,				// 是否静止定位
	drag: true					// 是否允许用户拖动位置
	
};

var template =
'<div class="ui-dialog">'
+	'<table class="ui-dialog-inner">'
+		'<tbody>'
+			'<tr>'
+				'<td>'
+					'<div class="ui-dialog-header">'
+						'<p class="ui-dialog-close" title="\u5173\u95ED">\u5173\u95ED</p>'
+						'<h4 class="ui-dialog-title">[tit]</h4>'
+					'</div>'
+					'<div class="ui-dialog-main">'
+						'<div class="ui-dialog-icon"></div>'
+						'<div class="ui-dialog-content"></div>'
+					'</div>'
+					'<div class="ui-dialog-footer">'
+						'<div class="ui-dialog-buttons">'
+							'<button type="button" class="ui-dialog-submit">确定</button>'
+							'<button type="button" class="ui-dialog-cancel">取消</button>'
+						'</div>'
+					'</div>'
+				'</td>'
+			'</tr>'
+		'</tbody>'
+	'</table>'
+'</div>';

var dom 		= {},
	count 		= 1,
	_$window    = $(window),
	_$document  = $(document),
	_$html 		= $('html'),
	_elem 		= document.documentElement,
	_isIE6		= window.VBArray && !window.XMLHttpRequest,
	_zIndex 	= 198967,
	api 		= null;

// 开启IE6 CSS背景图片缓存
_isIE6 && document.execCommand('BackgroundImageCache', false, true);

function Dialog(config) {
	if (config.id === (dom[config.id] || 0)) {
		return false;
	} else if (!(this instanceof Dialog)) {
		return new Dialog(config);
	} else {
		this.config = config && $.extend({}, defaults, config) || defaults;	

		if (!this.config.id) {
			this.config.id = new Date().getTime() + "_" + count;	
		} else {
			// this.config.id = new Date().getTime() + "_" + this.config.id;
		}

		dom[this.config.id] = this.config.id;
		count ++;
		return this.init();	
	}
}
Dialog.prototype = {
	init: function () {
		this.content();
		this.title();
		this.icon();
		this.reset();
		this.addEvent();
		this.time(this.config.time);
		api	= this;
		_zIndex ++;
		return this;
	},
	content: function () {
		var DOM = {wrap: $(template)},
			body = document.body;
		body.appendChild(DOM.wrap.get(0));	
		var name, i = 0,
			els = DOM.wrap.get(0).getElementsByTagName('*'),
			elsLen = els.length;			
		for (; i < elsLen; i ++) {
			name = els[i].className.split('ui-dialog-')[1];
			name && (DOM[name] = $(els[i]));
		};		

		typeof this.config.ok !== 'function' && DOM['submit'].remove();
		typeof this.config.cancel !== 'function' && DOM['cancel'].remove();

		DOM.wrap.attr("id", this.config.id);
		DOM.inner.attr({"width":this.config.width});	//wrap的cssText在定位时被使用了，这个用标题栏代替

		this.config.skin && DOM.wrap.addClass('ui-dialog-' + this.config.skin);//
		DOM.main[0].style.padding = this.config.padding;
		typeof this.config.content === "object" ? DOM.content.append(this.config.content) : DOM.content.html(this.config.content)
		this.DOM = DOM;
		return this;
	},
	title: function () {
		this.DOM.title.html(this.config.title + (this.config.time ? "(" + this.config.time + "秒后自动关闭)":"")).css({"cursor": (this.config.drag ? "move" : "default")});
		return this;
	},
	icon: function () {
		if (this.config.icon) {
			this.DOM.icon.addClass("ui-dialog-" + this.config.icon);
			this.DOM.content.css({"display":"inline-block"});
			// this.DOM.buttons.remove();
			// delete this.DOM.cancel;
			// delete this.DOM.submit;
			// delete this.DOM.buttons;
		} else {
			this.DOM.icon.remove();
		};
		return this;
	},
	position: function () {
		var winWidth 	= _$window.width(),
			winHeight 	= _$window.height(),
			wrap 		= this.DOM.wrap[0],
			isFixed 	= this.config.fixed,
			wrapWidth 	= wrap.offsetWidth,
			wrapHeight 	= wrap.offsetHeight,
			left 		= (winWidth - wrapWidth)/2,
			top  		= (winHeight - wrapHeight)/2,
			stop 		= document.documentElement.scrollTop || document.body.scrollTop;
		
		var cssText = 'position:' + (isFixed && !_isIE6 ? 'fixed;' : 'absolute;');
		if (isFixed && _isIE6) {
			cssText += 'left:expression((document.documentElement).scrollLeft+' + left + ');top:expression((document.documentElement).scrollTop+' + top + ');';
		} else {
			cssText += 'left:' + left + 'px;top:' + (!isFixed ? (stop + top) : top) + 'px;';
		}
		wrap.style.cssText = cssText + 'z-index:' + _zIndex;
		return this;
	},
	reset: function () {
		this.config.follow ? this.follow()	: this.position();
		this.config.lock && this.lock();
		this._ie6SelectFix();
		return this;
	},
	close: function () {
		if (api === this) api = null;
		this._timer && clearTimeout(this._timer);
		this.removeEvent();
		dom.hasOwnProperty(this.config.id) && delete dom[this.config.id];
		this.unlock();
		this.DOM.wrap.attr({"style":""}).html('').remove();
		return this;
	},
	time: function (second) {
		var that = this,
			cancel = that.config.cancelVal,
			timer = that._timer;
		timer && clearTimeout(timer);
		if (second) {
			that._timer = setTimeout(function(){
				that.close();
			}, 1000 * second);
		};
		return that;
	},


	addEvent: function () {
		var that = this,
			resizeTimer;
		this.DOM.wrap.on("click", ".ui-dialog-close, .ui-dialog-submit, .ui-dialog-cancel", function(event) {
			var elem = event.target;
			if (elem === that.DOM.close[0] || elem === that.DOM.cancel[0]) {
				
				that.close();
				if (typeof that.config.cancel === 'function') {
					that.config.cancel.apply(that, arguments);
				}
			} else if (elem === that.DOM.submit[0]) {
				if (typeof that.config.ok === 'function') {
					that.config.ok.apply(that, arguments);	
				} else {
					that.close();
				}
				
			}
		});

		this.DOM.wrap.on("mousedown", function() {
			that.zIndex();
		})

		that._winResize = function () {
			resizeTimer && clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				that.reset();
			}, 40);
		};
		_$window.on('resize', that._winResize);
		return this;
	},
	removeEvent: function () {
		this.DOM.wrap.off("click mousedown");
		_$window.off('resize', this._winResize);
		return this;
	},
	zIndex: function () {
		this._lockMask && this._lockMask.css({'z-index': _zIndex});
		this.DOM.wrap.css({"z-index":_zIndex});	
		_zIndex++;	
		api	= this;
		return this;
	},
	lock: function () {
		if (this._lock) return this;
		var that = this,
			index = _zIndex,
			wrap = that.DOM.wrap,
			config = that.config,
			domTxt 		= '(document.documentElement)',
			lockMask = that._lockMask || wrap.before(document.createElement('div')).prev();

		var cssText = 'background-color:' + config.background
			+ ';filter:alpha(opacity=0);opacity:0;overflow:hidden;z-index:' + _zIndex + ';';

		if (_isIE6) {
			cssText += 'position:absolute;left:expression(' + domTxt + '.scrollLeft);top:expression('
				+ domTxt + '.scrollTop);width:expression(' + domTxt
				+ '.clientWidth);height:expression(' + domTxt + '.clientHeight);';
			// 让IE6锁屏遮罩能够盖住下拉控件
			lockMask.html(
			'<iframe src="about:blank" style="width:100%;height:100%;position:absolute;' +
			'top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>');
		} else {
			cssText += 'position:fixed;width:100%;height:100%;left:0;top:0;';
		}
		// lockMask.attr({"title": "双击" + (config.esc ? "或按ESC" : "") + "关闭"});
		lockMask[0].style.cssText = cssText;
		lockMask[0].id = config.id + "Mask";
		lockMask.stop().on('click', function () {
			that.reset();
		})//.on('dblclick', function () {
		// 	that.DOM.close.trigger("click");
		// });
		if (config.duration === 0) {
			lockMask.css({opacity: config.opacity});
		} else {
			lockMask.animate({opacity: config.opacity}, config.duration);
		};
		that._lockMask = lockMask;
		that._lock = true;
		return that;
	},
	unlock: function () {
		var that = this,
			lockMask = that._lockMask;
		
		if (!that._lock) return that;
		var un = function () {
			lockMask.attr({"style":""}).remove();
		};
		
		lockMask.stop().off("click dbclick");
		if (!that.config.duration) {
			un();
		} else {
			lockMask.animate({opacity: 0}, that.config.duration, un);
		};
		
		that._lock = false;
		return that;
	},
	_ie6SelectFix: function () {
		if (!_isIE6 || this.config.lock) {
			return this;
		}
		var wrap = this.DOM.wrap[0],
			iframe = this.DOM.iframe,
			width = wrap.offsetWidth,
			height = wrap.offsetHeight;

		if (iframe) {
			iframe.style.width = width + "px";
			iframe.style.height = height + "px";
		} else {
			iframe = wrap.appendChild(document.createElement('iframe'));
			this.DOM.iframe;
			iframe.src = 'about:blank';
			iframe.style.cssText = 'position:absolute;z-index:-1;left:0;top:0;'
			+ 'filter:alpha(opacity=0);width:' + width + 'px;height:' + height + "px";
		};
	}

}
window.dialog = Dialog;


// ESC关闭弹层
_$document.on('keydown', function (event) {
	var target = event.target,
		nodeName = target.nodeName,
		rinput = /^INPUT|TEXTAREA$/,
		keyCode = event.keyCode;
	if (!api || !api.config.esc || rinput.test(nodeName)) return;		
	keyCode === 27 && api.DOM.close.trigger('click');
});


// 拖拽模块
var _dragEvent, _use,
	_isLosecapture = 'onlosecapture' in _elem,
	_isSetCapture = 'setCapture' in _elem;
_$document.on('mousedown', function (event) {
	if (!api) return;
	var target = event.target,
		config = api.config,
		DOM = api.DOM;
	
	if (config.drag !== false && target === DOM.title[0]) {
		_dragEvent = _dragEvent || new DragEvent();
		_use(event);
		return false;// 防止firefox与chrome滚屏
	};
});


// 拖拽事件
function DragEvent () {
	var that = this,
		proxy = function (name) {
			var fn = that[name];
			that[name] = function () {
				return fn.apply(that, arguments);
			};
		};
		
	proxy('start');
	proxy('move');
	proxy('end');
};
DragEvent.prototype = {
	// 开始拖拽
	onstart: function () {},
	start: function (event) {
		_$document
		.bind('mousemove', this.move)
		.bind('mouseup', this.end);
			
		this._sClientX = event.clientX;
		this._sClientY = event.clientY;
		this.onstart(event.clientX, event.clientY);

		return false;
	},
	
	// 正在拖拽
	onmove: function () {},
	move: function (event) {		
		this._mClientX = event.clientX;
		this._mClientY = event.clientY;
		this.onmove(
			event.clientX - this._sClientX,
			event.clientY - this._sClientY
		);
		
		return false;
	},
	
	// 结束拖拽
	onend: function () {},
	end: function (event) {
		_$document
		.unbind('mousemove', this.move)
		.unbind('mouseup', this.end);
		
		this.onend(event.clientX, event.clientY);
		return false;
	}
	
};

_use = function (event) {
	var limit, startWidth, startHeight, startLeft, startTop,
		DOM = api.DOM,
		wrap = DOM.wrap,
		title = DOM.title,
		main = DOM.main;
	// 清除文本选择
	var clsSelect = 'getSelection' in window ? function () {
		window.getSelection().removeAllRanges();
	} : function () {
		try {
			document.selection.empty();
		} catch (e) {};
	};
	
	// 对话框准备拖动
	_dragEvent.onstart = function (x, y) {
		startLeft = wrap[0].offsetLeft;
		startTop = wrap[0].offsetTop;
		_$document.bind('dblclick', _dragEvent.end);
		!_isIE6 && _isLosecapture ?
			title.bind('losecapture', _dragEvent.end) :
			_$window.bind('blur', _dragEvent.end);
		_isSetCapture && title[0].setCapture();
		
		wrap.addClass('ui-dialog-state-drag');
	};
	
	// 对话框拖动进行中
	_dragEvent.onmove = function (x, y) {
		var style = wrap[0].style,
			left = Math.max(limit.minX, Math.min(limit.maxX, x + startLeft)),
			top = Math.max(limit.minY, Math.min(limit.maxY, y + startTop));

		left = left > 0 ? left - 1 : 0;
		style.left = left  + 'px';
		style.top = top + 'px';
	
		clsSelect();
	};
	
	// 对话框拖动结束
	_dragEvent.onend = function (x, y) {
		_$document.unbind('dblclick', _dragEvent.end);
		!_isIE6 && _isLosecapture ?
			title.unbind('losecapture', _dragEvent.end) :
			_$window.unbind('blur', _dragEvent.end);
		_isSetCapture && title[0].releaseCapture();
		wrap.removeClass('ui-dialog-state-drag');
	};
	
	limit = (function () {
		var maxX, maxY,
			wrap = api.DOM.wrap[0],
			fixed = wrap.style.position === 'fixed',
			ow = wrap.offsetWidth,
			oh = wrap.offsetHeight,
			ww = _$window.width(),
			wh = _$window.height(),
			dl = fixed ? 0 : _$document.scrollLeft(),
			dt = fixed ? 0 : _$document.scrollTop(),
			
		// 坐标最大值限制
		maxX = ww - ow + dl;
		maxY = wh - oh + dt;
		
		return {
			minX: dl,
			minY: dt,
			maxX: maxX,
			maxY: maxY
		};
	})();
	
	_dragEvent.start(event);
};


}(jQuery, window));