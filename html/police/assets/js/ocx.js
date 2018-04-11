// 摄像头开启状态 boolean
var cameraStatus1 = false; 
// 客户端临时存放文件路径
var clientImagePath = 'D:\\wamp\\www\\gzyitop\\dzda2\\dzda2-web-html3\\uploads\\';
var set = {};

$(function() {
    set.loginName = 'admin';
})

function stopCamera1() {
    if (cameraStatus1 === true) {
        try {
            var status = captrue.bStopPlay();
            if (status === true) {
                cameraStatus1 = false;
            }
        } catch (err) {}
    }
}

function openCamera1() {
    if (cameraStatus1 === false) {
        try {
            cameraStatus1 = captrue.bStartPlayRotate(270);
            captrue.vSetResolution(7);
            captrue.bSetMode(3);
        } catch (err) {}
    }
}


// 打开人像摄像头
function openCamera2() {
    try {
        captrue.bStartPlay2(0);
    } catch (err) {}
}

// 拍照完成预览图片，高亮显示下一个待扫描区
function previewImg($el, url) {
    var idx = $el.index(),
        h = $el.outerHeight() + 20;
    
    $el.find('.thumb').removeClass('file').html('<img src="' + url + '"><i></i>');
    $el.removeClass('on').next().addClass('on').find('.name').trigger('click.light');
    $el.splash({bg2: 'lighting', speed: 200, times: 6}); // 闪烁提示

    $('#scan1').find('.inner').animate({
        scrollTop: idx * h
    }, 300);
}

// 人像拍照弹出框
function showCamera() {
    var $side = $('#scan1').find('.inner');
    var $curr = $side.find('.on');
    var idx = $curr.index();

    if (idx === -1) {
       $curr = $side.find('.group:eq(0)').addClass('on');
       idx = 0;
    }
    // 前2个为人脸拍照
    if (idx > 1) {
        $.notify({
            title: '无法进行拍照',
            content: '请先点击办理人照片或拍照人照片'
        })
        return;
        $curr = $side.find('.group:eq(0)');
        idx = 0;
    }
    set.idx = idx;
    set.seq = $curr.data('seq');
    $curr.addClass('on').siblings().removeClass('on');
    $side.scrollTop(0);
    stopCamera1();
    var url = window.showModalDialog('camera.html', set, 'dialogHeight:530px; dialogWidth: 560px; status:no; scroll=no;resizable:no;');

    if (url) {
        // 拍完图片滚动无效果
        setTimeout(function() {
            previewImg($curr, url);
        }, 1);

        if (idx === 0) {
            // 拍完照片后，进行人脸识别（需已扫描身份证）
            idCard.compare();

        } else if (idx === 1) {
            // 拍完经办人打开主摄像头
            openCamera1();
        }
    }
}

// 人像拍照保存并上传图片
function savePortrait() {
    checkFolder();
    var fileName = getSystemTime() + '_' + set.loginName + '_' + set.idx + '_' + set.seq;
    var result = captrue.bSaveJPG(clientImagePath + set.loginName + '\\', fileName);

    if (result) {
    	// result = captrue.bUpLoadImageEx(clientImagePath + set.loginName + '\\' +  fileName + '.jpg', set.serverIp, set.serverPort, set.servletPath, 0, 0);
        if (result) {
            imgUrl = 'uploads/' + set.loginName + '/' + fileName + '.jpg';
            window.close();
        } else {
            alert('网络错误');
            captrue.bDeleteFile(clientImagePath + fileName + '.jpg');
        }
    } else {
        alert('拍照失败');
        captrue.bDeleteFile(clientImagePath + fileName + '.jpg');
    }
}

/**
 * 扫描
 */
function savePhoto() {
    var $side = $('#scan1').find('.inner'),
        $curr = $side.find('.on'),
        idx = $curr.index(),
        amount = $side.children('.group').length,
        seq = $curr.data('seq') || $curr.find('.select2').val() || 42,
        isLast = false;

    if (idx === -1) {
        // 没有选中图片时
        idx = amount;
        isLast = true;

    } else if (idx < 2) {
        //如果选择人像替换扫描提示错误
        $.notify({
            title: '无法进行扫描',
            content: '请点击拍照按钮'
        })
        return;

    } else if (amount >= 30) {
        $.notify({
            title: '影像图片不能超过30张'
        })
        return;
    }

    var result = savePicture(seq, idx);
    var top = 0;

    if (result.url === '') {
        // 拍照失败 or 上传图片失败
        $.notify({
            title: result.msg
        })
        return;

    } else if (isLast) {
        $side.append('<div class="group"><div class="thumb"></div><div class="name"><select id="j_slt' + idx + '" class="select2"></select></div></div>');
        $('#j_slt' + idx).html(otherNames.join('')).select2(); // 初始化
        $curr = $side.find('.group:last');
    }

    previewImg($curr, result.url);

    // 比对方法
    $.ajax({
        url: '/video/compare',
        data: {url: result.url},
        cache: false,
        beforeSend: function() {
        	isAjax = true;
        },
        complete: function() {
        	isAjax = false;
        },
        success: function(res) {
            $('#idcard2').html(res.msg);
        }
   })
}


// 影像扫描保存并上传图片
function savePicture(seq, idx) {
    openCamera1();
    checkFolder();
    var msg = '拍照失败';
    var url = '';
    var fileName = getSystemTime() + '_' + set.loginName + '_' + idx + '_' + seq;
    var result = captrue.bSaveJPG(clientImagePath + set.loginName + '\\', fileName);
    if (result) {
    	// var result = captrue.bUpLoadImageEx(clientImagePath + set.loginName + '\\' +  fileName + '.jpg', set.
        // , set.serverPort, set.servletPath, 0, 0);
        if (result) {
            url = 'uploads/' + set.loginName + '/' + fileName + '.jpg';
        } else {
            msg = '图片上传失败';
        }
    }
    return {result: result, url: url, msg: msg};
}

// 人像摄像头设置
function ParaSet_onclick() {
    var str = captrue.displayVideoPara();
}

// 获取当前系统时间
function getSystemTime() {
    var date   = new Date();
    var year   = date.getFullYear();
    var month  = date.getMonth() + 1
    var day    = date.getDate();
    var hour   = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return ([year, month, day, hour, minute, second]).map(function (n) {
        n = n.toString();
        return n[1] ? n : '0' + n
    }).join('');
}

// 人像摄像头检测文件夹是否存在
function checkFolder(){
    var folderpath = clientImagePath + set.loginName;
    var result = captrue.bCreateDir(folderpath);
    if(!result){
        alert('图片缓存目录创建失败!' + folderpath);
    }
}

// 清空客户端临时文件夹
function clearTempFolder(){
    var strFolder = clientImagePath + set.loginName;
    var result = captrue.bDeleteFileForever(strFolder);
}

// 读取身份证
var idCard = {
    log: function(msg) {
        $('#idcard1').html(msg + '<br />')
    },
    base64: '',
    port: 0,
    // 循环串口号打开设备，并保存串口号
    getPortAndOpen: function() {
        var result = false;
        for (var i = 1; i <= 16; i ++) {
            result = objActiveX.hxgc_OpenReader(i); // 打开设备
            if (result == 0) {
                this.port = i;
                break;
            }
        }
        return result;
    },
    open: function() {
        var result = false;
        if (this.port !== 0) {
            result = objActiveX.hxgc_OpenReader(this.port); // 打开设备
        } else {
            result = this.getPortAndOpen();
        }
        if (result === 0) {
            // this.log('打开设备成功')
        } else {
            this.log('打开设备失败' + result)
        }
    },
    close: function() {
        var result = objActiveX.hxgc_CloseReader(this.port); //关闭设备
        if (result == 0) {
            // this.log('关闭设备成功')
        } else {
            this.log('关闭设备失败')
        }
    },
    read: function() {
        var that = this;
        that.open();
        that.readIdCard();
        that.close();
    },
    // 异步读取身份证信息，修复扫描仪异常bug（如过一会在操作，或反复读取，设备无法正常工作。待验证）
    readIdCard: function() {
        var that = this;
        var logs = [];
        var result = objActiveX.hxgc_ReadIDCard(this.port); //读二代证
        if (result == 0) {
            var fileName   = getSystemTime() + '_' + set.loginName + '_' + 0 + '_' + 42 + '.jpg';
            var text_name  = objActiveX.hxgc_GetName(); //姓名
            var text_idNum = objActiveX.hxgc_GetIDCode(); //身份证号
            var begin_time = objActiveX.hxgc_GetBeginPeriodOfValidity(); // 生效日期
            var end_time   = objActiveX.hxgc_GetEndPeriodOfValidity();  // 结束日期
            var ymd        = that.getYmd(); // 系统时间

            logs.push('身份证姓名：' + text_name + '<br />');
            logs.push('身份证号码：' + text_idNum + '<br />');
            logs.push('有效期限：' + that.formatYmd(begin_time) + '-' + that.formatYmd(end_time));
            
            result = objActiveX.hxgc_SavePhAsJpg(clientImagePath, fileName);

            if (ymd > end_time) {
                logs.push('<font color="red">身份证已过期</font>');

            } else if (result == 0) {
                that.base64 = objActiveX.hxgc_SavePhAsJpgBase64();
                setTimeout(function() {
                    $('#idcard1').append('<font color="red">人脸比对失败</font>');
                }, 1000);
                // 因停电，内网人脸对比接口响应时间过长，暂时使用模拟数据
                // that.compare();
            } else {
                logs.push('身份证图片保存失败');
            }
            that.log(logs.join(''))      
        } else {
            that.log('<font color="red">读二代证信息失败</font>')
        }
    },
    // 人像识别
    compare: function() {
        var strPhotoBase64 = this.base64;
        if (strPhotoBase64) {
            $.ajax({
                url: '/face/comparison',
                type: 'POST',
                data: {cardPhotoBase64: strPhotoBase64},
                dataType: 'json',
                success: function(res) {
                    if(res.code == '1') {
                        $('#idcard1').append(res.mes);
                    }else if(res.code == '0') {
                        $('#idcard1').append('<font color="red">' + res.mes + '</font>');
                    }
                }
            })
        }
    },
    // 获取年月日
    getYmd: function() {
        var date = new Date();
        var yyyy = date.getFullYear();  // 年
        var MM = date.getMonth() + 1;   // 月
        var dd = date.getDate();        // 日
        var ymd = [yyyy, MM, dd].map(function(n) {
            return n < 10 ? '0' + n : n;
        }).join('');

        return ymd;
    },
    formatYmd: function(dateTime) {
        return isNaN(dateTime) ? dateTime :
            dateTime.substr(0,4) + '.'
            + dateTime.substr(4,2) + '.'
            + dateTime.substr(6,2)
    }
}

