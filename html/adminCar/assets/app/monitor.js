!(function($) {
    /**
     * @param {OBject} AMap 地图对象
     * @param {positon} LngLat 经纬度坐标
     */
    function addMarker(map, lnglat) {
        map.clearMap();
        map.setCenter([lnglat.lng, lnglat.lat]);
        new AMap.Marker({
            map: map,
            position: [lnglat.lng, lnglat.lat],
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
            selectFn: function() {},
            chooseFn: function() {}
        }
        var set = $.extend({}, defaults, opts);
        var map = new AMap.Map(set.mapId);
        var auto = new AMap.Autocomplete({
            input: set.input
        });
        var lng = $('#' + set.lng).val();
        var lat = $('#' + set.lat).val();
        if (lng && lat) {
            addMarker(map, {
                lng: lng,
                lat: lat
            });
        }
        var placeSearch = new AMap.PlaceSearch({
            map: map
        });

        map.on('click', function(e) {
            getAddressByLngLat([e.lnglat.getLng(), e.lnglat.getLat()], _mapCallback);
        });
        AMap.event.addListener(auto, 'select', _autoSelect); //注册监听，当选中某条记录时会触发
        AMap.event.addListener(placeSearch, 'markerClick', _markerClick); //注册监听，当点击某个点时会触发
        function _autoSelect(e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name); //关键字查询查询
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
                set.chooseFn(pt, address, map);
            });
        }
    }
})(jQuery);

// 地图对象
var map;

// 路况
var mapControl = {
    init: function() {
        map = new AMap.Map('map');
        this.action();
    },
    action: function() {
        var that = this;

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


var icons = {
    green: '/assets/images/icon/water/green.png',
    red: '/assets/images/icon/water/red.png',
    blue: '/assets/images/icon/water/blue.png',
    gray: '/assets/images/icon/water/gray.png',
    level2: '/assets/images/icon/ico-level2.png',
    level3: '/assets/images/icon/ico-level3.png',
    level4: '/assets/images/icon/ico-level4.png',
    xfx: '/assets/images/icon/ico-xfx.png',
    water: '/assets/images/icon/ico-water.png'
}

var cars = {};

/**
 * 获取小车信息包括图标（icon），经纬度（lng,lat）
 * @param  {string} id可以获取小车相关信息的key值
 * @return {null}
 */
function getCarPos(id) {
    $.ajax({
        url: '',
        data: {
            id: id
        },
        success: function(res) {
            res = {
                name: '鄂A10001',
                lng: '116.406937',
                lat: '39.9063',
                icon: '/assets/images/icon/water/green.png'
            }
            showCarOnMap(id, res);
        }
    })
}
/**
 * 地图上显示车辆
 * @param  {string} id可以获取小车相关信息的key值
 * @param  {object} 对象数据：icon小车的图标，lng经度，lat纬度
 * @return {null}
 */
function showCarOnMap(id, data) {
    cars[id] = new Car(map, {
        key: id,
        icon: data.icon,
        offset: new AMap.Pixel(-24, -11),
        position: [data.lng, data.lat],
        autoRotation: true,
        crossFn: function(isCross, overlay, car) {
            if (isCross) {
                car.setIcon(icons.gray);
            } else {
                car.setIcon(icons.red);
            }
        },
        change: function(car) {
            car.setIcon(icon.red);
        },
        clickFn: function() {
            showCarDetail();
        }
    })
}


/**
 * 弹层显示小车详情
 * @param  {string} id可以获取小车相关信息的key值
 * @return {null}
 */
function showCarDetail(id) {
    $.ajax({
        url: '/car/getCarAndCarPosition',
        url: 'json/getCarAndCarPosition.json',
        dataType: 'json',
        data: {
            'id': id
        },
        cache: false,
        success: function(res) {
            var processData = {
                carId: res.carInfo.car.carId,
                carUse: TEXTCODE['carUse'][res.carInfo.car.carUse],
                agencyName: res.carInfo.car.agency.agencyName,
                IMEI: '95874125489666',
                deviceType: '个人版',
                terminalSim: res.carInfo.car.terminalSim,
                carUsername: res.carInfo.car.carUsername,
                carUserPhone: res.carInfo.car.carUserPhone,
                carStatus: TEXTCODE['carStatus'][res.carInfo.car.carStatus],
                registerTime: res.carInfo.registerTime,
                speed: res.carInfo.speed,
                carPosition: res.carInfo.carPosition,
                distance: res.carInfo.distance
            }
            layer.closeAll('dialog');
            layer.open({
                shift: -1,
                shade: false,
                btn: false,
                area: '530px',
                title: res.carInfo.car.carCode,
                content: template('carTemp', processData)
            })
            $('.dynamic').on('click', '.fold', function() {
                $('.dynamic').toggleClass('show');
            })
            // 解析经纬度地址
            getAddressByLngLat([res.carInfo.longitude, res.carInfo.latitude], function(lnglat, address){
                $('#carPosition').html(address);
            })
        }
    })
}

/**
 * 获取ztree勾选节点的所有小车id集
 */
function getChildCar(treeNode) {
    var ids = [];
    if (treeNode.iconSkin) {
        ids.push(treeNode.id);
    } else if (treeNode.children) {
        $.each(treeNode.children, function(i, item) {
            ids = ids.concat(getChildCar(item));
        })
    }
    return ids;
}

/**
 * 点击机构或小车名称
 */
function clickCarName(event, treeId, treeNode) {
    var ids = getChildCar(treeNode);
    map.setFitView();
    $.each(ids, function(i, carId) {
        if (!treeNode.checked && !cars[carId]) {
            var zTree = $.fn.zTree.getZTreeObj('carTree');
            zTree.checkNode(treeNode, true, false);
            getCarPos(carId);
        }
    })
}

/**
 * 勾选机构或小车
 */
function clickCarInput(event, treeId, treeNode) {
    var ids = getChildCar(treeNode);
    map.setFitView();
    $.each(ids, function(i, carId) {
        var carObj = cars[carId];
        if (treeNode.checked && !carObj) {
            getCarPos(carId);
        } else if (carObj) {
            carObj.destory();
            delete cars[carId];
        }
    })
}

/**
 * 车辆在线/离线状态
 */
function carStatus(treeId, treeNode) {
    if (!treeNode.iconSkin) {
        return {color:"#333"};
    } else if (treeNode.online) {
        return {color:"#ff6803"};
    } else {
        return {color:"#999"};
    }
}

/**
 * 只显示子节点图标
 * @return {null}
 */
function showIconBySon(treeId, treeNode) {
    return treeNode.iconSkin;
}

// ztree参数
var setting = {
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
        fontCss: carStatus,
        showIcon: false,
        showLine: false
    },
    callback: {
        onClick: clickCarName,
        onCheck: clickCarInput
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
            // url: '/carMonitor/getCarMove',
            data: {
                ids: id.join(',')
            },
            dataType: 'json',
            cache: false,
            success: function(res) {
                var res = [{
                    id: '4',
                    lng: '116.406807',
                    lat: '39.907856'
                }]
                $.each(res, function(j, obj) {
                    cars[obj.id] && cars[obj.id].moveTo(obj.lng, obj.lat);
                })
            }
        })
    }
}


$(function() {
    mapControl.init();

    // 定时器
    window.timer9 = setInterval(function() {
        // eagle();
    }, 5e3);
})