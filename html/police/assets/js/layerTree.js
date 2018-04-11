// 车辆里程统计，车辆输入框
function showCars() {
    $.ajax({
        url: 'json/carTree.json',
        dataType: 'json',
        success: function(res) {
            var fireTreeObject = $.fn.zTree.init($("#carList"), set, res);
            var nodes = fireTreeObject.transformToArray(fireTreeObject.getNodes());
            $.each(nodes, function(i, node) {
                if (node.children) {
                    fireTreeObject.setChkDisabled(node, true);
                }
            })
            $('#carList').parent().show();
        }
    })
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
    $(el).nextAll('.choose').html(model.join(''))[model.length ? 'show' : 'hide']();
}
function selectTree(id, treeId) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    var node = zTree.getNodeByParam('id', id);
    zTree.cancelSelectedNode(false);
    zTree.selectNode(node, true);
    $('#' + treeId).prev().hide().prev('.ipt').val(node.name).trigger('blur');
}

// 展开
function expandAll(treeId) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.expandAll(true);
}
// 折叠
function collapseAll(treeId) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.expandAll(false);
}
// 全选
function checkAll(treeId) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.checkAllNodes(true);
}
// 清空
function clearInput(el) {
    $(el).parent().prev('.ipt').val('')
}

$(function() {
    $('body').on('click', function(e) {
        var el = e.target;
        while (el) {
            if ($(el).hasClass('layer-tree') || $(el).hasClass('ipt-tree')) {
                return;
            }
            el = el.parentNode;
        }
        $('.layer-tree').hide().find('.choose').hide();
    })
})