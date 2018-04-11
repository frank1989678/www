!(function($) {
    // 工具提示
    var $body = $('body');
    $.fn.tooltipsy = function() {
        $(this).on('mouseenter', function() {
            var msg = $(this).data('tips') || false,
                offset = $(this).offset(),
                w = $(this).outerWidth(),
                h = $(this).outerHeight(),
                $el = $('<div class="tooltipsy"></div>');
                w2 = 0;
            if (msg === false) {
                return;
            }
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
        ,delay: 3e3         // 3秒后自动关闭，为0时不关闭
        ,title: ''          // 文字
        ,content: ''        // 说明
        ,type: 'warning'    // 类型：primary info success danger warning
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

        modal.push('<div class="notify-message is-', settings.type, settings.clickToHide ? ' hidable' : '', '">');
        modal.push(    '<div class="title">', settings.title, '</div>');
        modal.push(    '<div class="text">', settings.content, '</div>');
        modal.push('</div>');

        $('.notify-message').remove();

        var $modal = $(modal.join(''));
        $('body').append($modal);

        if (settings.delay === 0) {
            $modal.fadeIn(300);

        } else {
            $modal.fadeIn(speed).delay(settings.delay).fadeOut(speed, function() {
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
    succeed: function(options) {
        var opts = {
            title: '成功',
            content: '',
            delay: 0,
            okeyValue: '确定'
        }
        for (var i in options) {
            opts[i] = options[i];
        }
        if (opts.content === '') {
            opts.content = opts.title;
            opts.title = '系统提示';
        }
        var temp = ''
        + '<div class="layer-msg" style="display:block;">'
           + '<div class="hd">' + opts.title + '</div>'
           + '<div class="bd">' + opts.content + '</div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">' + opts.okeyValue + '</button>'
            + '</div>'
        + '</div>';
        layer.open({
            area: '540px',
            type: 1,
            title: false,
            closeBtn: 0,
            content: temp
        })
        if (typeof opts.okey === 'function') {
            $('#okey').on('click', function() {
                opts.okey();
            })
        } else {
            $('#okey').on('click', function() {
                layer.closeAll();
            })
        }
        if (opts.delay) {
            setTimeout(function() {
                $('#okey').trigger('click');
            }, opts.delay)
        }
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
    alert: function(msg, okey, time) {
        var temp = ''
        + '<div class="layer-msg" style="display:block;">'        
           + '<div class="hd">系统提示</div>'
           + '<div class="bd"><i class="ico ico-warning"></i>' + msg + '</div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">确定</button>'
            + '</div>'
        + '</div>';
        layer.open({
            area: '540px',
            time: time || 0,
            type: 1,
            closeBtn: 0,
            title: false,
            content: temp
        })
        if (typeof okey === 'function') {
            $('#okey').on('click', function() {
                okey();
            })
        } else {
            $('#okey').on('click', function() {
                layer.closeAll();
            })
        }
        return this;
    },
    confirm: function(msg, okey, cancel) {
        var temp = ''
        + '<div class="layer-msg" style="display:block;">'
           + '<div class="hd">系统提示</div>'
           + '<div class="bd"><i class="ico ico-warning"></i>' + msg + '</div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">确定</button>'
                + '<button type="button" class="ubtn ubtn-gray layer-close" id="cancel">取消</button>'
            + '</div>'
        + '</div>';
        layer.open({
            area: '530px',
            type: 1,
            title: 0,
            closeBtn: 0,
            content: temp
        })
        if (typeof okey === 'function') {
            $('#okey').off().on('click', function() {
                okey();
            })
        }
        if (typeof cancel === 'function') {
            $('#cancel').off().on('click', function() {
                cancel();
            })
        }
        return this;
    },
    loading: function(msg, lock) {
        msg = msg || '加载中...';
        this.closeLoading();
        $('<div class="spinner' + (lock ? ' spinner-lock' : '') + '">' + msg + '</div>').appendTo($('body'));
    },
    closeLoading: function() {
        $('.spinner').remove();
    },
    ajax: function(url, type, data, success, error, locked) {
        $.ajax({
            url: url,
            type: 'POST',
            data: data || {},
            dataType: 'json',
            cache: false,
            timeout: 2e4,
            beforeSend: function() {
                fx.loading(null, locked);
            },
            complete: function() {
                fx.closeLoading();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $.notify({
                    type: 'danger',
                    content: '网络超时，请稍候再试'
                })
            },
            success: function(res) {
                if (res.code == 1) {
                    success(res);
                } else {
                    var msg = res.msg || '';
                    if (typeof(error) == 'function') {
                        error(msg, res);
                    } else {
                        $.notify({
                            type: 'danger',
                            content: msg
                        })
                    }
                }
            }
        })
    },
    //异步请求
    request: function(url, type, data, success, error) {
        if (!data) {
            data = {};
        }
        //加载中
        fx.loading();
        $.ajax({
            timeout: 2e4,
            type: 'POST',
            dataType: 'json',
            url: url,
            data: data,
            cache: false,
            complete: function() {
                fx.closeLoading();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $.notify({
                    type: 'danger',
                    content: '网络超时，请稍候再试'
                })
            },
            success: function(datas, status) {
                if (datas.result == 'SUCCESS') {
                    success(datas);
                    if (datas.list.length === 0) {
                        $.notify({
                            type: 'warning',
                            content: '该用户不存在'
                        })
                    }
                } else {
                    var msg = datas.message || '';
                    if (typeof(error) == 'function') {
                        error(msg, datas);
                    } else {
                        $.notify({
                            type: 'danger',
                            content: msg
                        })
                    }
                }
            }
        });
    },
    // 获取地址栏附带参数
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    getFormJson: function(form, options) {
        var defaults = {
            split: ',',
            isEmpty: false
        }
        var param = {};
        var formData = $(form).serializeArray();
        $.extend(defaults, options);
        $.each(formData, function() {
            if (!defaults.isEmpty && this.value.replace(/^\s+|\s+$/g, '') == '') {
                return true; // continue
            } else if (param[this.name]) {
                param[this.name] += defaults.split + this.value;
            } else {
                param[this.name] = this.value;
            }
        });
        return param;
    }
};

// 侧栏导航
function _sidebar() {
    var $menu = $('.side-menu'),
        URL = document.URL.split('#')[0].split('?')[0].toLowerCase(),
        urlBefore = URL.split('/')[3];

    // 导航高亮
    $menu.find('a').each(function() {
        var url = this.href.toLowerCase(),
            hrefBefore = url.split('/')[3];

        if (URL === url) {
            $(this).addClass('on')
            .closest('ul').show()
            .parent('li').addClass('active')
            .parent('ul').show()
            .parent('li').addClass('active')
            .parent('ul').show()
            .parent('li').addClass('active');
            return false; // break
        }
    })

    $menu.on('click', 'li', function(event) {
        $(this).toggleClass('active').siblings().removeClass('active').children('ul').slideUp();
        $(this).children('ul').slideToggle();
        if (event.stopPropagation) {
            event.stopPropagation();
        } else{
            event.cancleBubble = true;
        }
    })

    // 折叠开关
    var fold = false,
        $cont = $('.content'),
        $center = $cont.find('.center'),
        w = 230;
    $menu.append('<div class="open"></div>');
    $menu.on('click', '.open', function() {
        $('body').toggleClass('side-fold');
        if (fold) {
            $cont.animate({left: w + 10}, 300);
            $menu.animate({left: 0}, 300);
            $center.animate({width: 560}, 300);
        } else {
            $cont.animate({left: 10}, 300);
            $menu.animate({left: -w}, 300);
            $center.animate({width: 560 + w - 10}, 300);
        }
        fold = !fold;
    })

    // 驾驶证影像
    $('#menu99').on('click', '.hd a', function() {
        fx.alert('功能开发中，尽请期待', null, 3000);
        return false;
    })
}

// 导航高亮
function menu(id) {
    $('#' + id).addClass('current').parent().show().closest('dl').addClass('expand').closest('.item').addClass('active');
}

// 修改密码
function _modifyPwd() {
    var $trigger = $('#mdyPwd');
    if ($trigger.length === 1) {
        $trigger.on('click', function() {
            layer.open({
                title: false,
                type: 2,
                closeBtn: 0,
                shift: -1,
                area: ['530px', '340px'],
                content: ['change-pwd.html?s=' + (new Date).getTime(), 'no']
            })
        })
    }

    // 驱动下载
    var $ocx = $('#ocxFile');
    if ($ocx.length === 1) {
        var model = '<div class="form layer-form" style="display:block;">'
                +'    <div class="ftit">驱动下载</div>'
                +'    <ul class="ul">'
                +'        <li><a href="#">捷宇科技DoccameraOcx控件</a></li>'
                +'        <li><a href="#">身份证识别控件</a></li>'
                +'        <li><a href="#">身份证识别控件2</a></li>'
                +'    </ul>'
                +'</div>'

        $ocx.on('click', function() {
            layer.open({
                area: '340px',
                type: 1,
                title: false,
                content: model
            })
        })
    }
}

$(function() {
    _sidebar();
    _modifyPwd();

    if (typeof _page !== 'undefined' && _page.init) {
        _page.init();
    }

    // 关闭弹层
    $('body').on('click', '.layer-close', function() {
        layer.closeAll();
    })
})