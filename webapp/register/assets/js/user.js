//账号注册验证码发送
function sendMessage() {
    if ($("#txtMobile").val() == "" || String($("#txtMobile").val()).length != 11) {
        alterError("手机号码不正确！");
        return false;
    }
    //向后台发送处理数据
    $.ajax({
        type: "POST", //用POST方式传输
        dataType: "json",
        url: '../../tools/app_ajax.ashx', //目标地址
        url: 'http://app.zbs6.com/tools/app_ajax.ashx',
        data: {
            "type": 203,
            "mobile": $("#txtMobile").val()
        },
        beforeSend: function (XMLHttpRequest) {
            subloading_open();  
        },
        complete: function (XMLHttpRequest, textStatus) {
            subloading_close();
        },
        success: function (data, textStatus) {
            if (data.status == 1) {              
                alterSuccess('验证短信已发送请留意查收！');
                //倒计时开始
                curCount = count;
                $("#btnSendCode").attr("disabled", "true");
                $("#btnSendCode").val(curCount + "秒验证码");
                InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
            } else {
                alterError('出错提示：' + data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alterError('状态：' + textStatus + '，出错提示：' + errorThrown);
        },
        timeout: 20000
    });
}
//账号注册发送
function sendRegister() {

    var bischecked = $('#regassist').is(':checked');
   
    if ($("#txtUserName").val() == "") {
        alterError('真实姓名不能为空！');
        return false;
    }
    if ($("#txtMobile").val() == "" || String($("#txtMobile").val()).length != 11) {
        alterError('手机号码不正确！');
        return false;
    }
    if ($("#txtBrand").val() == "") {
        alterError('品牌名称不能为空！');
        return false;
    }
    if ($("#txtProvince").val() == "") {
        alterError('所在省份选择不能为空！');
        return false;
    }
    if ($("#txtCity").val() == "") {
        alterError('所在城市选择不能为空！');
        return false;
    }
    if ($("#txtAddress").val() == "") {
        alterError('收货地址不能为空！');
        return false;
    }
 
    if (!bischecked) {
        alterError('请同意注册协议，再提交！');
        return false;
    }
    //向后台发送处理数据
    $.ajax({
        type: "POST", //用POST方式传输
        dataType: "json",
        url: '../../tools/app_ajax.ashx', //目标地址
        data: {
            "type": 200,
            "realName": $("#txtUserName").val(),
            "mobile": $("#txtMobile").val(),
            "codenum": $("#txtCode").val(),
            "company": $("#txtCompany").val(),
            "brand": $("#txtBrand").val(),
            "phone": $("#txtPhone").val(),
            "wechatName": $("#txtWechatName").val(),
            "qq": $("#txtQq").val(),
            "email": $("#txtEmail").val(),
            "province": $("#txtProvince").val(),
            "city": $("#txtCity").val(),
            "counties": $("#txtArea").val(),
            "address": $("#txtAddress").val(),
            "referrer": $("#txtReferrer").val()
        },
        beforeSend: function (XMLHttpRequest) {
            subloading_open(); //$.AMUI.progress.start();
        },
        complete: function (XMLHttpRequest, textStatus) {
            subloading_close(); //$.AMUI.progress.done();
        },
        success: function (data, textStatus) {
            if (data.status == 1) {
                amConfirm('成功(Success)', '恭喜！申请已提交成功，我们将会在2个工作日内与您取得联系，进行账号开通。', '1');
            } else {
                alterError('出错提示：' + data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alterError('状态：' + textStatus + '，出错提示：' + errorThrown);
        },
        timeout: 20000
    });
}
//timer处理函数
function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        $("#btnSendCode").removeAttr("disabled");//启用按钮
        $("#btnSendCode").val("重新发送验证码");
    }
    else {
        curCount--;
        $("#btnSendCode").val(curCount + "秒验证码");
    }
}
//带确认提示
function amConfirm(title, msg, type) {
    $("#my-confirm").remove(); //删除节点
    var HintHtml = '<div class="am-modal am-modal-confirm" tabindex="-1" id="my-confirm">'
                + '<div class="am-modal-dialog alterCss">'
                + ' <div class="am-modal-hd">{title}</div>'
                + ' <div class="am-modal-bd">{msg}</div>'
                + '<div class="am-modal-footer">'
                + '      <span class="am-modal-btn" style="color:#FFFFFF;" data-am-modal-confirm>确定</span>'
                + '    </div>'
                + '</div>'
                + '</div>';
    HintHtml = HintHtml.replace("{title}", title).replace("{msg}", msg);
    $("#showjg").after(HintHtml); //添加节点
    switch (type) {
        case "1":
            $('#my-confirm').modal({
                closeViaDimmer: false,
                relatedTarget: this,
                onConfirm: function (e) {
                    location.reload();
                }
            });
            break;
    }
}
//数据提交加载开始
function subloading_open() {
    $("#your-modal-loading").remove(); //删除节点
    var HintHtml = '<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1" id="your-modal-loading">'
                + ' <div class="am-modal-dialog">'
                + ' <div class="am-modal-hd">{title}</div>'
                + ' <div class="am-modal-bd">'
                + ' <span class="am-icon-spinner am-icon-spin"></span>'
                + '</div></div></div>';
    HintHtml = HintHtml.replace("{title}", "数据提交中...");
    $("#showjg").after(HintHtml); //添加节点
    $('#your-modal-loading').modal('open'); //显示 Modal 窗口
}
//数据提交加载结束
function subloading_close() {
    $('#your-modal-loading').modal('close'); //关闭 Modal 窗口
}
//成功提示
function alterSuccess(msg) {
    $("#your-modal").remove(); //删除节点
    var HintHtml = '<div class="am-modal am-modal-no-btn " tabindex="-1" id="your-modal">'
                + '<div class="am-modal-dialog alterCss">'
                + ' <div class="am-modal-hd">{title}<a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>'
                + ' </div>'
                + ' <div class="am-modal-bd">{msg}</div>'
                + '</div>'
                + '</div>';
    HintHtml = HintHtml.replace("{title}", "成功(Success)").replace("{msg}", msg);
    $("#showjg").after(HintHtml); //添加节点
    $('#your-modal').modal('open'); //显示 Modal 窗口
}
//出错提示
function alterError(msg) {
    $("#your-modal").remove(); //删除节点
    var HintHtml = '<div class="am-modal am-modal-no-btn " tabindex="-1" id="your-modal">'
                + '<div class="am-modal-dialog alterCss">'
                + ' <div class="am-modal-hd">{title}<a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>'
                + ' </div>'
                + ' <div class="am-modal-bd">{msg}</div>'
                + '</div>'
                + '</div>';
    HintHtml = HintHtml.replace("{title}", "出错(Error)").replace("{msg}", msg);
    HintHtml.replace("{msg}", msg);
    $("#showjg").after(HintHtml); //添加节点
    $('#your-modal').modal(); //显示
}