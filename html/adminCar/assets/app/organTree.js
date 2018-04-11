function clickCar2(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj('agencyTree');
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}
function checkCar2(e, treeId, treeNode) {
    var carTree = $.fn.zTree.getZTreeObj('agencyTree'),
        nodes = carTree.getCheckedNodes(true),
        value = [],
        carIds = [];
    for (var i = 0, l = nodes.length; i < l; i++) {
        value.push(nodes[i].name);
        carIds.push(nodes[i].id);
    }
    $('#parentAgency').val(carIds.join(','));
    $('#parentAgencyName').val(value.join(','));
}

var agencySetting = {
    check: {
        enable: true,
        chkStyle: 'radio',
        radioType: 'all'
    },
    view: {
        showIcon: false,
        dblClickExpand: false
    },
    data: {
        simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid'
        }
    },
    callback: {
        onClick: clickCar2,
        onCheck: checkCar2
    }
};

var req_status = 0;
/**
 * 上级机构树形菜单
 */
function showAgencyMenu() {
    $('#menuContent').show();
    if(req_status === 0){
        $.ajax({
            url: 'json/getOrganTree.json',
            beforeSend: function() {
                $('#menuContent').append('<div class="load"></div>');
            },
            success: function(res) {
                if (res.result === 'success') {
                    $.each(res.data, function(i, item) {
                        item.open = true; // 展开节点
                    })
                    $.fn.zTree.init($('#agencyTree'), agencySetting, res.data);
                    req_status = 1;
                } else {
                    $.notify({
                        title: res.msg
                    })
                }
                $('#menuContent').find('.load').remove();
            }
        })
    }
}
/**
 * 上级机构树形菜单关闭
 */
function closeTree() {
    $('#menuContent').hide();
}

$(function() {
    $('#parentAgencyName').on('click', function() {
        showAgencyMenu();
    })

    // 关闭弹层
    $('body').on('click', function(e) {
        var e = e || window.event;
        var elem = e.target || e.srcElement; 
        while (elem) {
            if (elem.id === 'parentAgencyName' || elem.id === 'menuContent') {
                return;
            } else {
                elem = elem.parentNode;
            }
        }
        closeTree();
    })
})

