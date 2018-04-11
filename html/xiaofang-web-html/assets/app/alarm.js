!(function($){
    var markers = {};
    function addMarker(key, lnglat, map) {
        markers[key] && markers[key].setMap(null);
        markers[key] = new AMap.Marker({
            map: map,
            position: [lnglat.lng, lnglat.lat],
            icon: new AMap.Icon({            
                size: new AMap.Size(23, 28), 
                image: 'assets/images/icon/marker.png'
            })        
        });
        map.setFitView();
    }
    $.inmap = function(opts) {
        var defaults = {
            map: null,
            input: null,
            lng: null,
            lat: null,
            marker: false,
            selectFn: function(){},
            chooseFn: function(){}
        }
        var set = $.extend({}, defaults, opts);
        var map = new AMap.Map(set.map);
        var auto = new AMap.Autocomplete({input: set.input});
        var lng = $('#' + set.lng).val();
        var lat = $('#' + set.lat).val();
        if (lng && lat) {
            addMarker(set.map, {lng: lng, lat: lat}, map);
        }
        var placeSearch = new AMap.PlaceSearch({
            map: map
        });

        map.on('click', function(e) {
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
        AMap.event.addListener(auto, 'select', _autoSelect);//注册监听，当选中某条记录时会触发
        AMap.event.addListener(placeSearch, 'markerClick', _markerClick);//注册监听，当点击某个点时会触发
        function _autoSelect(e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);  //关键字查询查询
        }
        function _markerClick(e) {
            if (e.data && e.data.location) {
                // map.setZoom(15);
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
                // set.marker && addMarker(set.map, pt, map);
            });
        }
    }
})(jQuery);

var iconMarker;
var layerMap;
// 详情
function _showDetail(iid) {
    $.ajax({
        url: 'alarmHotSpotDetail2.html',
        type: 'GET',
        dataType: 'html',
        data: {iid: iid},
        cache: false,   
        success: function(res) {
            layer.open({
                type: 1,
                shift: -1,
                move: false,
                fix: false,
                btn: false,
                offset: '90px',
                title: '警情详情',
                area: '640px',
                content: res,
                cancel: function() {
                    iconMarker = null;
                }
            })
            $.inmap({
                map: 'map2',
                input: 'asAddressEdit',
                lng: 'lng1',
                lat: 'lat1',
                chooseFn: function(lnglat, address, map) {
                    layerMap = map;
                    iconMarker && iconMarker.setMap(null);
                    iconMarker = new AMap.Marker({
                        map: layerMap,
                        position: [lnglat.lng, lnglat.lat],
                        icon: new AMap.Icon({            
                            size: new AMap.Size(23, 28), 
                            image: 'assets/images/icon/marker.png'
                        })        
                    });
                    layerMap.setFitView();
                }
            })

            $.ajax({
                url: 'json/carTree.json',
                dataType: 'json',
                // data: data,
                success: function(res) {
                    var treeObj = $.fn.zTree.init($('#carTree2'), setting2, res);
                    treeObj.expandAll(true);
                }
            })
        }
    })
}

var cars2 = {};
// 只显示子节点图标
function showIconForTree2(treeId, treeNode) {
        return treeNode.iconSkin;
}
// 勾选小车
function checkCar2(event, treeId, treeNode) {
    var g = ',';
        k1 = g + treeNode.name,
        k2 = g + treeNode.id,
        _name = g + $('#ddiaopai').val(),
        _id = g + $('#ddiaopaiId').val();

    _name = _name.replace(k1, '');
    _id = _id.replace(k2, '');

    if (treeNode.checked) {
        _name += k1;
        _id += k2;
    }
    $('#ddiaopai').val(_name.replace(',,', ',').substring(1));
    $('#ddiaopaiId').val(_id.replace(',,', ',').substring(1));
}
var setting2 = {
    check: {
        enable: true,
        chkboxType: { "Y": "s", "N": "ps" }
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pid",
            rootPId: null
        }
    },
    view: {
        showIcon: showIconForTree2
    },
    callback: {
        onCheck: checkCar2
    }
};

// 点图选点
function _showMap() {
    var mapID = layer.open({
        type: 1,
        area: ['1000px', '600px'],
        content: '<div class="show-map"><div class="hd">请输入关键字：<input type="text" id="tipinput2" class="ipt"/></div><div class="bd" id="amap"></div></div>'
    })
    $.inmap({
        map: 'amap',
        input: 'tipinput2',
        lng: 'lng1',
        lat: 'lat1',
        chooseFn: function(lnglat, address) {
            $('#slng').html(lnglat.lng);
            $('#slat').html(lnglat.lat);
            $('#asAddressEdit').val(address);
            iconMarker && iconMarker.setMap(null);
            iconMarker = new AMap.Marker({
                map: layerMap,
                position: [lnglat.lng, lnglat.lat],
                icon: new AMap.Icon({            
                    size: new AMap.Size(23, 28), 
                    image: 'assets/images/icon/marker.png'
                })        
            });
            layerMap.setFitView();
            layer.close(mapID);
        }
    })
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
                    iconMarker = null;
                }
            })
            // $('#createTime').jeDate();

            $.inmap({
                map: 'amap',
                input: 'tipinput2',
                chooseFn: function(lnglat, address, map) {
                    $('#slng').html(lnglat.lng);
                    $('#slat').html(lnglat.lat);
                    layerMap = map;
                    iconMarker && iconMarker.setMap(null);
                    iconMarker = new AMap.Marker({
                        map: layerMap,
                        position: [lnglat.lng, lnglat.lat],
                        icon: new AMap.Icon({            
                            size: new AMap.Size(23, 28), 
                            image: 'assets/images/icon/marker.png'
                        })
                    });
                    layerMap.setFitView();
                }
            })
        }
    })
}
// 提交警情
function _alarmSubmit2() {
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
            url: '',
            data: data,
            success: function() {
            }
        })
    }
}


// 车辆树形菜单
function showTree() {
    $('#carTree2').show().next().show();
}
// 车辆树形菜单
function closeTree() {
    $('#carTree2').hide().next().hide();
}


// 暂缓处理
function _defer(id) {
alert('暂缓处理')

}
// 忽略
function _ignore(id) {
alert('忽略')

}
// 保存
function _save(id) {
alert('保存')

}
// 调派
function _dispatch(id) {
alert('调派')
}