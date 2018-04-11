// 警情详情
var _iid = 0;

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
// 警情
var avcMarkers = [];
$('#avc').on('click', function() {
	$(this).toggleClass('active');
	if (avcMarkers.length === 0) {
		$.each(marker.xfx, function(i, item) {
			var x = (item.name.length*12 + 20)/2 - 10;
			var point = new AMap.Marker({
		        map: map,
		        offset: new AMap.Pixel(-10, -10),
				position: [item.lng, item.lat],
		        icon: item.icon
		    });
		    avcMarkers.push(point);
		})
		map.setFitView();
	} else {
		$.each(avcMarkers, function(i, item) {
			item.setMap(null);
		})
		avcMarkers = [];
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
		url: 'b.json',
		data: {page: page || 0, status: status || 0},
		success: function(res) {
			_process(res, page || 0);
		}
	})

	// 数据处理
	function _process(res, page) {
		var model1 = [];
		var model2 = [];
		var $el = $('#side6');
		var $t1 = $el.find('.t1');
		var $t2 = $el.find('.t2');
		$.each(res.list, function(i, item) {
			var model = [];
			model.push('<li class="splash" onclick="_showDetail(' + item.asId + ')">');
			model.push('<p>警情案发地点：' + item.asAddress + '</p>');
			model.push('<p>报警人电话：' + item.asPeoplePhone + '</p>');
			model.push('<p>警情级别：' + item.asLevel + '</p>');
			model.push('<p>警情类别：' + item.asType + '</p>');
			model.push('<p>车辆出警状态：' + item.asStatus + '</p>');
			model.push('</li>');
			if (item.asStatus == '1') {
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
		var number = Math.ceil(res.totalSize / res.pageSize);
		if (number > page) {
			$el.find('.ul1').append('<li class="tc"><button type="button" class="ubtn ubtn-red" onclick="_alarmList('+(page + 1)+', 1)">是否显示更多</button></li>');
			$el.find('.ul2').append('<li class="tc"><button type="button" class="ubtn ubtn-red" onclick="_alarmList('+(page + 1)+', 2)">是否显示更多</button></li>');
		} else {
			$el.find('.tc').remove();
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
	// _alarm();

	// tab
	$('.tab').off().on('click', 'span', function() {
		$(this).addClass('active').siblings().removeClass('active');
		$(this).parent().next('.cont').find('.item').eq($(this).index()).show().siblings().hide();
	})

})
