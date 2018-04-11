// 地图对象
var map;

var cars = {};

function processData(nodes) {
    var tmpMap = {};
    var r = [];
    $.each(nodes, function(i, obj) {
        tmpMap[obj.id] = obj;
    })

    $.each(nodes, function(i, obj) {
        if (tmpMap[obj.pid] && obj.id != obj.pid) {
            if (!tmpMap[obj.pid].children) {
                tmpMap[obj.pid].children = [];
            }
            tmpMap[obj.pid].children.push(obj);
        } else {
            // r.push(obj);
        }
    })

    $.each(nodes, function(i, obj) {
        if (!obj.iconSkin && tmpMap[obj.pid] && !tmpMap[obj.pid]) {
            // console.log(tmpMap[obj.pid])
            // delete tmpMap[obj.pid];
        }
    })

    console.log(tmpMap)

    // console.log(r)
}

/**
 * 筛选没有车辆的机构
 * @return {Obejct} nodes
 */
function processNode(nodes, treeObj) {
    var rnodes = [];
    $.each(nodes, function(i, node) {
        if (node.children) {
            if (!findSonCar(node)) {
                rnodes.push(node);
            } else {
                rnodes = rnodes.concat(processNode(node.children, treeObj));
            }
        } else if (!node.iconSkin) {
            rnodes.push(node);
        }
    })
    return rnodes;
}

/**
 * 删除没有车辆的机构
 * @param  {Object} treeObj 
 */
function removeNoCarNode(treeObj) {
    var nodes = treeObj.getNodes();
    var nocheck = processNode(nodes, treeObj);
    $.each(nocheck, function(i, node) {
        treeObj.removeNode(node);
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
 * 判断是否有子节点小车
 * @param  {Object} treeNode
 * @return {boolean} true/false
 */
function findSonCar(treeNode) {
    var flag = false;
    $.each(treeNode.children, function(i, node) {
        if (node.iconSkin) {
            flag = true;
        } else if (node.children) {
            flag = findSonCar(node);
        }
        if (flag) {
            return false; // break each
        }
    })
    return flag;
}

/**
 * 勾选机构或小车
 */
function clickCarInput(event, treeId, treeNode) {
    var carTree = $.fn.zTree.getZTreeObj('carTree'),
        nodes = carTree.getCheckedNodes(true),
        value = [],
        carIds = [];
    $.each(nodes, function(i, node) {
        if (node.iconSkin) {
            // 子节点
            if (node.getParentNode().check_Child_State !== 2) {
                value.push(node.name);
            }
            carIds.push(node.id);
        } else {
            var code = node.check_Child_State;
            if (code === -1) { // 不存在 子节点的机构

            } else if (code === 1) { // 部分 子节点被勾选

            } else if (code === 2) { // 全部 子节点被勾选
                var pa = node.getParentNode();
                if (pa && pa.check_Child_State === 2) {
                    // 父节点下的全部 子节点被勾选
                    
                } else if (findSonCar(node)) {
                    value.push(node.name);
                }
            }
        }
        // 保存车辆勾选状态
        cars[node.id] = true;
    })
    if (value.length < 4) {
        $('#jcar').val(value.join(',')).data('tips', '');
    } else {
        $('#jcar').val(value.join(',')).data('tips', '<span>' + value.join('</span>，<span>') + '</span>');
    }
    $('#jcarId').val(carIds.join(','));
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
            'Y': 'ps',
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
        // onClick: clickCarName,
        onCheck: clickCarInput
    }
}

// 调度详情
function _show(iid) {
    $.ajax({
        url: '',
        data: {
            id: iid
        },
        success: function(res) {
            res = {
                "createTime": '2017-09-14 15:23:35',
                "time": '是',
                "clockTime": '2017-09-14 15:23:35',
                "content": '请往前街道口！',
                "address": '街道口',
                "carList": [{
                    "car": "鄂A10001",
                    "status": "已发送"
                }, {
                    "car": "鄂A10002",
                    "status": "已发送"
                }, {
                    "car": "鄂A10001",
                    "status": "已发送"
                }, {
                    "car": "鄂A10002",
                    "status": "已发送"
                }, {
                    "car": "鄂A10001",
                    "status": "已发送"
                }, {
                    "car": "鄂A10002",
                    "status": "已发送"
                }, {
                    "car": "鄂A10003",
                    "status": "已发送"
                }]
            }
            layer.open({
                btn: false,
                title: '调度详情',
                area: '360px',
                content: template('detailTemp', res)
            })
        }
    })
}
// 编辑
function _edit(iid) {
    $.ajax({
        url: '',
        data: {
            id: iid
        },
        success: function(res) {
            window.scrollTo(0, 0);
            res = {
                "car": "鄂A10020",
                "content": '请往前街道口！',
                "address": 'A家风尚酒店(长春路店)',
                "phone": '5000002222',
                "photo": 's',
                "lng": '116.406937',
                "lat": '39.9063',
                "clockTime": '2017-09-14 15:23:35'
            }

            // 回填值
            $('#filter').find('.ipt').each(function(i, item) {
                if (res[this.name]) {
                    if (this.type === 'file') {
                        $(this).after('<input type="text" class="ipt" style="position:absolute;left:0;top:0;" id="jupfile" readonly="" value="' + res[this.name] + '" />');
                    } else {
                        this.value = res[this.name];
                    }
                }
            })
            if (res.clockTime) {
                $('#isClock').addClass('cbx-on').nextAll().show();
            } else {
                $('#isClock').removeClass('cbx-on').nextAll().hide();
            }
            // 显示地图坐标点
            map.clearMap();
            _global.marker = new AMap.Marker({
                map: map,
                position: [res.lng, res.lat],
                icon: new AMap.Icon({
                    size: new AMap.Size(23, 28),
                    image: 'assets/images/icon/marker.png'
                })
            });
            map.setFitView();

            $('#jcancel').show().next().hide();
        }
    })
}
// 删除
function _delRow(iid, el) {
    $.ajax({
        url: '',
        success: function() {
            $(el).closest('tr').remove();
        }
    })
}



var map = new AMap.Map('map',{
    resizeEnable: false
});
//输入提示
var autoOptions = {
    input: "tipinput"
};
var auto = new AMap.Autocomplete(autoOptions);
var placeSearch = new AMap.PlaceSearch({
    map: map
}); //构造地点查询类
AMap.event.addListener(auto, 'select', _autoSelect); //注册监听，当选中某条记录时会触发
AMap.event.addListener(placeSearch, 'markerClick', _markerClick); //注册监听，当点击某个点时会触发
function _autoSelect(e) {
    if (e.poi && e.poi.location) {
        map.setZoom(15);
        map.setCenter(e.poi.location);
        $('#lng').val(e.poi.location.lng);
        $('#lat').val(e.poi.location.lat);
        $('#slng').html(e.poi.location.lng);
        $('#slat').html(e.poi.location.lat);
    }
    placeSearch.setCity(e.poi.adcode);
    placeSearch.search(e.poi.name); //关键字查询查询
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
        mapCallback(pt, address);
    }
}

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
        try {
            mapCallback(pt, address);
        } catch (err) {}
    });
});

// 地图选点回调
function mapCallback(pt, address) {
    var msg = '确定保存该地点经纬度？ <br/>';
    msg += '地点位置：' + address + '<br/>';
    msg += '地点坐标：经度：' + pt.lng + ',纬度：' + pt.lat + '<br/>';

    fx.confirm(msg, function() {
        $('#tipinput').val(address);
        $('#lng').val(pt.lng);
        $('#lat').val(pt.lat);
        $('#slng').html(pt.lng);
        $('#slat').html(pt.lat);
    });
}


var _global = {
    init: function() {
        this.filter();
        this.bindEvent();
    },
    filter: function() {
        var that = this;
        var $form = $('#filter');
        var page = new Page({
            request: false,
            pageIndex: 1, // 当前页
            pageSize: 10, // 每页显示10条
            url: 'http://g.cn',
            callback: function(res) {
                $('#tbody').empty().html(template('tableTemp', res)).viewer('destroy').viewer();
            }
        })

        // 查询
        $form.on('submit', function() {
            var filterData = $form.serializeArray();
            page.request(true, filterData);
            return false;
        })


        function _query() {
            var carNumber = $('#jcar').val();
            if (carNumber.indexOf(',') > -1) {
                $.notify({
                    title: '只能勾选一辆小车',
                    type: 'warning'
                })
            } else {
                var filterData = $form.serializeArray();
                page.request(true, filterData);
            }
        }

        // 发送
        $('#jsubmit').on('click', function() {
            var filterData = $form.serializeArray();
            var data = {};
            $.each(filterData, function(i, item) {
                data[item.name] = item.value;
            })
            if (data['carId'] == '') {
                $.notify({
                    'title': '请至少选择一辆小车',
                    'type': 'warning'
                })
                return false;
            }
            if (data['content'] == '') {
                $.notify({
                    'title': '请填写发送内容',
                    'type': 'warning'
                })
                return false;
            }

            $('#jcancel').hide().next().show();
            $('#jthumb').hide();

            $.ajaxFileUpload({
                type: 'POST',
                url: 'json.php',
                secureuri: false,
                fileElementId: 'jphoto',
                dataType: 'json',
                data: data,
                success: function(data, status) {
                    $.notify({
                        'title': '发送成功！',
                        'type': 'warning'
                    })
                    $form[0].reset();
                    $('#jcar').data('tips', '');
                    $.fn.zTree.getZTreeObj('carTree').checkAllNodes(false);
                    // cars = {};
                    // $('#jcarId').val('');
                    _query();
                },
                error: function(data, status, e) {
                    $.notify({
                        'title': '发送失败！',
                        'type': 'warning'
                    })
                }
            })
        })

        // 取消
        $('#jcancel').on('click', function() {
            $form[0].reset();
            $('#jcar').data('tips', '');
            $('#jcancel').hide().next().show();
            $('#jupfile').remove();
        })

        // 定时发送
        $('#isClock').on('click', function() {
            var time = $(this).hasClass('cbx-on');
            $(this).toggleClass('cbx-on');
            if (time) {
                $(this).next().val('').hide().next().hide();
            } else {
                $(this).nextAll().show();
            }
        }).next().dateRangePicker({
            format: 'YYYY-MM-DD HH:mm',
            autoClose: true,
            singleDate : true,
            singleMonth: true,
            time: {
                enabled: true
            }
        });

    },
    bindEvent: function() {
        $('#jcar').tooltipsy({
            placement: 'right'
        });
    }
}