$.fn.extend({
    //表单加载json对象数据
    setForm: function (jsonValue) {
        var obj = $(this);
        $.each(jsonValue, function (name, ival) {
            var $oinput = obj.find("[name=" + name + "]"),
                type = $oinput.eq(0).attr("type");

            if (type == "checkbox" || type == "radio") {
                if (ival !== null) {
                    ival = ";" + ival + ";";
                    $oinput.each(function(i) {
                        if (ival.indexOf(this.value + ";") > -1) {
                            this.checked = true;
                        } else {
                            this.checked = false;
                        }
                    })
                }
            } else {
                $oinput.val(ival);
            }
        })
    }
});
!(function($) {
    function MyDate(options) {
        var that = this;
        var defaults = {
            isinitVal: false,
            format: 'YYYY-MM-DD'
        }
        $.extend(defaults, options ||{});
        that.start = {};
        that.end = {};
        if (options.start) {
            that.start = {
                format: defaults.format,
                isinitVal: defaults.isinitVal,
                initAddVal: {MM:"-1"},
                maxDate: $.nowDate({DD:0}), //最大日期
                choosefun: function(elem,datas){
                    that.end.minDate = datas; //开始日选好后，重置结束日的最小日期
                    that.end.trigger = false;
                    options.end && that.$end.jeDate(that.end);
                }
            }
            that.$start = $(options.start);
            that.$start.jeDate(that.start);
        }
        if (options.end) {
            that.end = {
                format: defaults.format,
                isinitVal: defaults.isinitVal,
                maxDate: $.nowDate({DD:0}), //最大日期
                choosefun: function(elem,datas){
                    that.start.maxDate = datas; //将结束日的初始值设定为开始日的最大日期
                }
            }
            that.$end = $(options.end);
            that.$end.jeDate(that.end);
        }
    }
    $.mydate = function(options) {
        return new MyDate(options);
    }
})(jQuery);

!(function($) {
    $.fn.dragScroll = function() {
        return this.each(function() {
            var $el = $(this);
            var drag = false;
            var pageX = 0;
            var xPos = 0;
            $el
            .css({'cursor':'move', 'overflow':'hidden', 'white-space':'nowrap'})
            .scrollLeft(0)
            .on('mousedown', function(event) {
                drag = true;
                pageX = event.pageX;
                return false;
            })
            .on('mousemove', function(event) {
                if (drag) {
                    var distance = event.pageX - pageX;
                    $el.scrollLeft(xPos + distance);
                }
            })
            .on('mouseup', function(event) {
                pageX = event.pageX;
                xPos = $el.scrollLeft();
                drag = false;
                return false;
            })
            .on('selectstart', function() {
                return false;
            })
        })
    }
})(jQuery);

// 语音报警
!(function($) {
    var _time = 3;
    var isIe8 = navigator.userAgent.indexOf('MSIE 8.0') > 0;
    var mp3 = 'assets/voice/warn.mp3';
    var voice = isIe8 ? 
        '<embed id="warnMusic" autostart="false" loop="true" hidden="true" style="display:none;" type="audio/mp3" src="_src_"></embed>' : 
        '<audio id="warnMusic" autostart="false" loop="loop" hidden="true" style="display:none;"><source src="_src_" type="audio/mpeg"/></audio>';

    $.playMusic = function(time, src) {
        time = time || _time;
        src = src || mp3;
        $('#warnMusic').remove();
        $('body').append(voice.replace(/_src_/, src));
        document.getElementById('warnMusic').play();
        timer = setTimeout(function() {
            $('#warnMusic').remove();
        }, time * 1e3);
    }

    $.stopMusic = function(time) {
        time = time || 1;
        timer = setTimeout(function() {
            $('#warnMusic').remove();
        }, time * 1e3);
    }
})(jQuery);

!(function($) {
    $.fn.splash = function(options) {
        var defaults = {
            times: 10
            ,time: 0
            ,bg2: '' 
        }
        var timer = null;
        var set = $.extend({}, defaults, options);
        var $el = $(this),
            actioning = $(this).data('action');
        if (actioning && actioning === 'true') {
            return false;
        } else {
            $el.data('action', 'true');
        }

        timer = setInterval(function() {
            if (set.time % 2 === 0) {
                $el.addClass(set.bg2);
            } else {
                $el.removeClass(set.bg2);
            }
            set.time++;
            if (set.time >= set.times) {
                clearInterval(timer);
            }
        }, 500);
    }
})(jQuery);

!(function($) {
    // 工具提示
    var $body = $('body');
    $.fn.tooltipsy = function() {
        $(this).on('mouseenter', function() {
            var msg = $(this).data('tips'),
                offset = $(this).offset(),
                w = $(this).outerWidth(),
                $el = $('<div class="tooltipsy"></div>');
                w2 = 0,
                h2 = 0;

            $el.html(msg).hide().appendTo($body);
            w2 = $el.outerWidth();
            h2 = $el.outerHeight();
            $el.css({left: offset.left - (w2 - w)/2, top: offset.top - 8 - h2}).fadeIn().appendTo($body);
        }).on('mouseleave', function() {
            $('.tooltipsy').remove();
        })
    }
    $('.tooltip').tooltipsy();
})(jQuery);


!(function($){
    var defaults = {
        clickToHide: true   // 点击关闭
        ,delay: 4e3         // 3秒后自动关闭，为0时不关闭
        ,title: ''          // 文字
        ,content: ''        // 说明
        ,type: 'primary'    // 类型：primary info success danger warning
        ,call: null         // 关闭后回调
    }
    var speed = 300;

    var icons = {
        error: '<i class="fa fa-times-circle"></i>'
        ,success: '<i class="fa fa-check-circle"></i>'
        ,warn: '<i class="fa fa-exclamation-circle"></i>'
    }
    var $wrapper;

    $.notify = function(options) {
        var settings = $.extend({}, defaults, options);
        var modal = [];

        if (!settings.title && !settings.content) {
            return;
        }

        modal.push('<div class="message is-', settings.type, settings.clickToHide ? ' hidable' : '', '">');
        modal.push(    '<div class="title">', settings.title, '</div>');
        modal.push(    '<div class="text">', settings.content, '</div>');
        modal.push('</div>');

        var $modal = $(modal.join(''));
        if (typeof $wrapper === 'undefined') {
            $wrapper = $('<div class="notify-wrapper"></div>').appendTo($('body'));
        }
        $wrapper.prepend($modal);
        if (settings.delay === 0) {
            $modal.slideDown(speed);

        } else {
            $modal.slideDown(speed).delay(settings.delay).slideUp(speed, function() {
                $modal.remove();            
            });
        }
        if (typeof settings.callback === 'function') {
            setTimeout(function() {
                settings.callback();
            }, settings.delay)
        }
    };

    // 点击关闭
    $('body').on('click', '.hidable', function() {
        var $self = $(this);
        $self.stop().slideUp(speed, function() {
            $self.remove();
        });
    })
})(jQuery);

var fx = {
    log: function(msg) {
        if (typeof console !== 'undefined') {
            console.log(msg);
        }
    },
    succeed: function(msg, okey) {
        msg && layer.alert(msg, {
            title: '提示'
        }, function(index) {
            if (typeof okey == 'function') {
                okey();
            }
            layer.close(index);
        })
        return this;
    },
    error: function(msg, okey) {
        msg && layer.alert(msg, {
            title: '错误提示'
        }, function(index) {
            if (typeof okey == 'function') {
                okey();
            }
            layer.close(index);
        })
        return this;
    },
    alert: function(msg, okey) {
        msg && layer.alert(msg, {
            title: '提示'
        },function(index) {
            if (typeof okey == 'function') {
                okey();
            }
            layer.close(index);
        })
        return this;
    },
    confirm: function(msg, okey, cancel) {
        msg && layer.confirm(msg, {
            title: '提示'
        },function(index) {
            if (typeof okey == 'function') {
                okey();
            }
            layer.close(index);
        },function(index) {
            if (typeof cancel == 'function') {
                cancel();
            }
            layer.close(index);
        })
        return this;
    },
    loading: function(msg) {
        msg = msg || '加载中...';
        this.closeLoading();
        $('<div class="spinner">' + msg + '</div>').appendTo($('body'));
    },
    closeLoading: function() {
        $('.spinner').remove();
    },
    // 获取地址栏附带参数
    GetQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    //以字符串输出key-value的obj对象
    printObj: function(obj) {
        var str = "";
        for (var key in obj) {
            str += key + "=" + obj[key] + "   ";
        }
        return str;
    },
    // 图片转base64
    imgToBase64 : function (url, callback, outputFormat){
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image;

        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img,0,0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback.call(this, dataURL);
            canvas = null; 
        };
        img.src = url;
    },
    replaceAll: function(str, s1, s2) {
        return str.replace(new RegExp(s1, "gm"), s2);
    },
    // 获取表单数据并生成json
    getFormJson: function(frm) {
        var o = {};
        var a = $(frm).serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });

        return o;
    },
    //异步请求
    request: function(url, data, success, error, before) {
        if (!data) {
            data = {};
        }
        //加载中
        fx.loading();
        $.ajax({
            timeout: 20000,
            type: "POST",
            dataType: "json",
            url: url,
            data: data,
            beforeSend: before,
            error: function(jqXHR, textStatus, errorThrown) {
                fx.closeLoading();
                if (typeof(error) == "function") {
                    error();
                } else if (textStatus == "timeout") {
                    $.notify({
                        type: 'danger',
                        content: '网络超时，请稍候再试'
                    })
                } else {
                    $.notify({
                        type: 'danger',
                        content: '请稍后再试'
                    })
                }
            },
            success: function(datas, status) {
                fx.closeLoading();
                if (datas.expCode != undefined && datas.expCode == 'E000') {
                    fx.error(datas.expMsg);
                    setTimeout(function() {
                        if (window.parent) {
                            window.parent.location = basePath;
                        } else {
                            window.location = basePath;
                        }

                    }, 1000);
                    return false;
                }
                if (datas.result == "SUCCESS") {
                    success(datas);
                } else {
                    var msg = datas.message || datas.expMsg || '';
                    if (typeof(error) == "function") {
                        error(msg);
                    } else {
                        $.notify({
                            type: 'danger',
                            content: msg
                        })
                    }
                }
            }
        });
    }
};

// 导航高亮
function _nav() {
    var $nav = $('.nav'),
        URL = document.URL.split('#')[0].split('?')[0].toLowerCase(),
        urlBefore = URL.split('/')[3];

    // 导航高亮
    $nav.find('a').each(function() {
        var url = this.href.toLowerCase(),
            hrefBefore = url.split('/')[3];

        if (URL === url) {
            $(this).addClass('active').closest('li').addClass('current');
            return false; // break
        }
    })
}

// 修改密码
function _modifyPwd() {
    var $trigger = $('#mdyPwd');
    if ($trigger.length === 1) {
        $trigger.on('click', function() {
            layer.open({
                title: false,
                type: 2,
                area: ['470px', '300px'],
                content: ['change-pwd.html?s=' + (new Date).getTime(), 'no']
            })
        })
    }
}

// 更换主题
function _modifyTheme() {
    var $trigger = $('#mdyTheme');
    if ($trigger.length === 1) {
        $trigger.on('click', function() {
            layer.open({
                title: false,
                type: 2,
                area: ['470px', '360px'],
                content: ['change-theme.html?s=' + (new Date).getTime(), 'no']
            })
        })
    }
}

function _fix() {
    var $window = $(window),
        F = $('.footer').outerHeight(),
        timer = 0;

        
    // 页面高度处理
    var fix = function() {
        var height = $window.height();
        $('.wrapper').css('min-height', height - F - 90 - 40);
    }

    $window.on('resize.scroll', function() {
        timer && clearTimeout(timer);
        timer = setTimeout(function() {
            fix();
        }, 99);
    })

    fix();
}

function _side() {
    $('#side').on('click', '.open', function() {
        // $('#side').toggleClass('fold');
        $('.wrapper').toggleClass('fold');
    })

    $('.open').on('click', function() {
        $(this).parent().toggleClass('fold');
    })
}

function _init() {
    _side();
    _nav();
    _fix();
    _modifyPwd();
    _modifyTheme();
    if (typeof _global !== 'undefined' && _global.init) {
        _global.init();
    }

    // 关闭弹层
    $('body').on('click', '.layer-close', function() {
        layer.closeAll();
    })
}
$(function() {
    _init();
})