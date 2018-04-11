!(function($) {
    /**
     * @param {OBject} AMap 地图对象
     * @param {positon} LngLat 经纬度坐标
     */
    function addMarker(map, lng, lat) {
        map.clearMap();
        map.setCenter([lng, lat]);
        new AMap.Marker({
            map: map,
            position: [lng, lat],
            icon: new AMap.Icon({
                size: new AMap.Size(23, 28),
                image: '/assets/images/icon/marker.png'
            })
        });
    }
    // 高德地图输入关键字搜索
    $.inmap = function(opts) {
        var defaults = {
            mapId: null,
            input: null,
            lng: null,
            lat: null,
            openMap: false,
            selectFn: function() {},
            chooseFn: function() {}
        }
        var set = $.extend({}, defaults, opts);
        var map = new AMap.Map(set.mapId);
        window.layerMap = map;
        var auto = new AMap.Autocomplete({
            input: set.input
        });
        var lng = $('#' + set.lng).val();
        var lat = $('#' + set.lat).val();
        if (lng && lat) {
            addMarker(map, lng, lat);
        }
        var placeSearch = new AMap.PlaceSearch({
            map: map
        });

        map.on('click', function(e) {
            getAddressByLngLat([e.lnglat.getLng(), e.lnglat.getLat()], function(lnglat, address) {
                var pt = {
                    lng: lnglat[0],
                    lat: lnglat[1]
                }
                _mapCallback(pt, address)
            })
        });
        AMap.event.addListener(auto, 'select', _autoSelect); //注册监听，当选中某条记录时会触发
        AMap.event.addListener(placeSearch, 'markerClick', _markerClick); //注册监听，当点击某个点时会触发
        function _autoSelect(e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name); //关键字查询查询
            $('#' + set.lng).val(e.poi.location.lng);
            $('#' + set.lat).val(e.poi.location.lat);
            if (set.openMap && typeof showMap === 'function') {
                showMap(true);
            }
        }

        function _markerClick(e) {
            if (e.data && e.data.location) {
                map.setCenter(e.data.location);
                var pt = {
                    lng: e.data.location.lng,
                    lat: e.data.location.lat
                }
                var address = e.data.name;
                _mapCallback(pt, address);
            }
        }
        // 地图选点回调
        function _mapCallback(pt, address) {
            var msg = '确定保存该地点经纬度？ <br/>';
            msg += '地点位置：' + address + '<br/>';
            msg += '地点坐标：经度：' + pt.lng + ',纬度：' + pt.lat + '<br/>';

            fx.confirm(msg, function() {
                $('#' + set.input).val(address);
                $('#' + set.lng).val(pt.lng);
                $('#' + set.lat).val(pt.lat);
                addMarker(map, pt.lng, pt.lat);
                set.chooseFn(pt, address, map);
            });
        }
    }
})(jQuery);

// 地图对象
var map;

// 路况、机构、警情、消防栓
var mapControl = {
    init: function() {
        map = new AMap.Map('map');

        map.on('zoomend', function() {
            var zooms = map.getZoom();
            if (zooms > 16) {
                $('body').addClass('amap-marker-show');
            } else {
                $('body').removeClass('amap-marker-show');
            }
            console.log(zooms)
        })

        $('.map').on({
            'mouseenter': function() {
                $(this).closest('.amap-marker').addClass('amap-marker-show');
            },
            'mouseleave': function() {
                $(this).closest('.amap-marker').removeClass('amap-marker-show');
            }
        }, '.amap-icon')
        this.getMarker();
        this.action();
    },
    action: function() {
        var that = this;
        // 机构
        $('#org').on('click', function() {
            var light = $(this).hasClass('active');
            $(this).toggleClass('active');
            $.each(that.org, function(i, item) {
                if (light) {
                    item.hide();
                } else {
                    item.show();
                }
            })
            map.setFitView();
        })

        // 消防栓
        $('#xfs').on('click', function() {
            var light = $(this).hasClass('active');
            $(this).toggleClass('active');
            $.each(that.xfx, function(i, item) {
                if (light) {
                    item.hide();
                } else {
                    item.show();
                }
            })
            map.setFitView();
        })

        // 警情
        $('#avc').on('click', function() {
            var light = $(this).hasClass('active');
            $(this).toggleClass('active');
            $.each(that.avc, function(i, item) {
                if (light) {
                    item.hide();
                } else {
                    item.show();
                }
            })
            map.setFitView();
        })

        // 实时路况
        var trafficLayer;
        $('#traffic').on('click', function() {
            var light = $(this).hasClass('active');
            $(this).toggleClass('active');
            if (light) {
                trafficLayer.hide();
            } else {
                if (!trafficLayer) {
                    trafficLayer = new AMap.TileLayer.Traffic();
                    trafficLayer.setMap(map);
                }
                trafficLayer.show();
            }
        })
    },
    // 添加图标到地图
    addMarker: function(marker, label, clickable) {
        var iid = marker.id;
        var options = {
            map: map,
            offset: new AMap.Pixel(-10, -10),
            position: [marker.lng, marker.lat],
            icon: marker.icon
        }
        if (label) {
            var x = (marker.name.length * 12 + 20) / 2 - 10;
            options.label = {
                content: marker.name,
                offset: new AMap.Pixel(-x, -26)
            }
        }
        var point = new AMap.Marker(options);
        point.hide();
        if (clickable && iid) {
            point.on('click', function() {
                var $el = $('.info-' + iid);
                if ($el.length > 0) {
                    var idx = $el.closest('.item').index();
                    $('#side6').find('.cont .active').removeClass('active');
                    $('#side6').find('.tab span').eq(idx).trigger('click');
                    $el.addClass('active');
                    showDetail(iid);
                }
            });
        }
        return point;
    },
    // 获取机构与消防栓
    getMarker: function() {
        var that = this;
        that.clearMap();
        that.org = [];
        that.xfx = [];
        that.avc = [];
        $.ajax({
            url: '/carMonitor/getCarMarker', // 开发
            url: 'json/getCarMarker.json', // 测试
            dataType: 'json',
            success: function(res) {
                var orgLight = $('#org').hasClass('active');
                var xfxLight = $('#xfx').hasClass('active');
                var avcLight = $('#avc').hasClass('active');
                $.each(res.org, function(i, marker) {
                    var point = that.addMarker(marker, true);
                    orgLight && point.show();
                    that.org.push(point);
                })
                $.each(res.xfx, function(i, marker) {
                    var point = that.addMarker(marker);
                    xfxLight && point.show();
                    that.xfx.push(point);
                })
                $.each(res.avc, function(i, marker) {
                    var point = that.addMarker(marker, false, true);
                    avcLight && point.show();
                    that.avc.push(point);
                })
                if (orgLight || xfxLight || avcLight) {
                    map.setFitView();
                }
            },
            error: function() {
                $.notify({
                    type: 'danger',
                    title: '数据加载失败!'
                })
            }
        })
    },
    clearMap: function() {
        var that = this;
        $.each(that.org || [], function(i, marker) {
            marker.setMap(null);
        })
        $.each(that.xfx || [], function(i, marker) {
            marker.setMap(null);
        })
        $.each(that.avc || [], function(i, marker) {
            marker.setMap(null);
        })
    }
}

/**
 * 高德地图逆地理编码
 * @param  {Array}     lnglat   [高德经纬度坐标]
 * @param  {Function}  callback [回调函数]
 * @return {String}    address  [返回地址]
 */
function getAddressByLngLat(lnglat, callback) {
    var address = '';
    var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
    });
    geocoder.getAddress(lnglat, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            address = result.regeocode.formattedAddress;
        }
        callback(lnglat, address);
    });
}

/**
 * 解析警情燃烧对象
 */
var ASTypeMapper = {}

function getASTypeMapper() {
    $.ajax({
        url: '/alarmSituation/getASTypeMapper',
        url: 'json/getASTypeMapper.json',
        success: function(res) {
            $.each(res, function(key, value) {
                ASTypeMapper[key] = value;
            })
        }
    })
}
$(function() {
    getASTypeMapper();
})

// 获取车辆GPS
function getCarGps(id) {
    $.ajax({
        url: 'json/getCarGPS.json',
        data: {'id': id},
        cache: false,
        success: function(res) {
            showCarOnMap(id, res);
            // map.setFitView();
        }
    })
}

// 车辆显示到地图
function showCarOnMap(id, data) {
    var icon = data.icon;
    try {
        icon = carIconObj[data.carType]['b' + data.carState];
    } catch (err) {};
    var k = Math.random() * 0.1;
    var p = Math.random() < 0.5 ? -1 : 1;
    data.lng = parseFloat(data.lng);
    data.lat = parseFloat(data.lat);
    data.lng += p * k;
    data.lat += p * k;
    cars[id] = new Car(map, {
        key: id,
        icon: icon,
        offset: new AMap.Pixel(-24, -33),
        position: [data.lng, data.lat],
        autoRotation: true,
        clickFn: function() {
            showCarLayer(id);
        }
    })
}

var carLayerTimer = 0;
// 车辆卡片详情
function showCarLayer(id, callback) {
    $.ajax({
        url: '/car/getCarAndCarPosition',
        url: 'json/getCarAndCarPosition.json',
        dataType: 'json',
        data: {'id': id},
        cache: false,
        success: function (res) {
            if (typeof callback === 'function') {
                callback(res);
            } else {
                carLayerTimer = setInterval(function() {
                    showCarLayer(id, carLayerHold);
                }, 2000);
                
                layer.closeAll('dialog');
                layer.open({
                    shift: -1,
                    shade: false,
                    btn: false,
                    area: '530px',
                    title: res.carInfo.position.car.carCode,
                    content: '<div id="carInfoCard">' + template('carTemp', res.carInfo) + "</div>",
                    end: function () {
                        clearInterval(carLayerTimer);
                    }
                })
                $('#carPosition').html('');
                // 解析经纬度地址
                getAddressByLngLat([res.carInfo.position.longitude, res.carInfo.position.latitude], function(lnglat, address) {
                    $('#carPosition').html(address);
                })
            } 
        }
    })
}
// 轮询车辆卡片信息
function carLayerHold(res) {
    var carInfo = res.carInfo;
    var position = carInfo.position;
    if (position.car.carStatus == 2) {
        var isShow = $('.dynamic').hasClass('show');
        var address = $('#carPosition').html();
        $('#carInfoCard').html(template('carTemp', carInfo));
        $('#carPosition').html(address);
        // 显示出警动态
        if (position.car.carStatus != 0 && isShow) {
            dynamicFold();
        }
        // 解析经纬度地址
        getAddressByLngLat([position.longitude, position.latitude], function(lnglat, address) {
            $('#carPosition').html(address);
        })
    }
}
// 出警动态显示开关
function dynamicFold() {
    $('.dynamic').toggleClass('show');
}

// 判断是否是车辆
function isCarNode(treeNode) {
    return treeNode.iconSkin === 'car';
}

// 获取ztree勾选节点的所有小车id集
function getChildCar(treeNode) {
    var ids = [];
    if (isCarNode(treeNode)) {
        ids.push(treeNode.id);
    } else if (treeNode.children) {
        $.each(treeNode.children, function (i, item) {
            ids = ids.concat(getChildCar(item));
        })
    }
    return ids;
}

// 点击机构或小车名称
function clickCarName(event, treeId, treeNode) {
    var checked = treeNode.checked;
    clickCarInput(event, treeId, treeNode, checked);
}

// 勾选机构或小车
function clickCarInput(event, treeId, treeNode, checked) {
    var ids = getChildCar(treeNode);
    if (typeof checked !== 'undefined') {
        var zTree = $.fn.zTree.getZTreeObj('carTree');
        zTree.checkNode(treeNode, !checked, true);
        zTree.cancelSelectedNode(); // 取消节点选中状态
        checked = !checked;
    } else {
        checked = treeNode.checked;
    }
    if (alarmMarker) {
        map.remove(alarmMarker)
    }
    $.each(ids, function (i, carId) {
        if (checked) {
            !cars[carId] && getCarGps(carId);
        } else if (cars[carId]) {
            cars[carId].destory();
            delete cars[carId];
        }
    })
    // map.setFitView();
}

// 车辆节点显示图标
function showIconBySon(treeId, treeNode) {
    return isCarNode(treeNode);
}

// ztree参数
var setting = {
    check: {
        enable: true,
        chkboxType: {'Y': 'ps', 'N': 'ps'}
    },
    data: {
        simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: null
        }
    },
    view: {
        dblClickExpand: false,
        // showIcon: showIconBySon,
        showLine: true
    },
    callback: {
        onClick: clickCarName,
        onCheck: clickCarInput,
        onCollapse: nodeCollapse,
        onExpand: nodeExpand
    }
}

/**
 * 车辆监控，显示车辆实时位置
 * @return {null}
 */
function eagle() {
    var id = [];
    $.each(cars, function(i, item) {
        id.push(i);
    })
    if (id.length > 0) {
        $.ajax({
            url: '/carMonitor/getCarMove',
            url: '',
            data: {
                ids: id.join(',')
            },
            dataType: 'json',
            cache: false,
            success: function(res) {
                var res = [{
                    id: '4',
                    lng: '114.406807',
                    lat: '30.907856'
                }]
                $.each(res, function(j, obj) {
                    cars[obj.id] && cars[obj.id].moveTo(obj.lng, obj.lat);

                    cars[94].moveTo('114.31154947926667', '30.554380154079862')
                })
            }
        })
    }
}


// 警情详情车辆列表
function clickCar2(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj('carTree2');
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}

function checkCar2(e, treeId, treeNode) {
    var carTree = $.fn.zTree.getZTreeObj('carTree2'),
        nodes = carTree.getCheckedNodes(true),
        value = [],
        carIds = [];
    for (var i = 0, l = nodes.length; i < l; i++) {
        if (nodes[i].isParent != true && /\d/.test(nodes[i].name)) {
            value.push(nodes[i].name);
            carIds.push(nodes[i].id);
        }
    }
    $('#ddiaopai').val(value.join(','));
    $('#ddiaopaiId').val(carIds.join(','));
}
var setting2 = {
    check: {
        enable: true,
        chkboxType: {
            'Y': 's',
            'N': 'ps'
        }
    },
    data: {
        simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: null
        }
    },
    view: {
        showIcon: showIconBySon
    },
    callback: {
        onClick: clickCar2,
        onCheck: checkCar2
    }
};


// 警情详情点坐标
var alarmMarker;
/**
 * 弹层显示警情详情
 * @param  {String}
 * @return {null}
 */
function showDetail(id) {
    $.ajax({
        url: '/alarmSituation/getAlarmSituationDetail',
        url: 'json/getAlarmSituationDetail.json',
        type: 'GET',
        dataType: 'json',
        data: {
            iid: id
        },
        cache: false,
        success: function(res) {
            var title = '警情详情 <span>红卫村机械厂 持续时间5分30秒 出动<em>3</em>个支队<em>15</em>辆车</span>'
            res.asBurnObject = ASTypeMapper[res.asBurnObject];
            layer.closeAll();
            layer.open({
                type: 1,
                shift: -1,
                move: false,
                fix: false,
                btn: false,
                title: title,
                offset: '90px',
                area: '80%',
                content: template('detailTemp', res),
                cancel: function() {
                    layerMap.destroy();
                    alarmLayerInfo.destroy();
                },
                end: function () {
                    $('#side6').find('.cont .active').removeClass('active');
                   // alarmMarker && alarmMarker.setMap(null);
                }
            })
            // 警情点坐标
            if (map) {
                alarmMarker && alarmMarker.setMap(null);
                alarmMarker = new AMap.Marker({
                    map: map,
                    position: [res.asLongitude, res.asLatitude], // 坐标点从后台拿
                    icon: new AMap.Icon({
                        size: new AMap.Size(23, 28),
                        image: '/assets/images/icon/ico-alarm.png'
                    })
                });
                map.setCenter([res.asLongitude, res.asLatitude]);
            }

            alarmLayerInfo.init();

            $.inmap({
                mapId: 'map2',
                input: 'asAddressEdit',
                lng: 'lng1',
                lat: 'lat1',
                openMap: true
            })

            // 获取车辆树形菜单
            $.ajax({
                url: '/alarmSituation/getTree',
                url: 'json/carTree2.json', // 测试
                dataType: 'json',
                data: {
                    actionStatus: 0,
                    asId: id
                },
                success: function(res) {
                    var treeObj = $.fn.zTree.init($('#carTree2'), setting2, res);
                    // treeObj.expandAll(true);
                }
            })
        }
    })
}
// 小地图
function showMap(type) {
    if (type) {
        $('#map2').parent().show();
    } else {
        $('#map2').parent().hide();
    }
}

// 警情详情卡片
var alarmLayerInfo = {
    cars: {},
    car1: {},
    destroy: function() {
        if (this.map) {
            $('#detailMap').off();
            this.map.destroy();
            this.map = null;
        }
    },
    init: function() {
        var that = this;
        this.map = new AMap.Map('detailMap', {
            scrollWheel: false
        });
        // setTimeout(function() {
            that.getCars();
        // }, 2000);
        
        that.zoom();
    },
    zoom: function() {
        var that = this;
        var model = [];
        model.push('<div class="op">');
        model.push('<span class="btn btn0" data-zoom="14">500m</span>');
        model.push('<span class="btn" data-zoom="11">5公里</span>');
        model.push('<span class="btn" data-zoom="7">50公里</span>');
        model.push('</div>');
        $('#detailMap').append(model.join(''));
        $('#detailMap').on('click', '.op span', function() {
            var zoom = $(this).data('zoom');
            that.map.setZoom(zoom);
        })
    },
    getCars: function(res) {
        var that = this;
        $.ajax({
            url: 'json/cars.json',
            cache: false,
            success: function(res) {
                $.each(res, function() {
                    that.addCar(this);
                })
                that.map.setFitView();
            }
        })
    },
    addCar: function(data) {
        var that = this;
        var icon = data.icon;
        try {
            icon = carIconObj[data.carType]['b' + data.carState];
        } catch (err) {}

        this.cars[data.id] = new Car(that.map, {
            key: data.id,
            icon: icon,
            offset: new AMap.Pixel(-24, -33),
            position: [data.longitude, data.latitude],
            autoRotation: true,
            clickFn: function() {
                that.addToTable(data.id);
            }
        })
    },
    addToTable: function(id) {
        if (this.car1[id]) {
            return;
        }
        this.car1[id] = true;
        var tr = '<tr><td>车辆名称</td>'
            + '<td>鄂A36985</td>'
            + '<td>泡沫车</td>'
            + '<td>王五</td>'
            + '<td>支队名称</td>'
            + '<td>中队名称</td>'
            + '<td><span class="ico ico-remove" onclick="alarmLayerInfo.del(this, '+id+')"></span></td>'
            + '</tr>'
        $('.table1').find('tbody').append(tr);
    },
    del: function(el, id) {
        this.car1[id] = false;
        $(el).closest('tr').remove();
    },
    // 调派车辆
    send: function() {
        
    }
}

/**
 * @警情列表
 * @para {Number} page：0（默认）
 * @para {status} 状态：0（默认，2者都有），1（待处理），2（处理中）
 * @para {string} bgcolor
 */
function alarmList(page, status, refresh) {
    page = page || 0;
    var pageStart = page * 20;
    $.ajax({
        url: '/alarmSituation/monitorAlarmSituationList', // 开发
        url: 'json/monitorAlarmSituationList.json', // 测试
        data: {
            page: page,
            status: status || 0,
            pageSize: 20,
            pageStart: pageStart
        },
        dataType: 'json',
        success: function(res) {
            refresh && $('#side6').find('.ul' + status).empty();
            _process(res, page, status);
        }
    })

    // 数据处理
    function _process(res, page, status) {
        var asType = ['火灾', '社会救援', '抢险救援', '勤务保卫', '其他'];
        var asLevel = ['一级警情', '二级警情', '三级警情', '四级警情'];
        var carActionStatus = ['未出动', '通知', '3出动', '到场', '返队', '归队'];
        var model = [];
        var $wrap = $('#side6');
        var $el = $('#side6').find('.ul' + status);
        var $tit = $('.t' + status);
        $.each(res.list, function(i, item) {
            model.push('<li>');
            model.push('<div class="info info-' + item.asId + '" onclick="showDetail(' + item.asId + ')">')
            model.push('<p><em>时间：</em>' + item.asRegisterTime + '</p>');
            model.push('<p><em>地点：</em>' + item.asAddress + '</p>');
            model.push('<p><em>电话：</em>' + item.asPeoplePhone + '</p>');
            model.push('<p><em>级别：</em>' + asLevel[item.asLevel - 1] + '</p>');
            model.push('<p><em>类别：</em>' + asType[item.asType - 1] + '</p>');

            if (status === 1) {
                model.push('<p><em>来源：</em>119警情</p>');
                model.push('</div>');
            } else {
                model.push('</div>');
                model.push('<dl><dt>车辆出警状态：</dt><dd>');
                model.push('<p><span>鄂A36985</span><button type="button" class="ubtn ubtn-primary">到场</button></p>');
                model.push('<p><span>鄂A36985</span><button type="button" class="ubtn ubtn-primary">到场</button></p>');
                model.push('<p><span>鄂A36985</span><button type="button" class="ubtn ubtn-primary">到场</button></p>');
                model.push('</dd></dl>');
            }
            model.push('</li>');
        })
        $el.find('.tc').remove(); // 移除更多按钮
        $el.append(model.join(''));
        $tit.html(res.totalSize);

        var totalSize = parseInt(res.totalSize),
            pageSize = parseInt(res.pageSize);

        if ((page + 1) * pageSize < totalSize) {
            $el.append('<li class="tc"><button type="button" class="ubtn ubtn-red" onclick="alarmList(' + (page + 1) + ',' + status + ')">是否显示更多</button></li>');
        }

        if ($wrap.find('li').length > 0) {
            // $.playMusic(5); // 语音播报5秒
            $wrap.show();
            // $('#side5').addClass('fold'); // 折叠警情列表
        } else {
            $wrap.hide();
        }
    }
}

// 报警详情
function showAlarmCar(id) {
    $.ajax({
        url: '/carMonitor/getCarGPS',
        dataType: 'json',
        data: {'id': id},
        success: function(res) {
            map.setCenter([res.lng, res.lat]);
            showCarOnMap(carId, res);
            showCarDetail(carId);
        }
    })
}


// 暂缓处理
function _defer(asId) {
    $.ajax({
        url: '/alarmSituation/updateStatusToDefer',
        data: {
            id: asId
        },
        dataType: 'json',
        success: function() {
            $.notify({
                title: '已暂缓处理!',
                type: 'success'
            })
            layer.closeAll();
            alarmList(0, 1, 1);
        }
    })
}
// 忽略
function _ignore(asId) {
    $.ajax({
        url: '/alarmSituation/updateStatusToIgnore',
        data: {
            id: asId
        },
        dataType: 'json',
        success: function() {
            $.notify({
                title: '已忽略!',
                type: 'success'
            })
            layer.closeAll();
            alarmList(0, 1, 1);
        }
    })
}
// 保存
function _save(asId) {
    var address = $('#asAddressEdit').val(),
        lng = $('#lng1').val(),
        lat = $('#lat1').val(),
        msg = [];

    if (address == '') {
        msg.push('修正地址');
    }
    if (lng == '') {
        msg.push('经度');
    }
    if (lat == '') {
        msg.push('纬度');
    }
    if (msg.length) {
        $.notify({
            title: '请填写' + msg.join('、') + '！',
            type: 'warning'
        })
        return false;
    }
    $.ajax({
        url: '/alarmSituation/updateAsAddress',
        type: 'POST',
        dataType: 'json',
        data: {
            id: asId,
            asAddressEdit: address,
            longitudeEdit: lng,
            latitudeEdit: lat
        },
        success: function() {
            $.notify({
                title: '保存成功!',
                type: 'success'
            })
        },
        error: function() {
            $.notify({
                title: '网络异常!',
                type: 'warning'
            })
        }
    })
}

// 调派
function _dispatch(asId) {
    var value = $('#ddiaopai').val(),
        carIds = $('#ddiaopaiId').val();

    if (value == '') {
        $.notify({
            title: '请先选择调派车辆！',
            type: 'warning'
        })
    } else {
        $.ajax({
            url: '/alarmSituation/addAlarmSituationCar',
            data: {
                asId: asId,
                carId: carIds
            },
            dataType: 'json',
            success: function(res) {
                if (res && res.status != undefined) {
                    $.notify({
                        title: res.message,
                        type: res.status
                    })
                    if (res.flag == true) {
                        layer.closeAll();
                        alarmList(0, 1, 1);
                        alarmList(0, 2, 1);
                    }
                }
            },
            error: function() {
                $.notify({
                    title: '网络异常!',
                    type: 'warning'
                })
            }
        })
    }
}


// 新增警情卡片地图开关
function showMap3(show) {
    if (show) {
        $('#map3').parent().show();
    } else {
        $('#map3').parent().hide();
    }
}
// 新增警情
function _addAlarm() {
    layer.open({
        type: 1,
        shift: -1,
        move: false,
        fix: false,
        btn: false,
        title: false,
        offset: '90px',
        area: '570px',
        content: $('#alarmSituationTemp').html()
    })
    $.inmap({
        mapId: 'map3',
        input: 'tipinput3',
        lng: 'lng',
        lat: 'lat'
    })
    $('#createTime').on('click', function() {
        WdatePicker({autoPickDate:true,minDate:'%y-%M-%d %H:%m:%s',dateFmt:'yyyy-MM-dd HH:mm:ss'});
    })
    // asTypeChange();
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
        var data = {}
        $.each($form.serializeArray(), function(i, item) {
            data[item.name] = item.value;
        })
        $.ajax({
            url: '/alarmSituation/addAlarmSituation',
            data: data,
            dataType: 'json',
            success: function() {
                $.notify({
                    title: '添加成功！',
                    type: 'success'
                })
                layer.closeAll();
                alarmList(0, 1, 1);
                alarmList(0, 2, 1);
            }
        })
    }
}

var alarmIds = {};
/**
 * 报警列表
 * @param  {Boolean} voice 是否播放声音
 * @return {null}
 */
function alarm(voice) {
    var $side5 = $('#side5'),
        $side6 = $('#side6');
    $.ajax({
        url: '/alarmReportRecord/monitorList',
        url: 'json/alarm.json',
        data: {},
        dataType: 'json',
        cache: false,
        success: function(res) {
            _process(res);
        }
    })

    // 数据处理
    function _process(res) {
        var model = [];
        var className = '';
        var newData = false;
        $.each(res.list, function(i, item) {
            var temp = [];
            // 循环判断arrId是否已缓存在alarmIds对象中
            if (!alarmIds[item.arrId] && voice) {
                newData = true;
                className = ' class="splash"';
            } else {
                className = '';
            }
            alarmIds[item.arrId] = true; // 保存消息状态
            temp.push('<li' + className + ' onclick="showAlarmCar(' + item.carId + ')">');
            temp.push('<p style="white-space:nowrap">时间：' + item.arrTime + '</p>');
            temp.push('<p>机构：' + item.car.agency.agencyName + '</p>');
            temp.push('<p>车牌：' + item.car.carCode + '</p>');
            temp.push('<p>报警：' + item.arrText + '</p>');
            temp.push('</li>');
            temp.push('<li class="hr"></li>');
            if (className) {
                model.unshift(temp.join(''));
            } else {
                model.push(temp.join(''));
            }
        })
        if (model.length > 0) {
            // if (!$side5.hasClass('fold')) {
            //     $side6.addClass('fold');
            // }
            // if ($side6.hasClass('fold')) {
            //     $side5.removeClass('fold');
            // }
            $side5.find('ul').html(model.join(''));
            $side5.find('.hr:last').remove();
            $side5.find('.splash').removeClass('splash').splash({bg2:'light'});
            $side5.show(1).delay(3*60*1e3).hide(1);
            newData && $.playMusic(5); // 语音播报5秒
        } else {
            $side5.hide();
        }
    }
}

$(function() {
    mapControl.init();

    alarmList(0, 1, 1);
    alarmList(0, 2, 1);

    alarm();


    var stopAlarmList = true;
    $('#side6').on('mouseenter', function() {
        stopAlarmList = false;
    }).on('mouseleave', function() {
        stopAlarmList = true;
    })

    // 定时器
    window.timer9 = setInterval(function() {
        // stopAlarmList && alarm(1);
        // eagle();
    }, 5e3);

    // tab
    $('.tab').off().on('click', 'span', function() {
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parent().next('.cont').find('.item').eq($(this).index()).show().siblings().hide();
    })

    // 警情与报警同时显示一个
    // $('#side6').on('click', '.open', function() {
    //     $('#side5').addClass('fold');
    // })
    // $('#side5').on('click', '.open', function() {
    //     $('#side6').addClass('fold');
    // })
})

// 警情
function getAlarm(status) {
    $.ajax({
        url: '',
        data: {status: status},
        cache: false,
        success: function(res) {
            res = {
                fire: 10,
                cap: 9,
                help: 12,
                rescue: 5,
                duty: 6,
                other: 10,
                waterCar: 10,
                rescueCar: 5,
                foamCar: 7,
                jugaoCar: 2,
                otherCar: 2,
                title: '全部警情（14起）'
            }
            layer.open({
                skin: 'layer-arrow',
                shade: false,
                btn: false,
                shift: -1,
                area: '430px',
                title: res.title,
                content: template('sirensTemp', res)
            })
            var $el1 = $('#sirens'+status),
                $el2 = $('.layer-arrow'),
                xy = $el1.offset(),
                w1 = $el1.outerWidth(),
                w2 = $el2.outerWidth(),
                h2 = $el2.outerHeight();

                $el2.css({
                    left: xy.left - (w2 - w1)/2,
                    top: xy.top - h2 - 20
                }).append('<div class="arrow"></div>')
        }
    })
}