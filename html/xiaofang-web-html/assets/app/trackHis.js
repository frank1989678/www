var map;
var car;
var markers = {
    sos: [],
    rail: [],
    status: []
};
var status = 'stop';
var lineArr = [];


function showCar(data) {
    lineArr = [];
    status = 'stop';
    map.clearMap(); // 删除地图上所有marker
    markers = {
        sos: [],
        rail: [],
        status: []
    };
    $.each(data.cprList,function (i,item) {
        lineArr.push([item.longitude,item.latitude]);
    })
    $('#jplay').attr('class', 'ico ico-play');
    car = new AMap.Marker({
        map: map,
        position: lineArr[0],
        icon: '/assets/images/icon/water/green.png',
        offset: new AMap.Pixel(-20, -15),
        autoRotation: true,
        zIndex: 99999
    });

    // 绘制小车轨迹
    new AMap.Polyline({
        map: map,
        path: lineArr,
        strokeColor: "#afb8e5",
        strokeWeight: 6,
    });

    var cbx = {} // 多选框勾选状态，判断是否显示围栏、sos报警和警情
    $('.form').find('.cbx').each(function() {
        var val = $(this).data('value');
        var checked = $(this).hasClass('cbx-on');
        cbx[val] = checked;
    })
    // SOS
    $.each(data.SOS, function(i, item) {
        if (item.longitude == null || item.latitude == null) {
            return true;
        }
        if (item.arrType == 1) { // 电子围栏报警
            var marker = new AMap.Marker({
                map: map,
                position: [item.longitude, item.latitude],
                offset: new AMap.Pixel(-10, -8),
                icon: '/assets/images/icon/ico-rail.png'
            });
        } else {
            var marker = new AMap.Marker({
                map: map,
                position: [item.longitude, item.latitude],
                offset: new AMap.Pixel(-22, -30),
                content: '<div class="tips-sos">SOS</div>'
            });
        }
        !cbx.sos && marker.hide();
        markers.sos.push(marker);
    })

    // 警情点
    $.each(data.alarmSituation, function(i, item) {
        if (item.asLongitude == null || item.asLatitude == null) {
            return true;
        }
        var marker = new AMap.Marker({
            map: map,
            position: [item.asLongitude, item.asLatitude],
            offset: new AMap.Pixel(-15, -15),
            content: '<div class="tips-status">' + (i+1) + '</div>'
        });
        !cbx.status && marker.hide();
        markers.status.push(marker);
    })

    // 电子围栏
    $.each(data.rail, function(i, item) {
        var marker,center,radius;
        var pathArr = [];
        $.each(item.points, function(i, lnglat) {
            if (lnglat.longitude && lnglat.latitude) {
                pathArr.push([lnglat.longitude, lnglat.latitude]);
            }
        })
        if (item.graph == 'polygon') { // 多边形
            marker = fx.drawPolygon(map, pathArr);
        } else if (item.graph == 'polyline') { // 线
            marker = fx.drawPolyline(map, pathArr);
        } else if (item.graph == 'circle') { // 圆
            center = new AMap.LngLat(item.points[0].longitude,item.points[0].latitude);
            radius = item.points[0].radius;
            marker = fx.drawCircle(map, center, radius);
        }
        !cbx.rail && marker.hide();
        markers.rail.push(marker);
    })

    map.setFitView();
}

function _play(el) {
    if (!car) {
        return;
    }
    switch (status) {
        case 'stop':
            if (lineArr.length > 0) {
                var k = $('.speed').find('input:checked').val();
                car.moveAlong(lineArr, 1000 * k);
                status = 'play';
                el.className = 'ico ico-purse';
            }
            break;
        case 'play':
            car.pauseMove();
            status = 'purse';
            el.className = 'ico ico-play';
            break;
        case 'purse':
            car.resumeMove();
            el.className = 'ico ico-purse';
            status = 'play';
            break;
        // no default
    }
}
function _stop() {
    if (car) {
        status = 'stop';
        car.setPosition(lineArr[0]);
        car.stopMove();
    }
}


var _global = {
    init: function() {
        this.filter();
        this.carSpeed();
        map = new AMap.Map('map');
    },
    carSpeed: function() {
        $('.speed').on('click', 'input', function() {
            if (car && status === 'play') {
                car.pauseMove();
                car.moveAlong(lineArr, 1000 * this.value);
            }
        })
    },
    filter: function() {
        var $form = $('.form'),
            $time1 = $('#queryStartTime'),
            $time2 = $('#queryEndTime');

        $('.queryTime').date({
            time1: '#queryStartTime',
            time2: '#queryEndTime',
            format: 'YYYY/MM/DD HH:mm',
            maxDays: 7
        })

        $form.on('click', '.for', function() {
            var $cbx = $(this).find('.cbx');
            var value = $cbx.data('value');
            var checked = !$cbx.hasClass('cbx-on');
            $cbx.toggleClass('cbx-on');
            $.each(markers[value], function(i, item) {
                if (checked) {
                    item.show()
                } else {
                    item.hide()
                }
            })
            map.setFitView();
        })

        $('#jsubmit').on('click', function() {
            var time1 = $time1.val(),
                time2 = $time2.val(),
                seconds = (new Date(time2).getTime()) - (new Date(time1).getTime()),
                day7 = 7 * 24 * 60 * 60 * 1e3,
                minute = 30 * 60 * 1e3,
                data = {},
                zTree = $.fn.zTree.getZTreeObj('carTree'),
                node = zTree.getCheckedNodes(true);

            if (node.length === 0) {
                $.notify({
                    'title': '请先勾选小车',
                    'type': 'warning'
                })
                return false;
            } else if(!time1 || !time1) {
                $.notify({
                    'title': '请选择时间',
                    'type': 'warning'
                })
                return false;
            } else if (seconds > day7) {
                $.notify({
                    'title': '开始时间与结束时间差≤7天',
                    'type': 'warning'
                })
                return false;
            } else if (seconds < minute) {
                $.notify({
                    'title': '开始时间与结束时间差≥30分钟',
                    'type': 'warning'
                })
                return false;
            }
            data = {
                id: node[0].id,
                start: time1,
                end: time2
            }
            $form.find('.cbx-on').each(function() {
                data[$(this).data('value')] = true
            })
            $.ajax({
                url: '/carPositionRecord/getCarPositionRecordList',
                url: 'json/trackHis.json',
                data: data,
                dataType: 'json',
                type: 'POST',
                success: function(res) {
                    showCar(res);
                },
                error:function (res) {
                    $.notify({
                        title: '数据加载失败',
                        type: 'danger'
                    })
                }
            })
        })
    }
}