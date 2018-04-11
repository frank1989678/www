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
    // 工具提示
    var $body = $('body');
    $.fn.tooltipsy = function() {
        $(this).on('mouseenter', function() {
            var msg = $(this).data('tips'),
                offset = $(this).offset(),
                w = $(this).outerWidth(),
                h = $(this).outerHeight(),
                $el = $('<div class="tooltipsy"></div>');
                w2 = 0;

            $el.html(msg).hide().appendTo($body);
            w2 = $el.outerWidth();
            $el.css({left: offset.left - (w2 - w)/2, top: offset.top + h}).fadeIn().appendTo($body);
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
            $wrapper.on('click', '.hidable', function() {
                $(this).stop().slideUp(speed, function() {
                    $(this).remove();
                })
            })
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
})(jQuery);

!(function($) {
    $.fn.icheck = function(options) {
        var defaults = {
            parent: 'th .icheck',
            child: 'td .icheck',
            checkedClass: 'icheck-on'
        }

        var $el = $(this),
            $parent = $el.find(defaults.parent);

        // 全选/反选
        $el.on('click', defaults.parent, function() {
            var checked = $(this).hasClass(defaults.checkedClass),
                $child = $el.find(defaults.child);

            if (checked) {
                $(this).removeClass(defaults.checkedClass);
                $child.removeClass(defaults.checkedClass);
            } else {
                $(this).addClass(defaults.checkedClass);
                $child.addClass(defaults.checkedClass);
            }
        })

        $el.on('click', defaults.child, function() {
            var checked = $(this).hasClass(defaults.checkedClass);
            if (checked) {
                $(this).removeClass(defaults.checkedClass);
                $parent.removeClass(defaults.checkedClass);
            } else {
                var m = $el.find('.' + defaults.checkedClass).length,
                    n = $el.find(defaults.child).length;
                if (m + 1 === n) {
                    $parent.addClass(defaults.checkedClass);
                }
                $(this).addClass(defaults.checkedClass);
            }
        })
    }
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
    var $sidebar = $('.side-menu'),
        URL = document.URL.split('#')[0].split('?')[0].toLowerCase(),
        urlBefore = URL.split('/')[3];

    $sidebar.find('a').each(function() {
        var url = this.href.toLowerCase(),
            hrefBefore = url.split('/')[3];

        if (URL === url) {
            $(this).addClass('current').closest('dl').addClass('active expand');
            return false; // break
        }
    }) 

    $sidebar.on('click', 'dt', function() {
        $(this).next().slideToggle()
        .parent().toggleClass('expand').siblings().removeClass('expand')
        .find('dd').slideUp();
    })

    // 导航高亮
    $sidebar.find('.current').closest('dl').addClass('active expand');
}

// 修改密码
function _modifyPwd() {
    var $trigger = $('#jmodifyPwd');
    if ($trigger.length === 1) {
        $trigger.on('click', function() {
            layer.open({
                type: 2,
                area: ['470px', '300px'],
                title: '修改密码',
                content: ['change-pwd.html?s=' + (new Date).getTime(), 'no']
            })
        })
    }
}


function _init() {
    _nav();
    _modifyPwd();
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