var TEXTCODE = {
    "carUse": {
        1: '出租营运',
        2: '客运',
        3: '工程运输',
        4: '危险货物运输',
        5: '交通大队警用摩托',
        6: '交通大队警用汽车',
        7: '特警专用',
        8: '汉警快骑',
        9: '搬家公司车',
        10: '混泥土搅拌车',
        11: '绿通车',
        12: '普通货运车',
        13: '邮政快递车',
        14: '消防车'
    },
    "carStatus": {
        1: "离线",
        2: "在线"
    },
    "actionStatus": {
        1: "未出警",
        2: "通知",
        3: "出动",
        4: "到场",
        5: "返队",
        6: "归队"
    },
    "efStatus": {
        1: "未报警",
        2: "出围栏报警",
        3: "进围栏报警"
    },
    "statusReturn": {
        1: "未报警",
        2: "支援求助",
        3: "车辆故障",
        4: "车辆缺水",
        5: "车辆缺泡沫"
    },
    "asType": {
        1: "火灾",
        2: "社会救援",
        3: "抢险救援",
        4: "勤务保卫"
    },
    "asLevel": {
        1: "一级警情",
        2: " 二级警情",
        3: "三级警情",
        4: "四级警情"
    },
    "actionStatus": {
        1: "未出警",
        2: "通知",
        3: "出动",
        4: "到场",
        5: "返队",
        6: "归队"
    },
    "burnObj": {}
}

/**
 * 解析警情燃烧对象
 */
function getASTypeMapper() {
    $.ajax({
        url: '/alarmSituation/getASTypeMapper',
        url: 'json/getASTypeMapper.json',
        success: function(res) {
            $.each(res, function(i, item) {
                TEXTCODE['burnObj'][item.val] = item.key;
            })
        }
    })
}
$(function() {
    getASTypeMapper();
})