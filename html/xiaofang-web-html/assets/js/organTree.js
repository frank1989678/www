
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
        chkStyle: "radio",
        radioType: "all"
    },
    view: {
        dblClickExpand: false
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

var req_status = 0;
function showAgencyMenu() {
    if(req_status==0){
        $.getJSON("/organ/getOrganTree",{},function(data){
            var treeObj = $.fn.zTree.init($("#agencyTree"), agencySetting, data);
            treeObj.expandAll(true);
            req_status = 1;
            $('#menuContent').show();
        });
    }else{
        $('#menuContent').show();
    }
}
// 车辆树形菜单关闭
function closeTree() {
    $('#menuContent').hide();
}

// 车辆树形菜单
// function showAgencyMenu() {
//     if(req_status==0){
//         $.ajax({
//             url: 'json/carTree.json',
//             dataType: 'json',
//             success: function(res) {
//                 var treeObj = $.fn.zTree.init($("#agencyTree"), agencySetting, res);
//                 treeObj.expandAll(true);
//                 req_status = 1;
//                 $('#menuContent').show().next().show();
//             }
//         })
//     }else{
//         // showAgencyTree();
//         $('#menuContent').show().next().show();
//     }
// }

// function showAgencyTree(){
//     agencyTreeObject.expandAll(true);
//     var agencyObj = $("#agency_name");
//     var agencyOffset = $("#agencyId").offset();
//     $("#menuContent").css({left:agencyOffset.left + "px", top:agencyOffset.top + agencyObj.outerHeight() + "px"}).slideDown("fast");
//     $("body").bind("mousedown", onBodyDown);
// }


// function hideMenu() {
//     $("#menuContent").fadeOut("fast");
//     $("body").unbind("mousedown", onBodyDown);
// }
// function onBodyDown(event) {
//     if (!(event.target.id == "menuBtn" || event.target.id == "agency_name" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
//         hideMenu();
//     }
// }

