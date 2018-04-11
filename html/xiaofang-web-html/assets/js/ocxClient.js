function getElById(id) {
	return document.getElementById(id);
}
var obj = getElById('video');
var ctrlOffStatus = 1;

// 设置窗口数量
function setWinNum(number) {
	obj.IOcxSetWin(number);
}

// 隐藏功能
function setCtrlOff() {
	ctrlOffStatus = ctrlOffStatus === 1 ? 0 : 1;
	obj.IOCXSetWinFormat(ctrlOffStatus);
}

// 添加设备
function adddev() {
	var server   = getElById("Server").value,
		port     = getElById("CServerPort").value,
		vgroupid = getElById("vgroupid").value,
		vehtype  = getElById("vehtype").value,
		videonum = getElById("videonum").value,
		vehid    = getElById("vehid").value,
		vehname  = getElById("vehname").value;

	obj.NetSet3GServer(server, port);
	obj.DevAddDevice(vgroupid, vehtype, videonum, vehid, vehname, server, port);
}

// 打开视频
function openView() {
	var vehip = getElById("vehip").value,
		chn1  = getElById("Chn1").value;
	adddev();
	obj.IOpenVideo(vehip, chn1);
}
// 视频全开
function openAllView() {
	var vehip = getElById("vehip").value;
	adddev();
	obj.IOpenVideoEx(vehip, 0xff); //打开
}
// 关闭视频
function closeVideo() {
	var vehip = getElById("vehip").value,
		chn1  = getElById("Chn1").value;

	obj.IStopVideo(vehip, chn1);
}
// 视频全关
function closeAllVideo() {
	var vehip = getElById("vehip").value;

	obj.IStopVideoEx(vehip, 0xff);
}

// 视频设置
function localSet() {
	obj.IOCXLocalSet();
}

function localRec() {
	obj.ILocalRecord(getElById("vehip").value, getElById("Chn1").value, "C:\\testrec.avi");
}

function stoplocalRec() {
	obj.IStopLocalRecord(getElById("vehip").value, getElById("Chn1").value);
}

function localSnap() {
	obj.ILocalSnap(getElById("vehip").value, getElById("Chn1").value, "C:\\testocx.bmp");
}

function localScale() {
	obj.IOcxSetScale(0); //0） 全屏，1） 4:3  2）  16:9 	
}

function localSetRecpath() {
	obj.ISetRecordPath("C:\\testocxrec", 1);
}

function localSetSnapPath() {
	obj.ISetSnapPath("c:\\test");
}

// 启动对讲	
function opentel() {
	obj.IStartTel(getElById("vehip").value);
}
// 停止对讲
function closetel() {
	obj.IStopTel(getElById("vehip").value);
}

function IDevPtzSet() {
	obj.IDevSetPtz(getElById("vehip").value, getElById("Chn1").value);
}

function IDevSeeVideoLog() {
	obj.IDevSeeVideoLog(getElById("vehip").value);
}

// 录像回放
function onplayer() {
	obj.IDevPlayback(getElById("vehip").value);
}

// 录像记录
function onGetReclist() {
	obj.IDevGetRecordFileList(getElById("vehip").value, 0xf);
}

// 远程图片查看
function onGetSnaplist() {
	obj.IDevGetSnap(getElById("vehip").value);
}

// 录像策略配置
function RECORDSet() {
	obj.IDevRecordPlan(getElById("vehip").value, getElById("Chn1").value);
}

// 抓拍策略配置
function SnapSet() {
	obj.IDevSnapPlan(getElById("vehip").value, getElById("Chn1").value);
}

function RECrateSet() {
	obj.IDevSetRecordRate(getElById("vehip").value, getElById("Chn1").value);
}

function LiverateSet() {
	obj.IDevSetLiveRate(getElById("vehip").value, getElById("Chn1").value);
}

function OSDSet() {
	obj.IDevSetOSD(getElById("vehip").value, getElById("Chn1").value);
}

function GetInfo() {
	obj.IDevGetStatus(getElById("vehip").value);
}


// 拖拽播放
function onRragOpenView() {

}

// 右键菜单
function onRightClick(event, treeId, treeNode) {
	var $rMenu = $('#rMenu');
	var $rMenu2 = $('#rMenu2');
	if (!treeNode || treeNode.nocheck) {
		$rMenu.hide();
		$rMenu2.hide();
	} else if (treeNode.iconSkin === 'car') {
		var autoH = $rMenu.height() + 12,
			winH = $('body').height();

		// 设置通信号
		getElById("vehip").value = treeNode.vehip;

		$rMenu2.hide();
		if (event.clientY + autoH > winH) {
			$rMenu.css({
				top: event.clientY - autoH - 4,
				left: event.clientX
			}).show();
		} else {
			$rMenu.css({
				top: event.clientY + 4,
				left: event.clientX
			}).show();
		}
	} else {
		var autoH = $rMenu2.height() + 12,
			winH = $('body').height();

		// 设置通信号
		getElById("vehip").value = treeNode.vehip;
		getElById("Chn1").value = treeNode.Chn1; // 通道号是摄像头的id(1-4)

		$rMenu.hide();
		if (event.clientY + autoH > winH) {
			$rMenu2.css({
				top: event.clientY - autoH - 4,
				left: event.clientX
			}).show();
		} else {
			$rMenu2.css({
				top: event.clientY + 4,
				left: event.clientX
			}).show();
		}
	}
}


var setting = {
    check: {
        enable: false,
        chkboxType: { "Y": "", "N": "" }
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
        showLine: true
    },
	callback: {
		// onClick: onRragOpenView,
		onRightClick: onRightClick
	}
};


var _global = {
	init: function() {
		// adddev(); //添加设备
		this.filter();
		this.rightMenu();
		this.ztree();
	},
	rightMenu: function() {
		$(document).on('contextmenu click', function (e) {
			$('#rMenu').hide();
			$('#rMenu2').hide();
		});
	},
	ztree: function() {
		$.ajax({
	        url: 'json/carTree2.json',
	        dataType: 'json',
	        data: {},
	        success: function(res) {
	        	$.fn.zTree.destroy('carTree');
	            var treeObj = $.fn.zTree.init($('#carTree'), setting, res);
	            treeObj.expandAll(true);
	        },
	        error: function() {
	            $.notify({
	                type: 'danger',
	                title: '数据加载失败!'
	            })
	        }
	    })

		// 云台控制
	    $('.yuntai').on('click', '.hd', function() {
	    	$(this).parent().toggleClass('yuntai-extend');
	    	$(this).next().slideToggle()
	    })
	},
	filter: function() {
		$('.nav').on('mouseenter', function() {
			$('#video').css('visibility','hidden')
		}).on('mouseleave', function() {
			$('#video').css('visibility','visible')
		})
	}
}

