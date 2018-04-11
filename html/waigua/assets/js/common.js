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
                $el.data('action', '');
            }
        }, 50);
    }
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
    alert: function(msg, okey, time) {
        var temp = ''
        + '<div class="layer-msg" style="display:block;">'
           + '<div class="hd">提示</div>'
           + '<div class="bd"><i class="ico ico-success"></i>' + msg + '</div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">确定</button>'
            + '</div>'
        + '</div>';
        layer.open({
            area: '390px',
            time: time || 0,
            type: 1,
            title: 0,
            closeBtn: 0,
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
           + '<div class="hd">提示</div>'
           + '<div class="bd">' + msg + '</div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-gray layer-close" id="cancel">取消</button>'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">确定</button>'
            + '</div>'
        + '</div>';
        layer.open({
            area: '390px',
            type: 1,
            title: 0,
            closeBtn: 0,
            content: temp
        })
        if (typeof okey === 'function') {
            $('#okey').on('click', function() {
                okey();
            })
        }
        if (typeof cancel === 'function') {
            $('#cancel').on('click', function() {
                cancel();
            })
        }
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
    //异步请求
    request: function(url, data, success, error) {
        if (!data) {
            data = {};
        }
        data.rqType = "asyn";
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
    }
};

// 侧栏导航
function _sidebar() {
    var $menu = $('.nav'),
        URL = document.URL.split('#')[0].split('?')[0].toLowerCase(),
        urlBefore = URL.split('/')[3];

    // 导航高亮
    $menu.find('a').each(function() {
        var url = this.href.toLowerCase(),
            hrefBefore = url.split('/')[3];
        if (URL === url) {
            $(this).addClass('active').closest('.item').removeClass('active');
            return false; // break
        }
    })

    var height = $(document).height();
    $('.wrapper').css({'min-height': height - 200});
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
                area: ['480px', '290px'],
                content: ['change-pwd.html?s=' + (new Date).getTime(), 'no']
            })
        })
    }
}

$(function() {
    _sidebar();
    _modifyPwd();

    try {
        _global.init();
    } catch (err) {}

    // 关闭弹层
    $('body').on('click', '.layer-close', function() {
        layer.closeAll();
    })
})