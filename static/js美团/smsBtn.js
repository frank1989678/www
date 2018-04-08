define(["zepto.js", "common/msg.js"], function($, msg) {
    var timer;
    var $body = $("body");
    function btnCountdown($btn) {
        $('.mj_login').removeClass('btn-disabled').removeAttr('disabled');
        clearInterval(timer);
        $btn.attr('disabled', 'disabled');
        var countDown = 60;

        var timer = setInterval(function () {
            if (countDown) {
                if ($body.hasClass("waimai")) {
                    $btn.text((countDown > 10 ? countDown : (' ' + countDown)) + '秒重新获取');
                    if (countDown === 30 && $('.J-not-received').length > 0) {
                        $('.J-not-received').show();
                    }
                }else {
                    $btn.text((countDown > 10 ? countDown : (' ' + countDown)) + '秒');
                }
                countDown--;
            } else {
                clearInterval(timer);
                if ($body.hasClass("waimai")) {
                    $btn.removeAttr('disabled').text('再次获取验证码');
                }else {
                    $btn.removeAttr('disabled').text('再次发送验证码');
                }
            }
        }, 1000);
        return timer;
    }

    function btnStopCountdown($btn) {
        clearInterval(timer);
        if ($body.hasClass("waimai")) {
            $btn.removeAttr('disabled').text('获取验证码');
        }else {
            $btn.removeAttr('disabled').text('发送验证码');
        }
    }


    return function (dom) {
        var $dom = $(dom);
        var $phone = $dom.find('[type=tel]');
        var $btn = $dom.find('.btn');
        var url = $dom.data('requrl');
        var captchaCode = null;
        var $inputSms = $( ".J_input_sms" );
        var $verifyBtn = $(".J-verify-btn");

        //初始化  输入验证码的input不可用 防止误切换到验证码输入框 输入验证码的误操作
        $inputSms && $inputSms.attr( "disabled", "true" );
        //设置初始化验证按钮不可用
        $verifyBtn && $verifyBtn.attr( "disabled", "true" );

        function checkInput() {
            //后台返回用户手机时有时带***,此时可以不必校验
            if (/^[\d*]{11}$/.test($phone.val())) {
                btnStopCountdown($btn, timer);
            } else {
                $btn.attr("disabled", "disabled");
            }
            // if ($body.hasClass("waimai") && (parseInt(window.localStorage.getItem("telNum")) > 0)) {
            //     btn.removeAttr("disabled");
            // }
        }

        if ($phone.length) {
            $phone.on("setVal", checkInput);
            $phone.on("input", checkInput);
            checkInput();
        }
        var confirm = false;
        function sendSMS () {
            var params = $dom.data('params') || {};

            btnStopCountdown($btn, timer);
            timer = btnCountdown($btn);
            if ($phone) {
                params.mobile = $phone.val();
            }
            if (confirm) {
                params.confirm = true;
            }
            if (captchaCode) {
                params.captcha = captchaCode;
                captchaCode = null;
            }
            $.post(url, params, function (res, status) {
                res = JSON.parse(res);
                //已绑定
                if (res.ext && res.ext.captchaUrl) {
                    btnStopCountdown($btn, timer);
                    verifyAccount(res.ext.captchaUrl);
                } else if (res.status == 101055) {
                    msg.confirm(res.msg || "此号码已绑定，如果确认则会解绑原账号。请确认", {
                        ok: function () {
                            confirm = true;
                            sendSMS();
                        }
                    });
                } else if(res.status == 121007) {
                    msg.alert(res.message || res.msg || "抱歉，请求失败", function() {
                        if(res.data) {
                            location.href = res.data;
                        }
                    });
                } else if (status != 'success' || (res.status != 0 && res.status != -20001)) {
                    btnStopCountdown($btn, timer);
                    msg.alert(res.message || res.msg || "抱歉，请求失败");
                } else if (res.status == -20001) {
                    location.href = "/upsms/send?backurl=" + encodeURIComponent(location.href);
                } else {
                    //发送成功
	                //发送验证码后 验证码输入框才可用
	                $inputSms && $inputSms.removeAttr( "disabled" );
                    $verifyBtn && $verifyBtn.removeAttr( "disabled" );
                }
            });
        }
        /**
         * 短信验证美团账户
         */
        function verifyAccount(url) {
            msg.dialog({
                title: "<h1>请输入验证码</h1>",
                content: '<div data-com="captcha" captcha-src="'+url+'" class="captcha"><input id="mobile-captcha" class="input-weak" type="text" autocomplete="off" placeholder="请输入验证码" value="" name="captcha" style="width:1.9rem"/>'
                        +'<span class="refresh">'
                            +'<img id="captcha-box" src="" alt="加载中……" style="width:1.4rem;height:.84rem"/>'
                            +'<button class="btn btn-weak">换一张</button>'
                        +'</div></span>',
                footer: "确认",
                okFun: function () {
                    captchaCode = $('#mobile-captcha').val();
                    sendSMS();
                },
                okText: "确认"
            });
        }
        $btn.on("click", sendSMS);
    }
});
