var cars = {
    param: {},
    roomId: 0,
    status: false, // 会议开启状态
    camera: 0, // 摄像头数量
    count: 0, // 列表车辆数量
    voice: 0, // 麦克风开启数量
    maxNum: 15     // 最大数量限制
};

function getTree(data) {
    $.ajax({
        url: '/carMonitor/getTree',
        url: 'json/carTree.json',
        dataType: 'json',
        data: data,
        cache: false,
        success: function(res) {
            var newObj = [];
            $.each(res, function(i, item) {
                item.open = true; // 展开节点
                if (item.iconSkin === 'car' && item.carType && item.carState) {
                    // 筛除离线车辆
                    if (item.carState == 2) {
                        return true; // continue
                    }
                    try {
                        item.icon = carIconObj[item.carType]['s' + item.carState];
                    } catch (err) {}
                }
                if (cars[item.id]) {
                    item.checked = true;
                }
                newObj.push(item);
            })
            $.fn.zTree.destroy('carTree');
            $.fn.zTree.init($('#carTree'), setting, newObj);
        },
        error: function() {
            $.notify({
                title: '数据加载失败!'
            })
        }
    })
}

/**
 * 获取ztree勾选节点的所有小车id集
 */
function getChildCar(treeNode, isOrg) {
    var ids = [];
    if (treeNode.iconSkin) {
        ids.push(treeNode.id);
    } else if (treeNode.children) {
        $.each(treeNode.children, function(i, item) {
            ids = ids.concat(getChildCar(item))
        })
    }
    return ids;
}

// 获取ztree所有被勾选的节点集合
function getAllCheckedId() {
    var zTree = $.fn.zTree.getZTreeObj('carTree');
    var nodes = zTree.getCheckedNodes(true);
    var ids = [];
    $.each(nodes, function(i, item) {
        if (item.iconSkin === 'car') {
            ids.push(item.id);
        }
    })
    return ids;
}

/**
 * 点击机构或小车名称
 */
function clickCarName(event, treeId, treeNode) {
    var checked = treeNode.checked;
    clickCarInput(event, treeId, treeNode, checked)
}

/**
 * 勾选机构或小车
 */
function clickCarInput(event, treeId, treeNode, checked) {
    var ids = getChildCar(treeNode, true);
    if (typeof checked !== 'undefined') {
        var zTree = $.fn.zTree.getZTreeObj('carTree');
        zTree.checkNode(treeNode, !checked, true);
        zTree.cancelSelectedNode(); // 取消节点选中状态
        checked = !checked;
    } else {
        checked = treeNode.checked;
    }

    $.each(ids, function(i, carId) {
        cars[carId] = checked;
    })

    if (ids.length === 0) {
        $.notify({
            title: '此机构暂无车辆'
        })
    } else if (checked && getAllCheckedId().length > cars.maxNum) {
        $.notify({
            title: '勾选车辆已达上限'
        })
    }
}

// 导入车辆
function add() {
    var zTree = $.fn.zTree.getZTreeObj('carTree');
    var nodes = zTree.getCheckedNodes(true);
    var model = [];
    if (cars.count >= cars.maxNum) {
        $.notify({
            title: '不可再次导入'
        })
    } else if (nodes.length === 0) {
        $.notify({
            title: '请勾选车辆'
        })
    } else {
        $.each(nodes, function(i, node) {
            // 视频窗口显示车牌号
            if (node.iconSkin === 'car') {
                var isOpen = cars.camera < 4 && cars.voice < 4;
                addCar(node, isOpen);
            }
        })

        if (cars.count >= cars.maxNum) {
            cars.$dl.find('dt').hide();
        } else {
            cars.$dl.find('dt').show();
        }
        cars.$count.html('（' + cars.count + '/' + cars.maxNum + '）');
        cars.$voice.html('（' + cars.voice + '）');
        zTree.checkAllNodes(false);
    }
}

// 添加车辆到列表
function addCar(node, isOpen) {
    var carId = node.id;
    if (cars.param[carId]) {
        return;
        // 已加入
        $.notify({
            title: '已加入',
            content: '车辆 ' + node.name + ' 已在参会列表中'
        })
    } else if (cars.count >= cars.maxNum) {
        return;
        // 已达上限
        $.notify({
            title: '已达上限'
        })
    }

    if (isOpen) {
        cars.camera ++;
        cars.voice ++;
        showSonitor(carId, true, node.name);
    }

    var cls1 = isOpen ? 'ico ico-voice ico-voice-open' : 'ico ico-voice',
        cls2 = isOpen ? 'ico ico-video ico-video-open' : 'ico ico-video';

    var dd = '<dd data-id="' + carId + '">'
            +'   <span class="ubtn ubtn-white" onclick="removeCar(this, ' + carId + ')">删除</span>'
            +'   <span class="name">' + node.name + '</span>'
            +'   <span class="' + cls1 + '" onclick="openVoice(this, ' + carId + ')"></span>'
            +'   <span class="' + cls2 + '" onclick="joinCamera(this, ' + carId + ', \'' + node.name + '\')"></span>'
            +'</dd>';
    cars.$dl.append(dd);
    cars.count ++;
    // 缓存车辆参数
    cars.param[carId] = {
        'carId': carId,
        'audioStatus': isOpen ? 1 : 2,
        'videoStatus': isOpen ? 1 : 2
    }
}

// 删除列表车辆
function removeCar(event, carId) {
    var $el = $(event).parent();
    fx.confirm('是否移除此辆车', function() {
        if(cars.roomId != 0) {
            $.ajax({
                url: '/videoMetting/deleteCarInMeeting',
                data: {'carId':carId,'roomId':cars.roomId},
                dataType: 'json',
                success: function (res) {
                    $.notify({
                        title: '删除成功',
                        type: 'success'
                    });
                   deleteOneCar($el,carId);
                },
                error: function (res) {
                    $.notify({
                        title: '网络错误，请稍后再试',
                        type: 'danger'
                    })
                }
            })
        } else {
            deleteOneCar($el,carId);
        }
    });
}
// 删除列表中的车辆
function deleteOneCar($el, carId) {
    $el.slideUp(300, function() {
        $el.remove();
    });
    cars.count --;
    cars.camera --;
    cars.voice --;
    cars.$count.html('（' + cars.count + '/' + cars.maxNum + '）');
    cars.$voice.html('（' + cars.voice + '）');
    cars.$dl.find('dt').show();
    removeParam(carId);
}

// 删除所有车辆
function removeAllCar() {
    cars.$dl.find('dt').show();
    cars.$dl.find('dd').remove();

    cars.camera = 0;
    cars.count = 0;
    cars.voice = 0;
    cars.$count.html('（' + cars.count + '/' + cars.maxNum + '）');
    cars.$voice.html('（' + cars.voice + '）');
    cars.param = {}; // 清空参数
}

// 添加参数
function addParam(key, name, value) {
    if (!cars.param[key]) {
        cars.param[key] = {};
    }
    cars.param[key][name] = value ? 1 : 2;
}
// 删除参数
function removeParam(key) {
    if (cars.param[key]) {
        delete cars.param[key];
    }
}
// 格式化参数
function formatParam() {
    var paramArray = [];    
    $.each(cars.param, function(key, obj) {
        if (obj.audioStatus || obj.videoStatus) {
            paramArray.push({
                carId: key,
                audioStatus: obj.audioStatus,
                videoStatus: obj.videoStatus,
                roomId: cars.roomId
            })
        } else {
            delete cars.param[key];
        }
    })
    return paramArray;
}

// 打开声音
function openVoice(event, carId) {
    var $el = $(event);
    var isOpen = cars.param[carId]['audioStatus'] === 1;
    var audioStatus;

    var result = function(success) {
        if (success) {
            cars.voice ++;
            cars.param[carId]['audioStatus'] = 1;
            showSonitor(carId, true, name); 
        } else {
            cars.voice --;
            cars.param[carId]['audioStatus'] = 2;
            showSonitor(carId, false); 
        }
        $el.toggleClass('ico-voice-open');
        cars.$voice.html('（' + cars.voice + '）');
    }

    if (isOpen) {
        audioStatus = 2;
    } else {
        audioStatus = 1;
    }
    if(cars.roomId != 0) {
        $.ajax({
            url: '/videoMetting/startAudioOneCar',
            data: {'carId':carId,'roomId':cars.roomId,'audioStatus':audioStatus},
            dataType: 'json',
            success: function (res) {
                var msg = audioStatus === 1 ? '语音开启' : '语音关闭';
                if(res.flag == true) {
                    msg += '成功'
                    $.notify({
                        title: msg,
                        type: 'success'
                    })
                    result(audioStatus === 1);
                } else {
                    msg += '失败';
                    $.notify({
                        title: msg
                    })
                }
            },
            error: function (res) {
                $.notify({
                    title: '网络错误，请稍后再试'
                })
            }
        })
    } else {
        result(audioStatus === 1);
    }
}

// 加入视频
function joinCamera(event, carId, name) {
    var $el = $(event);
    var isOpen = cars.param[carId]['videoStatus'] === 1;
    var videoStatus;

    var result = function(success) {
        if (success) {
            cars.camera ++;
            cars.param[carId]['videoStatus'] = 1;
            showSonitor(carId, true, name); 
        } else {
            cars.camera --;
            cars.param[carId]['videoStatus'] = 2;
            showSonitor(carId, false); 
        }
        $el.toggleClass('ico-video-open');
    }

    if (isOpen) {
        videoStatus = 2;
    } else if (cars.camera >= 4) {
        $.notify({
            title: '无法加入视频'
        })
        return;
    } else {
        videoStatus = 1;
    }
    if(cars.roomId != 0) {
        $.ajax({
            url: '/videoMetting/startVideoOneCar',
            url: '',
            data: {'carId':carId,'roomId':cars.roomId,'videoStatus':videoStatus},
            // dataType: 'json',
            success: function (res) {
                var msg = audioStatus === 1 ? '视频开启' : '视频关闭';
                if(res.flag == true) {
                    msg += '成功'
                    $.notify({
                        title: msg,
                        type: 'success'
                    })
                    result(videoStatus === 1);
                } else {
                    msg += '失败';
                    $.notify({
                        title: msg
                    })
                }
            },
            error: function (res) {
                $.notify({
                    title: '网络错误，请稍后再试'
                })
            }
        })
    } else {
        result(videoStatus === 1);
    }
}

// 监视器显示到右方
function showSonitor(carId, isOpen, name) {
    if (isOpen) {
        $('.video').find('.scrn').each(function() {
            if (!$(this).data('isOpen')) {
                $(this).data('isOpen', true).addClass('player-' + carId).find('.tit').html(name);
                return false;
            }
        })
    } else {
        $('.video').find('.player-' + carId).html('<div class="in"></div><div class="tit"></div>').data('isOpen', false);
    }
}

// 开启视频会议
function openMeet() {
    if (cars.count === 0) {
        $.notify({
            title: '无车辆参加视频会议'
        })
        return;
    }
    var groupMeetingUserList = formatParam();
    if(groupMeetingUserList.length === 0) {
        $.notify({
            title: '请选择列表中的车辆开启视频或语音'
        })
        return;
    }
    if(cars.roomId != 0) {
        $.notify({
            title: '会议已开启'
        })
        return;
    }
    $.ajax({
        url: '/videoMetting/startMeeting',
        data: JSON.stringify(groupMeetingUserList),
        dataType: 'json',
        contentType:"application/json",
        type:"POST",
        success: function (res) {
            $('#roomId').val(res[0].roomId);
            cars.roomId = res[0].roomId;
            $.notify({
                title: '会议开启成功',
                type: 'success'
            })
        },
        error: function (res) {
            $.notify({
                title: '网络错误，请稍后再试',
                type: 'danger'
            })
        }
    })
}
// 关闭视频会议
function closeMeet() {
    var groupMeetingUserList = formatParam();
    if (cars.status) {
        fx.confirm('是否要关闭视频会议', function() {
            $.ajax({
                url: '/videoMetting/closeMeeting',
                data: JSON.stringify(groupMeetingUserList),
                dataType: 'json',
                contentType:"application/json",
                type:"POST",
                success: function (res) {
                    $('#roomId').val(0);
                    cars.roomId = 0;
                    $.notify({
                        title: '关闭会议成功',
                        type: 'success'
                    });
                   // 清空导入车辆列表
                    removeAllCar();
                },
                error: function (res) {
                    $.notify({
                        title: '网络错误，请稍后再试',
                        type: 'danger'
                    })
                }
            })
        })
    }
}
// 打开摄像头
function openCamera() {

}
// 关闭摄像头
function closeCamera() {

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
        dblClickExpand: false,
        showIcon: showIconBySon
    },
    callback: {
        onClick: clickCarName,
        onCheck: clickCarInput
    }
}

$(function() {
    cars.$count = $('.count');
    cars.$voice = $('.voice');
    cars.$dl = $('.list').find('dl');
    cars.roomId = $('#roomId').val();

    cars.$count.html('（' + cars.count + '/' + cars.maxNum + '）');
})