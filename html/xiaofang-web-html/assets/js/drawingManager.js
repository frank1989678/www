var AMAP_OVERLAYS = {
	type    : '', 		//类型，圆、多边形、 直线
	overlay : null, 	//覆盖物对象
	edit    : null, 	//编辑覆盖物对象
	path    : null, 	//直线、多边形的点集合
	center  : null, 	//圆的中心点
	radius  : null  	//圆的的半径
};

// 删除覆盖物
function _removeMarker() {
    if (AMAP_OVERLAYS.overlay) {
        AMAP_OVERLAYS.edit.close();
        AMAP_OVERLAYS.overlay.setMap(null);
        AMAP_OVERLAYS = {};
    }
}

// 保存围栏
function _saveRail() {
    var $form = $('#createRail'),
        time1 = $('#queryStartTime').val(),
        time2 = $('#queryEndTime').val(),
        name = $form.find('.ipt[name="name"]').val(),
        data = {},
        cars = treeObj.getCheckedNodes(true),
        msg = '';

    if (cars.length === 0) {
        msg = '请先勾选小车';
    } else if (name == '') {
        msg = '请填写围栏名称';
    } else if (!AMAP_OVERLAYS.overlay) {
        msg = '请在地图上添加围栏';
    }
    if (msg) {
        $.notify({
            'title': msg,
            'type': 'warning'
        })      
        return false;
    }
    data = {
        name: name,
        type: $form.find('.slt').val(),
        startTime: time1,
        endTime: time2,
        drawType: AMAP_OVERLAYS.type,
        cars: []
    }
    if (AMAP_OVERLAYS.type === 'circle') {
        var center = AMAP_OVERLAYS.overlay.getCenter();
        data.center = [center.lng, center.lat];
        data.radius = AMAP_OVERLAYS.overlay.getRadius();
    } else {
        data.path = [];
        $.each(AMAP_OVERLAYS.overlay.getPath(), function(i, item) {
            data.path.push([item.lng, item.lat]);
        })
    }
    $form.find('._cbx').each(function() {
        if (this.checked) {
            data[this.name] = 1;
        } else {
            data[this.name] = 0;
        }
    })
    $.each(cars, function(i, item) {
        data.cars.push(item.id);
    })
    $.ajax({
        url: '',
        data: data,
        success: function(res) {
            $form.parent().hide();
            _removeMarker();
        }
    })
}

// 回填表单
function _initFormByPara(res) {
    var $form = $('#createRail');
    $form.find('.ipt[name="name"]').val(res.name);
    $form.find('.slt[name="type"]').val(res.type);
    $form.find('._cbx').each(function() {
        if (this.name == 'enabled') {
            this.checked = res[this.name] == this.value;
        } else {
            this.checked = res[this.name] == 1;
        }
    })
    $('#queryStartTime').val(res.start);
    $('#queryEndTime').val(res.end);

    // 围栏
    _removeMarker();
    AMAP_OVERLAYS.type = res.drawType;
    if (res.drawType === 'polygon' && res.path) {
        _drawPolygon(null, res.path);
    } else if (res.drawType === 'polyline' && res.path) {
        _drawPolyline(null, res.path);
    } else if (res.drawType === 'circle' && res.center) {
        _drawCircle(null, res.center, res.radius);
    }

    // 小车
    $('.car').empty();
    treeObj.checkAllNodes(false);
    $.each(res.cars, function(i, treeId) {
        var node = treeObj.getNodeByParam('id', treeId);
        treeObj.checkNode(node, true, false);
        $('.car').append('<label id="car' + node.id + '">' + node.name + '</label>');
    })
    $form.parent().show();
}

// 画多边形
function _drawPolygon(pt, _path) {
    var k = 0.005;
    var path = _path || [
        [pt.lng, pt.lat], 
        [pt.lng + 2 * k, pt.lat], 
        [pt.lng + 1 * k, pt.lat + 1.5 * k],
    ]
    AMAP_OVERLAYS.overlay = new AMap.Polygon({
        map: map,
        strokeColor: "#8fc31f",
        strokeOpacity: 0.9, 
        strokeWeight: 3,
        fillColor: "#8fc31f",
        fillOpacity: 0.5,
        path: path//设置多边形边界路径
    });
    AMAP_OVERLAYS.edit = new AMap.PolyEditor(map, AMAP_OVERLAYS.overlay);
    AMAP_OVERLAYS.edit.open();
}

// 画线
function _drawPolyline(pt, _path) {
    var k = 0.005;
    var path = _path || [
        [pt.lng, pt.lat], 
        [pt.lng + 1 * k, pt.lat]
    ]
    AMAP_OVERLAYS.overlay = new AMap.Polyline({
        map: map,
        strokeColor: "#8fc31f",
        strokeOpacity: 0.9, 
        strokeWeight: 3,
        fillColor: "#8fc31f",
        fillOpacity: 0.5,
        path: path
    });
    AMAP_OVERLAYS.edit = new AMap.PolyEditor(map, AMAP_OVERLAYS.overlay);
    AMAP_OVERLAYS.edit.open();
}

// 画圆
function _drawCircle(pt, _center, _radius) {
    var center;
    if (pt) {
        center = new AMap.LngLat(pt.lng, pt.lat);
    } else {
        center = new AMap.LngLat(_center[0], _center[1]);
    }
    AMAP_OVERLAYS.overlay = new AMap.Circle({
        map: map,
        strokeColor: "#8fc31f",
        strokeOpacity: 0.9, 
        strokeWeight: 3,
        fillColor: "#8fc31f",
        fillOpacity: 0.5,
        center: center,// 圆心位置
        radius: _radius || 1000 //半径
    });

    AMAP_OVERLAYS.edit = new AMap.CircleEditor(map, AMAP_OVERLAYS.overlay);
    AMAP_OVERLAYS.edit.open();
}

// 画图工具
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
		this._drawingTool();
	},
	_drawingTool: function() {
		var that = this;
		var container = this.container = document.createElement('div');
		container.className = 'BMapLib_Drawing';
        container.innerHTML = this._generalHtml();
        document.body.appendChild(container);
        this._bind(container);

        map.on('click', function(e) {
            if (AMAP_OVERLAYS.overlay) {
                return;
            }
            AMAP_OVERLAYS = {
                type: that.drawingType
            }
            var pt = {
                lng: e.lnglat.getLng(),
                lat: e.lnglat.getLat()
            }
            switch (that.drawingType) {
                case 'polygon':
                    _drawPolygon(pt);
                    break;
                    
                case 'polyline':
                    _drawPolyline(pt);
                    break;
                    
                case 'circle':
                    _drawCircle(pt);
                    break;

                default:
                    break;
            }
        });
        return container;
	},
	_generalHtml: function() {
		//鼠标经过工具栏上的提示信息
        var tips = {
        	hander: '拖动地图',
        	circle: '画圆',
        	polygon: '画多边形',
        	rectangle: '画矩形',
        	polyline: '画线'
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
            that.drawingType = drawingType;
            that._setStyleByDrawingMode(drawingType);
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
	}
}


