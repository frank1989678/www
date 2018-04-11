var BAIDU_OVERLAYS = {}; // 覆盖物列表

// 画图工具
!(function(window) {
    var idx = 1;

    function modifyName(id) {
        var oldName = BAIDU_OVERLAYS[id].name;
        var val = prompt('请输入名称', oldName);
        if (val) {
            BAIDU_OVERLAYS[id].name = val;
        }
    }

    function removeMarker(id) {
        map.remove(BAIDU_OVERLAYS[id].overlay);
        delete BAIDU_OVERLAYS[id];
    }

    function overlaycomplete(e, drawingType) {
        var id = 'overlay' + (idx ++);
        var contextMenu = new AMap.ContextMenu();  //创建右键菜单
        contextMenu.addItem('重命名',function(){modifyName(id)});
        contextMenu.addItem('删除',function(){removeMarker(id)});
        e.obj.on('rightclick', function(e) {
	        contextMenu.open(map, e.lnglat);
	    });
        BAIDU_OVERLAYS[id] = {
        	type: drawingType,
            overlay: e.obj,
            name: id
        }
        if (drawingType === 'circle') {
        	BAIDU_OVERLAYS[id].center = e.obj.getCenter();
        	BAIDU_OVERLAYS[id].radius = e.obj.getRadius();
        } else {
        	BAIDU_OVERLAYS[id].path = e.obj.getPath();
        }
    }


	function DrawingManager(map, opts) {
		var that = this;
		if (!map) {
            return;
        }
        that.map = map;
        this.opts = opts || {};
        that.drawingModes = opts.drawingModes || [];
        that._initialize();
	}

	DrawingManager.prototype = {
		_initialize: function() {
			this.opts.enableDrawingTool && this._drawingTool();
		},
		_drawingTool: function() {
			var that = this;
			var container = this.container = document.createElement('div');
			container.className = 'BMapLib_Drawing';
	        container.innerHTML = this._generalHtml();
	        this.map.getContainer().appendChild(container);
	        this._bind(container);

		    map.plugin(['AMap.MouseTool'],function() {
		        that.mousetool  = new AMap.MouseTool(map);
		        AMap.event.addListener(that.mousetool, 'draw', function(e) {
		        	overlaycomplete(e, that.drawingType);
		        	that._close();
		        });
		    });

		    // that._close();
	        return container;
		},
		_generalHtml: function() {
			//鼠标经过工具栏上的提示信息
	        var tips = {
	        	hander: '拖动地图',
	        	circle: '画圆',
	        	polygon: '画多边形',
	        	rectangle: '画矩形'
	        };

	        var getItem = function(className, drawingType) {
	            return '<button class="' + className + '" drawingType="' + drawingType + '" type="button" title="' + tips[drawingType] + '"></button>';
	        }
	        var html = [],
	        	i = 0,
	        	len = this.drawingModes.length;

	        html.push(getItem("BMapLib_box BMapLib_hander", "hander"));
	        for (; i < len; i++) {
	            var classStr = 'BMapLib_box BMapLib_' + this.drawingModes[i];
	            html.push(getItem(classStr, this.drawingModes[i]));
	        }
	        return html.join('');
		},
		_bind: function() {
			var that = this;
			AMap.event.addDomListener(that.container, 'click', function(e) {
            	e = window.e || e;
            	var target = e.target || e.srcElement;
            	var drawingType = target.getAttribute('drawingType');
	            that._setStyleByDrawingMode(drawingType);
	            that._bindEventByDraingMode(drawingType);
            })
		},
		_setStyleByDrawingMode: function(drawingType) {
			if (!drawingType) {
	            return;
	        }
	        var boxs = this.container.getElementsByTagName('button');
	        for (var i = 0, len = boxs.length; i < len; i++) {
	            var box = boxs[i];
	            if (box.getAttribute('drawingType') == drawingType) {
	                box.className = 'BMapLib_box BMapLib_' + drawingType + '_hover';
	            } else {
	                box.className = box.className.replace(/_hover/, '');
	            }
	        }
		},
		_bindEventByDraingMode: function(drawingType) {
			var that = this;
	        if (drawingType == 'hander') {
	            that.mousetool.close();
	            that.map.setDefaultCursor('url("http://webapi.amap.com/theme/v1.3/openhand.cur"), default');
	        } else {
	            that.mousetool[drawingType]();
	            that.map.setDefaultCursor('crosshair');
	        }
	        that.drawingType = drawingType;
		},
		_close: function() {
			this._setStyleByDrawingMode('hander');
			this._bindEventByDraingMode('hander');
		}
	}

	// window.DrawingManager = DrawingManager;

})(window);

!(function(window) {
	var idx = 1;

    //判断指定点坐标是否在多边形范围内
    var _isInOverlay = function(pt, bds) {
    	return bds.contains(pt);
    };

	function Car(opts) {
		var defaults = {
			showPath: false,
			autoRotation: true,
			defaultContent: '',
			offset: ''
		}
		opts = opts || {};
		for (var i in defaults) {
			if (!opts[i]) {
				opts[i] = defaults[i];
			}
		}
        this.id = 'car' + (idx ++);
		this.opts = opts;
		this.pathArr = [];
		this.pathArr.push(opts.position);
		this._init();
	}
	Car.prototype = {
		_init: function() {
			this._addMarker();
			this._moving();
		},
		_addMarker: function() {
			var that = this;
			var opts = that.opts;
			that.car = new AMap.Marker({
		        map: map,
		        position: opts.position,
		        icon: opts.icon,
		        offset: opts.offset,
		        autoRotation: opts.autoRotation,
		        label: opts.defaultContent
		    });

		    if (opts.showPath) {
		    	that.lineArr = [];
				that.line = new AMap.Polyline({
			        map: map,
			        path: that.lineArr,
			        strokeColor: '#000',
			        strokeOpacity: 0.65,
			        strokeWeight: 5
			    });
			}

			if (opts.clickFn) {
				that.car.on('click', function() {
					opts.clickFn(opts.key)
				});
			}
		},
		_showPath: function(path) {
			var that = this;
			var opts = that.opts;
			if (opts.showPath) {
				that.lineArr.push([path[0].lng, path[0].lat]);
	            that.line.setPath(that.lineArr);
			}
			return that;
		},
		_moving: function() {
			var that = this;
			that.car.on('moving',function(e) {
				// that._showPath(e.passedPath);
				var count = 0;
		        for (var i in BAIDU_OVERLAYS) {
		        	count ++;
		            var curr = BAIDU_OVERLAYS[i];
		            if (!curr[that.id]) {
		                curr[that.id] = 'unknow';
		            }
		            if (_isInOverlay(that.car.getPosition(), curr.overlay)) {
		                if (curr[that.id] !== 'out') {
		                    that.opts.crossFn(false, curr, that.car);
		                }
		                curr[that.id] = 'out';
		                break;
		            } else {
		                if (curr[that.id] !== 'in') {
		                    that.opts.crossFn(true, curr, that.car);
		                }
		                curr[that.id] = 'in';
		            }
		        }
		        if (count === 0) {
		        	that.opts.change(that.car);
		        }
		    })
		},
		moveTo: function(pt, speed) {
			var that = this;
	        that.pathArr.push(pt);
	        that.car.moveTo(pt, speed);
		},
		destory: function() {
			this.car.stopMove();
			this.car.setMap(null);
		}
	}

	window.Car = Car;
})(window);