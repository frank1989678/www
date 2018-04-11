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
    var time1 = $('#queryStartTime').val(),
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

    if (AMAP_OVERLAYS.type === 'circle') {
        AMAP_OVERLAYS.center = AMAP_OVERLAYS.overlay.getCenter();
        AMAP_OVERLAYS.radius = AMAP_OVERLAYS.overlay.getRadius();
    } else {
        AMAP_OVERLAYS.path = [];
        $.each(AMAP_OVERLAYS.overlay.getPath(), function(i, item) {
            AMAP_OVERLAYS.path.push([item.lng, item.lat]);
        })
    }
    data = {
        name: name,
        type: $form.find('.slt').val(),
        enabled: $form.find('input[name="enabled"]:checked').val(),
        start: time1,
        end: time2,
        cars: [],
        rail: AMAP_OVERLAYS
    }
    $form.find('.cbx-on').each(function() {
        data[$(this).data('value')] = true
    })
    $.each(cars, function(i, item) {
        data.cars.push(item.id)
    })
    $.ajax({
        url: '',
        data: data,
        success: function(res) {
            _removeMarker();
        }
    })
}

function _drawPolygon(e) {
    var pt = {
        lng: e.lnglat.getLng(),
        lat: e.lnglat.getLat()
    }
    var k = 0.005;
    var path = [
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
function _drawPolyline(e) {
    var pt = {
        lng: e.lnglat.getLng(),
        lat: e.lnglat.getLat()
    }
    var k = 0.005;
    var path = [
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

function _drawCircle(e) {
    var pt = {
        lng: e.lnglat.getLng(),
        lat: e.lnglat.getLat()
    }
    AMAP_OVERLAYS.overlay = new AMap.Circle({
        map: map,
        strokeColor: "#8fc31f",
        strokeOpacity: 0.9, 
        strokeWeight: 3,
        fillColor: "#8fc31f",
        fillOpacity: 0.5,
        center: new AMap.LngLat(pt.lng, pt.lat),// 圆心位置
        radius: 1000 //半径
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
            switch (that.drawingType) {
                case 'polygon':
                    _drawPolygon(e);
                    break;
                    
                case 'polyline':
                    _drawPolyline(e);
                    break;
                    
                case 'circle':
                    _drawCircle(e);
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


