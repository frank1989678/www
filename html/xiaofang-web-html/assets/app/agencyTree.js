
function onClickAgency(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("agencyTree");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}
function checkAgency(e, treeId, treeNode) {
    var agencyzTree = $.fn.zTree.getZTreeObj("agencyTree"),
        nodes = agencyzTree.getCheckedNodes(true),
        v = "",
        aid="";
    for (var i=0, l=nodes.length; i<l; i++) {
        v += nodes[i].name + ",";
        aid += nodes[i].id + ",";
    }
    if (v.length > 0 ) v = v.substring(0, v.length-1);
    if (v.length > 0 ) aid = aid.substring(0, aid.length-1);
    $("#agency_name").val(v);
    $("#agencyId").val(aid);

}

var agencySetting = {
    check: {
        enable: true,
        chkStyle: 'radio',
        radioType: 'all'
    },
    view: {
        dblClickExpand: false,
        showIcon: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: onClickAgency,
        onCheck: checkAgency
    }
};

// 警情处置机构tree
function showAgencyMenu() {
    $.ajax({
        url: '/agency/getAgencyTree',
        url: 'json/getAgencyTree.json',
        dataType: 'json',
        success: function(res) {
            var agencyTreeObject = $.fn.zTree.init($("#agencyTree"), agencySetting, res);
            // agencyTreeObject.expandAll(true);
            $('#agencyTree').parent().show();
        }
    })
}

function onClickAgency2(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("frieTree");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}
function checkAgency2(e, treeId, treeNode) {
    var agencyzTree = $.fn.zTree.getZTreeObj("frieTree"),
        nodes = agencyzTree.getCheckedNodes(true),
        v = "",
        aid="";
    for (var i=0, l=nodes.length; i<l; i++) {
        v += nodes[i].name + ",";
        aid += nodes[i].id + ",";
    }
    if (v.length > 0 ) v = v.substring(0, v.length-1);
    if (v.length > 0 ) aid = aid.substring(0, aid.length-1);
    $("#asBurnObject").val(v);
    $("#fireId").val(aid);

}

var fireSetting = {
    check: {
        enable: true,
        chkStyle: 'radio',
        radioType: 'all'
    },
    view: {
        dblClickExpand: false,
        showIcon: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: onClickAgency2,
        onCheck: checkAgency2
    }
};

// 警情燃烧对象tree
function showFireMenu() {
    $.ajax({
        url: '/agency/getAgencyTree',
        url: 'json/getAgencyTree.json',
        dataType: 'json',
        success: function(res) {
            var fireTreeObject = $.fn.zTree.init($("#frieTree"), fireSetting, res);
            var nodes = fireTreeObject.transformToArray(fireTreeObject.getNodes());
            $.each(nodes, function(i, node) {
                if (node.children) {
                    fireTreeObject.setChkDisabled(node, true);
                }
            })
            // fireTreeObject.expandAll(true);
            $('#frieTree').parent().show();
        }
    })
}

// 调派车辆tree
function showCarMenu() {
    $('#carTree2').parent().show();
}


// 树形菜单搜索
function searchTree(el) {
    var val = el.value,
        zTree, treeNode, model = [], treeId;

    if (val != '') {
        treeId = $(el).siblings('.ztree').attr('id');
        zTree = $.fn.zTree.getZTreeObj(treeId);
        treeNode = zTree.getNodesByParamFuzzy('name', val);
        $.each(treeNode, function(i, item) {
            model.push('<span onclick="selectTree(' + item.id + ',\'' + treeId + '\')">' + item.name + '</span>');
        })
    }
    $(el).next().html(model.join(''))[model.length ? 'show' : 'hide']();
}
function selectTree(id, treeId) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    var node = zTree.getNodeByParam('id', id);
    zTree.cancelSelectedNode(false);
    zTree.selectNode(node, true);
    $('#' + treeId).prev().hide().prev('.ipt').val(node.name);
}



// 代码块可优化
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "agency_name" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
        hideMenu();
    }
}
