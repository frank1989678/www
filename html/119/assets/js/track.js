// 警情详情
var iconMarker;
var map2;
var _iid = 0;
function _showDetail(iid) {
	if (iid === _iid) {
		return;
	}
	_iid = iid;
	$.ajax({
		url: 'alarmHotSpotDetail2.html',
		type: 'GET',
		dataType: 'html',
		data: {iid: iid},
		cache: false,	
		success: function(res) {
			layer.closeAll('iframe');
			layer.open({
				type: 1,
				shift: -1,
				move: false,
				fix: false,
				btn: false,
				// shade: false,
				offset: '90px',
		        title: '警情详情',
		        area: '640px',
		        content: res,
		        cancel: function() {
		        	_iid = 0;
		        	map2 = null;
		        	iconMarker = null;
		        }
			})
			map2 = new AMap.Map('map2');
		}
    })
}


// 暂缓处理
function _defer(id) {

}
// 忽略
function _ignore(id) {

}
// 保存
function _save(id) {

}
// 调派
function _dispatch(id) {

}


// 地图选点回调
function _mapCallback(pt, address) {
	var msg = '确定保存该地点经纬度？ <br/>';
    msg += '地点位置：' + address + '<br/>';
    msg += '地点坐标：经度：' + pt.lng + ',纬度：' + pt.lat + '<br/>';

    layer.confirm(msg, function(idx) {
    	$('#tipinput2').val(address);
        $('#lng').val(pt.lng);
        $('#lat').val(pt.lat);
        $('#slng').html(pt.lng);
        $('#slat').html(pt.lat);
        if ($('#address').val() == '') {
            $('#address').val(address);
        }

        layer.close(idx);
        layer.close(mapID);
        try {
            iconMarker && iconMarker.setMap(null);
	        iconMarker = new AMap.Marker({
	            map: map2,
	            position: [pt.lng, pt.lat],
	            icon: new AMap.Icon({            
	                size: new AMap.Size(23, 28), 
	                image: 'assets/images/icon/marker.png'
	            })        
	        });
	        map2.setFitView();
        }catch(err) {}

    });
}

var mapK;
function _initMap2() {
	mapK = new AMap.Map('amap');
	var autoOptions = {
	    input: "tipinput2"
	};
	var auto = new AMap.Autocomplete(autoOptions);
	var placeSearch = new AMap.PlaceSearch({
	    map: mapK
	});  //构造地点查询类
	AMap.event.addListener(auto, "select", _autoSelect);//注册监听，当选中某条记录时会触发
	AMap.event.addListener(placeSearch, 'markerClick', _markerClick);//注册监听，当点击某个点时会触发
	function _autoSelect(e) {
	    if (e.poi && e.poi.location) {
	        mapK.setZoom(15);
	        mapK.setCenter(e.poi.location);
	        $('#lng').val(e.poi.location.lng);
	        $('#lat').val(e.poi.location.lat);
	        $('#slng').html(e.poi.location.lng);
	        $('#slat').html(e.poi.location.lat);
	        if ($('#address').val() == '') {
	            $('#address').val(address);
	        }
	    }
	    placeSearch.setCity(e.poi.adcode);
	    placeSearch.search(e.poi.name);  //关键字查询查询
	}

	function _markerClick(e) {
		if (e.data && e.data.location) {
	        map.setZoom(15);
	        map.setCenter(e.data.location);
	        var pt = {
		        lng: e.data.location.lng,
		        lat: e.data.location.lat
		    }
		    var address = e.data.name;
	        _mapCallback(pt, address);
		}
	}

	mapK.on('click', function(e) {
	    var address = '';
	    var pt = {
	        lng: e.lnglat.getLng(),
	        lat: e.lnglat.getLat()
	    }
	    var geocoder = new AMap.Geocoder({
	        radius: 1000,
	        extensions: "all"
	    });
	    var lnglatXY = new AMap.LngLat(pt.lng, pt.lat); 
	    geocoder.getAddress(lnglatXY, function(status, result) {
	        if (status === 'complete' && result.info === 'OK') {
	            address = result.regeocode.formattedAddress;
	        }
	        try{
	            _mapCallback(pt, address);
	        }catch(err){}
	    });
	});

	$("#tipinput2").on('keyup', function(e) {
	    if (e.keyCode == 13) {
	        placeSearch.search(this.value);  //关键字查询查询
	    }
	})
}

// 显示地图
var mapID = 0;
function _showMap() {
	mapID = layer.open({
		type: 1,
		area: ['1000px', '600px'],
		content: '<div class="show-map"><div class="hd">请输入关键字：<input type="text" id="tipinput2" class="ipt"/></div><div class="bd" id="amap"></div></div>'
	})
	_initMap2();
}

// 新增警情
function _addAlarm() {
	$.ajax({
		url: 'addalarm2.html',
		type: 'GET',
		dataType: 'html',
		// data: {iid: iid},
		cache: false,	
		success: function(res) {
			layer.open({
				type: 1,
				shift: -1,
				move: false,
				fix: false,
				btn: false,
				offset: '90px',
        		title: false,
		        area: '570px',
		        content: res,
		        cancel: function() {
		        	map2 = null;
		        	iconMarker = null;
		        }
			})
			_initMap2();
			$('#createTime').jeDate();
		}
    })
}
// 提交警情
function _alarmSubmit() {
	var $form = $('#addAlarm');
	var pass = true;
	var tips = function() {
		$.notify({
			title: '警情信息没有填写完全',
			type: 'warning'
		})
		pass = false;
	}
	$form.find('.req input, .req select').each(function() {
		if (this.value == '') {
			tips();
			return false;
		}
	})
	if (pass) {
		var data = {
		}
		$.each($form.serializeArray(), function(i, item) {
			data[item.name] = item.value;
		})
		$.ajax({
			url: '',
			data: data,
			success: function() {
			}
		})
	}
}

// 实时路况
var trafficLayer;
$('#traffic').on('click', function() {
	var vis = $(this).hasClass('active');
	$(this).toggleClass('active');
	if (vis) {
		trafficLayer.hide();
	} else {
		if (!trafficLayer) {
			trafficLayer = new AMap.TileLayer.Traffic();
			trafficLayer.setMap(map);
		}
		trafficLayer.show();
	}
})

// 机构
var orgMarkers = [];
$('#org').on('click', function() {
	$(this).toggleClass('active');
	if (orgMarkers.length === 0) {
		$.each(marker.org, function(i, item) {
			var x = (item.name.length*12 + 20)/2 - 10;
			var point = new AMap.Marker({
		        map: map,
		        offset: new AMap.Pixel(-10, -10),
				position: [item.lng, item.lat],
		        icon: item.icon,
		        label: {
		        	content: item.name,
		        	offset: new AMap.Pixel(-x, -26)
		        }
		    });
		    orgMarkers.push(point);
		})
		map.setFitView();
	} else {
		$.each(orgMarkers, function(i, item) {
			item.setMap(null);
		})
		orgMarkers = [];
	}
})

// 消防栓
var xfxMarkers = [];
$('#xfx').on('click', function() {
	$(this).toggleClass('active');
	if (xfxMarkers.length === 0) {
		$.each(marker.xfx, function(i, item) {
			var x = (item.name.length*12 + 20)/2 - 10;
			var point = new AMap.Marker({
		        map: map,
		        offset: new AMap.Pixel(-10, -10),
				position: [item.lng, item.lat],
		        icon: item.icon
		    });
		    xfxMarkers.push(point);
		})
		map.setFitView();
	} else {
		$.each(xfxMarkers, function(i, item) {
			item.setMap(null);
		})
		xfxMarkers = [];
	}
})

/**
 * @警情列表
 * @para {Number} page：0（默认）
 * @para {status} 状态：0（默认，2者都有），1（待处理），2（处理中）
 * @para {string} bgcolor
 */
function _alarmList(page, status) {
	$.ajax({
		url: '',
		data: {page: page || 0, status: status || 0},
		success: function(res) {
			res = {
				list: [
					{'id': '1','address': '武汉市光谷大道金融港', 'phone':'15000002222','level':'二级','type':'火警','status':'出动'},
					{'id': '2','address': '武汉市徐东大街', 'phone':'15000002222','level':'二级','type':'火警','status':'未出动'},
					{'id': '3','address': '武汉市光谷大道金融港', 'phone':'15000002222','level':'二级','type':'火警','status':'出动'},
					{'id': '4','address': '武汉市光谷大道金融港', 'phone':'15000002222','level':'二级','type':'火警','status':'出动'},
					{'id': '5','address': '武汉市光谷大道金融港', 'phone':'15000002222','level':'二级','type':'火警','status':'出动'}
				],
				count1: 5,
				count2: 2,
				page1: 0,
				page2: 10
			}
			_process(res);
		}
	})

	// 数据处理
	function _process(res) {
		var model1 = [];
		var model2 = [];
		var $el = $('#side6');
		var $t1 = $el.find('.t1');
		var $t2 = $el.find('.t2');
		$.each(res.list, function(i, item) {
			var model = [];
			model.push('<li class="splash" onclick="_showDetail(' + item.id + ')">');
			model.push('<p>警情案发地点：' + item.address + '</p>');
			model.push('<p>报警人电话：' + item.phone + '</p>');
			model.push('<p>警情级别：' + item.level + '</p>');
			model.push('<p>警情类别：' + item.type + '</p>');
			model.push('<p>车辆出警状态：' + item.status + '</p>');
			model.push('</li>');
			if (item.status === '出动') {
				model2.push(model.join(''));
			} else {
				model1.push(model.join(''));
			}
		})
		$el.find('.tc').remove(); // 移除更多按钮
		$el.find('.ul1').prepend(model1.join('')).scrollTop(0);
		$el.find('.ul2').prepend(model2.join('')).scrollTop(0);
		$t1.html(model1.length + parseInt($t1.html(), 10));
		$t2.html(model2.length + parseInt($t2.html(), 10));
		if (res.page1 > 0) {
			$el.find('.ul1').append('<li class="tc"><button type="button" class="ubtn ubtn-red" onclick="_alarmList('+res.page1+', 1)">是否显示更多</button></li>');
		}
		if (res.page2 > 0) {
			$el.find('.ul2').append('<li class="tc"><button type="button" class="ubtn ubtn-red" onclick="_alarmList('+res.page2+', 2)">是否显示更多</button></li>');
		}

		if (model1.length > 0 || model2.length > 0) {
			// $.playMusic(5); // 语音播报5秒
			$el.show();
		} else {
			$el.hide();
		}

		// $('.splash').removeClass('splash').splash({bg2:'light'});
	}
}


// 报警
function _alarm() {
	$.ajax({
		url: '',
		data: {},
		success: function(res) {
			res = {
				list: [
					{'org': '硚口大队', 'car':'鄂A10001','type':'电子围栏报警'},
					{'org': '江岸大队', 'car':'鄂A10002','type':'电子围栏报警'},
					{'org': '天地型', 'car':'鄂A10003','type':'电子围栏报警'}
				]
			}
			_process(res);
		}
	})
	// 数据处理
	function _process(res) {
		var model = [];
		$.each(res.list, function(i, item) {
			model.push('<li>')
			model.push('<p>车辆所属机构：' + item.org + '</p>');
			model.push('<p>车牌号码：' + item.car + '</p>');
			model.push('<p>报警类型：' + item.type + '</p>');
			model.push('</li>')
		})
		$('#side5').find('ul').prepend(model.join('')).scrollTop(0);
		if (model.length > 0) {
			$.playMusic(5); // 语音播报5秒
			$('#side5').show(1).delay(3*60*1e3).hide(1);
		} else {
			$('#side5').hide();
		}
	}
}

$(function() {
	_alarmList();
	_alarm();

	// tab
	$('.tab').off().on('click', 'span', function() {
		$(this).addClass('active').siblings().removeClass('active');
		$(this).parent().next('.cont').find('.item').eq($(this).index()).show().siblings().hide();
	})
})
