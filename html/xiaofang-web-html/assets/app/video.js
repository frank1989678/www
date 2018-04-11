var cars = {};

/**
 * 获取ztree勾选节点的所有小车id集
 */
function getChildCar(treeNode) {
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

/**
 * 点击机构或小车名称
 */
function clickCarName(event, treeId, treeNode) {
    var ids = getChildCar(treeNode);
    var zTree = $.fn.zTree.getZTreeObj('carTree');
    var checked = treeNode.checked;
    $.each(ids, function(i, carId) {
        var node = zTree.getNodeByParam('id', carId, null);
        cars[carId] = !checked;
        zTree.checkNode(treeNode, !checked, true);
        // addCar(node, !checked);
    })
    zTree.cancelSelectedNode(); // 取消节点选中状态
}

/**
 * 勾选机构或小车
 */
function clickCarInput(event, treeId, treeNode) {
    var ids = getChildCar(treeNode);
    var zTree = $.fn.zTree.getZTreeObj('carTree');
    var checked = treeNode.checked;
    $.each(ids, function(i, carId) {
        var node = zTree.getNodeByParam('id', carId, null);
        cars[carId] = checked;
        // addCar(node, checked);
    })
}

// 导入车辆
function add() {
    var zTree = $.fn.zTree.getZTreeObj('carTree');
    var nodes = zTree.getSelectedNodes();
    var ids = getChildCar(nodes);
    var checked = treeNode.checked;
}

// 添加车辆到列表
function addCar(node, op) {
    var $list = $('.list').find('dl');
    if (!node || node.iconSkin !== 'car') {
        return;
    } else if (op && cars.count >= 15) {

    }
    if (op) {
        var dd = '<dd data-id="' + node.id + '">'
                +'   <button type="button" class="ubtn ubtn-white" onclick="removeCar(' + node.id + ')">删除</button>'
                +'   <span class="name">' + node.name + '</span>'
                +'   <button type="button" class="ico ico-voice" onclick="openVoice(this, ' + node.id + ')"></button>'
                +'   <button type="button" class="ico ico-video" onclick="openVideo(this, ' + node.id + ')"></button>'
                +'</dd>';
            $list.append(dd);
            cars.count ++;
    } else {
        cars.count --;
        removeCar(node.id);
    }

    if (cars.count >= 15) {
        $list.find('dt').hide();
    } else {
        $list.find('dt').show();
    }
    cars.$count.html('（' + cars.count + '/15）');
}

// 删除列表车辆
function removeCar(carId) {
    var $list = $('.list').find('dl');
    $list.find('dd').each(function() {
        if ($(this).data('id') === carId) {
            $(this).remove();
            var zTree = $.fn.zTree.getZTreeObj('carTree');
            var node = zTree.getNodeByParam('id', carId, null);
            zTree.checkNode(node, false, true);
            cars.count <= 0 && zTree.checkAllNodes(false);
            return false;
        }
    })
}

// 打开声音
function openVoice(event, carId) {
    var $el = $(event);
    var isOpen = $el.data('status');
    if (isOpen) {
        isOpen = false;
        cars.voice --;
    } else {
        isOpen = true;
        cars.voice ++;
    }
    $el.toggleClass('ico-voice-open').data('status', isOpen);
    cars.$voice.html('（' + cars.voice + '）');
}
// 打开视频
function openVideo(event, carId) {
    $(event).toggleClass('ico-video-open');
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
    cars.count = 0; // 列表车辆数量
    cars.voice = 0; // 麦克风开启数量
    cars.$count = $('.count');
    cars.$voice = $('.voice');
})