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
                + '<button type="button" class="ubtn ubtn-primary" id="okey">确定</button>'
                + '<button type="button" class="ubtn ubtn-gray layer-close" id="cancel">取消</button>'
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
            type: 'POST',
            dataType: 'json',
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
    },
    cbx: function($el) {
        var $cbxs = $el.find('th .cbx');
        // 全选
        $cbxs.on('click', function() {
            var checked = this.checked;
            $el.find('.cbx').each(function() {
                this.checked = checked;
            })
        }).prop('checked', false);

        // 单个选择
        $el.on('click', '.cbx', function() {
            var checked = this.checked;
            if (checked) {
                $el.find('.cbx').each(function() {
                    if (this.checked === false) {
                        checked = false;
                        return false;
                    }
                })
                $cbxs.prop('checked', checked);
            } else {
                $cbxs.prop('checked', false);
            }
        })
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
            $(this).addClass('current').closest('dl').addClass('expand').find('dd').show();;
            return false; // break
        }
    }) 

    $sidebar.on('click', 'dt', function() {
        $(this).next().slideToggle(260)
        .parent().toggleClass('expand').siblings().removeClass('expand')
        .find('dd').slideUp(260);
    })

    // 导航高亮
    $sidebar.find('.current').closest('dl').addClass('expand').find('dd').show();;
}


function _init() {
    _nav();

    try {
        _global.init();
    } catch (err) {}

    // 关闭弹层
    $('body').on('click', '.layer-close', function() {
        layer.closeAll();
    })
}
$(function() {
    _init();
})