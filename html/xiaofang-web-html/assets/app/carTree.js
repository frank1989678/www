var cars = {};
var treeTimer;

// 保存勾选状态使刷新时不会被重置
var nodeChecked = {};
function nodeCollapse(event, treeId, treeNode) {
    nodeChecked[treeNode.id] = false;
}
function nodeExpand(event, treeId, treeNode) {
    nodeChecked[treeNode.id] = true;
}

/**
 * 自动刷新车辆列表
 * @param {Boolean} refresh 是否自动刷新
 */
function autoRefreshCarTree(refresh) {
    treeTimer && clearTimeout(treeTimer);
    if (refresh) {
        treeTimer = setTimeout(function(){
            var str = $('#side').find('.tools .active').attr('onclick');
            // eval(str)
        }, 50 * 1000);
    }
}

// 获取小车树形菜单
function getTree(data) {
    if (typeof window.setting === 'undefined') {
        return;
    }
    $.ajax({
        url: '/carMonitor/getTree',
        url: 'json/carTree.json',
        dataType: 'json',
        data: data,
        cache: false,
        success: function(res) {
            var treeObj,nodes;
            $.fn.zTree.destroy('carTree');
            // treeObj = $.fn.zTree.init($('#carTree'), setting, res);
            // nodes = treeObj.transformTozTreeNodes(res);
            var loop = function(nodes, level) {
                $.each(res, function(i, node) {
                    if (nodeChecked[node.id]) {
                        node.open = true;
                    }
                    if (cars[node.id]) {
                        node.checked = true;
                    }
                    if (node.iconSkin === 'car') {
                        try {
                            node.icon = carIconObj[node.carType]['s' + node.carState];
                            cars[node.id].setIcon(carIconObj[node.carType]['b' + node.carState]);
                        } catch (err) {}
                    } else {
                        node.iconSkin = 'org org' + level + ' ';
                        node.icon = 'assets/images/icon/level' + level + '.png';
                    }
                    if (node.children) {
                        loop(node.children, level+1);
                    }
                })
            }
            // loop(nodes, 1);
            $.each(res, function(i, node) {
                if (nodeChecked[node.id]) {
                    node.open = true;
                }
                if (cars[node.id]) {
                    node.checked = true;
                }
                if (node.iconSkin === 'car') {
                    try {
                        node.icon = carIconObj[node.carType]['s' + node.carState];
                        cars[node.id].setIcon(carIconObj[node.carType]['b' + node.carState]);
                    } catch (err) {}
                }
            })

            treeObj = $.fn.zTree.init($('#carTree'), setting, res);

            if (typeof setting.done === 'function') {
                setting.done(treeObj);
                setting.done = null;
            }
        },
        error: function() {
            $.notify({
                type: 'danger',
                title: '数据加载失败!'
            })
        }
    })
}

// 获取小车树形菜单
function getCarTree(carStatus, efStatus,actionStatus,idx) {
    // 导航高亮
    $('#side').find('.tools .li').eq(idx).addClass('active').siblings().removeClass('active');

    getTree({
        carStatus: carStatus,
        efStatus: efStatus,
        actionStatus:actionStatus
    });

    autoRefreshCarTree(true);
}

function niceResize() {
    $('#carTree').getNiceScroll().resize();
}

$(function() {
    getCarTree(0,0,0,0);

    // 鼠标在车辆列表上时关闭自动刷新
    $('#side').on('mouseenter', function() {
        autoRefreshCarTree(false);
    }).on('mouseleave', function() {
        autoRefreshCarTree(true);
    })

    // var nice = $('#carTree').niceScroll({
    //     cursorcolor: '#333',
    //     cursorwidth: '5px',
    //     cursorborder: 0,
    //     scrollspeed: 60,
    //     mousescrollstep: 40,
    //     autohidemode: 'leave',
    //     background: '#ccc',
    //     cursorborderradius: '5px'
    // })
})

// 搜索车牌号
function searchCar(el) {
    var carNumber = el.value,
        zTree, treeNode, model = [];

    if (carNumber != '') {
        zTree = $.fn.zTree.getZTreeObj('carTree');
        treeNode = zTree.getNodesByParamFuzzy('name', carNumber);
        $.each(treeNode, function(i, item) {
            model.push('<span onclick="selectCar(' + item.id + ')">' + item.name + '</span>');
        })
    }
    $('#autoSearch').html(model.join('')).show();
}

// 搜索定位
function selectCar(carId) {
    var zTree = $.fn.zTree.getZTreeObj('carTree');
    var node = zTree.getNodeByParam('id', carId);
    zTree.cancelSelectedNode(false);
    zTree.selectNode(node, true);
}