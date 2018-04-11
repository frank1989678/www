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
        var temp = ''
        + '<div class="layer-msg" style="display:block;">'
           + '<div class="hd"><i class="ico ico-success"></i>' + opts.title + '</div>'
           + '<div class="bd">' + opts.content + '</div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">' + opts.okeyValue + '</button>'
            + '</div>'
        + '</div>';
        layer.open({
            area: '540px',
            type: 1,
            title: false,
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
    alert: function(msg, okey) {
        var temp = ''
        + '<div class="layer-msg" style="display:block;">'
           + '<div class="hd"><i class="ico ico-warning"></i>' + msg + '</div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">确定</button>'
            + '</div>'
        + '</div>';
        layer.open({
            area: '540px',
            type: 1,
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
           + '<div class="hd"><i class="ico ico-warning"></i>' + msg + '</div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-gray layer-close" id="cancel">取消</button>'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">确定</button>'
            + '</div>'
        + '</div>';
        layer.open({
            area: '540px',
            type: 1,
            title: false,
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

function Page(options) {
    var defaults = {
        pageIndex: 1,
        pageSize: 10,
        wrap: '#tbody',
        temp: 'tableTemp',
        pageWrap: '.pagination',
        pageInfo: true,
        request: false,
        gotop: true
    }
    this.opts = $.extend(defaults, options || {});
    this.$wrap = $(this.opts.wrap);
    this.$pageWrap = $(this.opts.pageWrap);
    this.totalSize = 0;
    this.size = this.opts.pageSize;
    this.idx = this.opts.pageIndex;
    this.search = {};
    this.init();
}

Page.prototype = {
    init: function() {
        this.opts.request && this.request();
    },
    request: function(data, jqPage) {
        var that = this,
            _data = {};
        if (data) {
            that.idx = 1;
            $.each(data, function(i, item) {
                _data[item.name] = item.value;
            })
            that.search = _data;
        } else {
            _data = that.search;
        }

        _data.pageSize = that.size;
        _data.pageStart = (that.idx - 1) * that.size;
        _data.pageIndex = that.idx;
        // fx.log(_data)

        fx.request(that.opts.url, _data, function(res) {
            that.opts.gotop && window.scrollTo(0, 0);
            that.totalSize = res.totalSize;
            !jqPage && that.paginate();
            // that.opts.pageInfo && that.opts.pageSize < that.totalSize && that.pageInfo();
            that.$wrap.empty().html(template(that.opts.temp, res)).closest('.table').show();
            if (typeof that.opts.callback === 'function') {
                that.opts.callback(res);
            }
        }, function(err, res) {
            that.$wrap.closest('.table').hide();
            that.$pageWrap.empty();
            if (typeof that.opts.callback === 'function') {
                that.opts.callback(res);
            } else {
                $.notify({
                    type: 'danger',
                    content: err
                })
            }
        });
    },
    paginate: function() {
        var that = this;
        function pageselectCallback(pageIndex) {
            that.idx = pageIndex + 1;
            that.request(false, true);
        }
        that.$pageWrap.pagination(that.totalSize, {
            num_edge_entries: 2,
            callback: pageselectCallback,
            items_per_page: that.pageSize // 每页显示数量
        });
    },
    // 分页信息
    pageInfo: function() {
        var that = this;
        that.$pageWrap.prepend('<div class="p-size">第' + that.idx + '页/共' + Math.ceil(that.totalSize/that.size) + '页（共' + that.totalSize + '行）</div>');
    }
}

// 侧栏导航
function _sidebar() {
    var $menu = $('.menu');

    $menu.on('click', '.hd a', function() {
        $(this).closest('.item').addClass('active').siblings().removeClass('active');
    })

    $menu.on('click', 'dt', function() {
        $(this).next().slideToggle()
        .parent().toggleClass('expand').siblings().removeClass('expand')
        .find('dd').slideUp();
    })
}

// 导航高亮
function menu(id) {
    $('#' + id).addClass('current').parent().show().closest('dl').addClass('expand').closest('.item').addClass('active');
}

function _checkbox() {
    var $tbody = $('#tbody');
    var $cbxAll = $('thead').find('.cbx');

    var isCheckAll = function() {
        return $tbody.find('.cbx').length === $tbody.find('.cbx-on').length;
    }

    $tbody.on('click', '.cbx', function() {
        $(this).toggleClass('cbx-on');
        if (isCheckAll()){
            $cbxAll.addClass('cbx-on');
        } else {
            $cbxAll.removeClass('cbx-on');
        }
    })

    $cbxAll.on('click', function() {
        var checked = !$(this).hasClass('cbx-on');
        $(this).toggleClass('cbx-on');
        $tbody.find('.cbx').each(function() {
            $(this)[checked ? 'addClass' : 'removeClass']('cbx-on');
        })
    })
}

$(function() {
    _sidebar();
    _checkbox();

    if (typeof _pageInit !== 'undefined' && _pageInit.init) {
        _pageInit.init();
    }

    // 关闭弹层
    $('body').on('click', '.layer-close', function() {
        layer.closeAll();
    })

    // 关闭
    $('body').on('click', '.ico-close, .box-mini-close', function() {
        $('.box-mini').hide().siblings('.box').show();
    })
})