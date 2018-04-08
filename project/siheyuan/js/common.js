function Page(options) {
    var defaults = {
        pageIndex: 1,
        pageSize: 10,
        temp: 'listTemp',
        pageWrap: '.pagination',
        pageInfo: true,
        pageNum: true,
        callback: null
    }
    this.opts = $.extend(defaults, options || {});
    this.$wrap = $(this.opts.wrap);
    this.$pageWrap = $(this.opts.pageWrap);
    this.totalSize = 0;
    this.size = this.opts.pageSize;
    this.idx = this.opts.pageIndex;
    this.search = {};
}

Page.prototype = {
    init: function() {
        this.request(true);
    },
    request: function(initPage, data) {
        var that = this,
            _data = {};

        if (data) {
            that.idx = 1;
            $.each(data, function(key, value) {
                that.search[key] = value;
            })
        }

        that.search.pageSize = that.size;
        that.search.pageStart = (that.idx - 1) * that.size;
        that.search.pageIndex = that.idx;

        $.ajax({
            url: that.opts.url,
            data: that.search,
            success: function(res) {
                if (typeof that.opts.callback === 'function') {
                    that.opts.callback(res);
                }
                that.totalSize = res.totalSize;
                initPage && that.paginate();
            }
        })
    },
    paginate: function() {
        var that = this;
        function pageselectCallback(pageIndex) {
            that.idx = pageIndex + 1;
            that.request();
        }
        that.$pageWrap.pagination(that.totalSize, {
            num_edge_entries: 2,
            callback: pageselectCallback,
            items_per_page: that.size // 每页显示数量
        });
    },
    // 分页信息
    pageInfo: function() {
        var that = this;
        that.$pageWrap.prepend('<div class="p-size">第' + that.idx + '页/共' + Math.ceil(that.totalSize/that.size) + '页（共' + that.totalSize + '行）</div>');
    }
}

function showPup(id) {
    $('#' + id).fadeIn();
}

function closeIframe() {
    $('.layer-close').trigger('click');
}

function getScrollTop() {
    return  document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
}

function goTop() {
    var $el = $('.gotop');

    if ($el.length !== 1) {
        return;
    }

    var gotoTop = function() {
        var anim = function() {
            var scrollTop = $(window).scrollTop();
            window.scrollTo(0, Math.floor(scrollTop / 1.1));
            scrollTop <= 0 && clearInterval(timer);
        }
        var timer = setInterval(function() {
            anim();
        }, 10);
    }

    // 返回顶部
    $el.on('click', function() {
        gotoTop();
    });

    $(window).scroll(function() {
        if(getScrollTop() > 300) {
            $el.fadeIn()   
        }else{
            $el.fadeOut()
        }
    })  
}

function nav() {
    var $el = $('.nav'),
        top = $el.offset().top;

    $(window).on('scroll.navfixed', function() {
        if(getScrollTop() > top) {
            $el.addClass('nav-fixed');
        }else{
            $el.removeClass('nav-fixed');
        }
    })
}

function fixBottom() {
    var model = [];
    model.push('<div class="fixed-bottom-iframe">');
    model.push('<div class="bg"></div>');
    model.push('<div class="mx"><span class="img"></span><span class="down up"></span><span class="cursor"></span></div>');
    model.push('<iframe marginwidth="0" marginheight="0" frameborder="0" scrolling="no" src="iframe_bottom.html" style="width:100%;height:396px;position:relative;"></iframe>');
    model.push('</div>');
    $('body').append(model.join(''));
    $('.fixed-bottom-iframe .down').on('click', function() {
        var h = $(this).hasClass('up') ? '440' : '120';
        $(this).toggleClass('up');
        $('.fixed-bottom-iframe').animate({height:h}, 500);
    })
}

$(function() {
    nav();

    fixBottom();

    $('form').each(function() {
        $(this).attr('data-validator-option', '{timely:0}');
    })

    $('.slide-full').each(function() {
        $(this).slide({
            effect: 'leftLoop',
            mainCell: '.bd ul',
            titCell: '.hd',
            autoPage: '<i></i>',
            autoPlay: true
        });
    })

    $('.select').on('click', 'em', function() {
        var $span = $(this).parent();

        $span.hide().prev().html($(this).html());
        $span.next(':hidden').val($(this).attr('value'));
        setTimeout(function() {
            $span.removeAttr('style');
        }, 1);

    })

    // 搜索
    $('form[name="formsearch"]').on('submit', function() {
        var type = $(this).find('input[name="key"]').val(),
            keywords = $(this).find('.ipt').val();

        return false;
    })

    // 关闭页面弹层
    $('body').on('click', '.layer-close', function() {
        $(this).closest('.layer-form').fadeOut();
    })

    // 提交表单
    $('.myform').each(function() {
        $(this).validator({
            valid: function(form) {
                var data = $(form).serialize();
                console.log(data)
                dialog({
                    content: '<div class="layer-msg">提交成功</div>',
                    cancel: false
                })

                // parent.closeIframe();

                // dialog({ 
                //     title: '提示', 
                //     content: '<div class="layer-msg">提交成功</div>', 
                //     okValue: '确定', 
                //     ok: function() { } 
                // }).showModal();
            }
        })
    })

});

;(function($, window){
var defaults = {
    content: '<div></div>',     // 消息内容
    title: '\u6d88\u606f',      // 标题. 默认'消息'
    onOk: null,                 // 确定按钮回调函数
    ok: '\u786E\u5B9A',         // 确定按钮文本. 默认'确定'，传入null不显示
    onCancel: null,             // 取消按钮回调函数
    cancel: '\u53D6\u6D88',     // 取消按钮文本. 默认'取消', 传入null不显示
    width: 320,                 // 内容宽度
    time: null,                 // 自动关闭时间
    lock: true,                 // 是否锁屏
    background: '#000',         // 遮罩颜色
    opacity: .7,                // 遮罩透明度
    duration: 300,              // 遮罩透明度渐变动画速度
    fixed: true                 // 是否静止定位
};

var dom         = {},
    count       = 1,
    _$window    = $(window),
    _isIE6      = !!window.ActiveXObject&&!window.XMLHttpRequest,
    _zIndex     = 19890607;

// 开启IE6 CSS背景图片缓存
_isIE6 && document.execCommand('BackgroundImageCache', false, true);

function Dialog(options) {
    if (options.id === (dom[options.id] || 0)) {
        return false;

    } else if (!(this instanceof Dialog)) {
        return new Dialog(options);

    } else {
        this.settings = $.extend({}, defaults, options || {});  

        if (!this.settings.id) {
            this.settings.id = new Date().getTime() + '_' + count;  
        } 

        dom[this.settings.id] = this.settings.id;
        count ++;
        return this.init(); 
    }
}
Dialog.prototype = {
    init: function () {
        this.content();
        this.position();
        this.lock();
        this.ie6SelectFix();
        this.addEvent();
        this.time(this.settings.time);
        _zIndex ++;
        return this;
    },
    content: function () {
        var settings = this.settings,
            model = [];
        model.push('<div class="dialog" id="', settings.id, '">');
        if (settings.title) {
            model.push('<div class="dialog-title">', settings.title, '<\/div>');
        }
        model.push('<div class="dialog-content">', settings.content , '<\/div>');
        if (settings.ok || settings.cancel) {
            model.push('<div class="dialog-bottom">');
            settings.ok && model.push('<button type="button" class="ok button">', settings.ok, '<\/button>');
            settings.cancel && model.push('<button type="button" class="cancel button">', settings.cancel, '<\/button>');
            model.push('</div>');
        }
        _isIE6 ? model.push('<a href="javascript:;" class="dialog-close"><\/a>') : model.push('<div class="dialog-close"><\/div>');
        $('body').append(model.join(''));
        this.$wrap = $('#' + this.settings.id);
        return this;
    },
    position: function () {
        var winWidth    = _$window.width(),
            winHeight   = _$window.height(),
            wrap        = this.$wrap.get(0),
            isFixed     = this.settings.fixed,
            wrapWidth   = this.settings.width || wrap.offsetWidth,
            wrapHeight  = this.settings.height || wrap.offsetHeight,
            left        = (winWidth - wrapWidth)/2,
            top         = (winHeight - wrapHeight)/2;
        
        var cssText = 'position:' + (isFixed && !_isIE6 ? 'fixed;' : 'absolute;');
        if (isFixed && _isIE6) {
            cssText += 'left:expression((document.documentElement).scrollLeft+' + left + ');top:expression((document.documentElement).scrollTop+' + top + ');';
        } else {
            cssText += 'left:' + left + 'px;top:' + top + 'px;';
        }
        cssText += 'z-index:' + _zIndex + ';width:' + this.settings.width + 'px;';
        wrap.style.cssText = cssText;
        return this;
    },
    close: function () {
        this.removeEvent();
        dom.hasOwnProperty(this.settings.id) && delete dom[this.settings.id];
        this.unlock();
        this.time();
        this.$wrap.attr({'style':''}).html('').remove();
        return this;
    },
    time: function() {
        if (this.settings.time) {
            setTimeout(function() {}, this.settings.time);
        }
    },
    time: function (second) {
        var that = this,
            timer = that._timer;
        timer && clearTimeout(timer);
        if (second) {
            that.$wrap.find('.dialog-title').append('(', this.settings.time ,'秒后关闭)');
            that._timer = setTimeout(function(){
                that.close();
            }, 1e3 * second);
        };
        return that;
    },
    addEvent: function () {
        var that = this,
            resizeTimer;

        this.$wrap.on('click', '.ok', function(event) {
            if (typeof that.settings.onOk === 'function') {
                that.settings.onOk.apply(that, arguments);  
            } else {
                that.close();
            }
        });
        this.$wrap.on('click', '.cancel, .dialog-close', function(event) {
            if (typeof that.settings.onCancel === 'function') {
                that.settings.onCancel.apply(that, arguments);
            }
            that.close();
        });

        that._winResize = function () {
            resizeTimer && clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                that.position();
            }, 40);
        };
        _$window.on('resize', that._winResize);
        return this;
    },
    removeEvent: function () {
        this.$wrap.off();
        _$window.off('resize', this._winResize);
        return this;
    },
    lock: function () {
        if (this._lock || !this.settings.lock) {
            return this;
        }
        var that = this,
            index = _zIndex,
            settings = that.settings,
            domTxt = '(document.documentElement)',
            overlay = that.$overlay || $('<div class="dialogOverlay"><\/div>').insertBefore(this.$wrap);

        var cssText = 'background-color:' + settings.background
            + ';filter:alpha(opacity=0);opacity:0;overflow:hidden;z-index:' + _zIndex + ';';

        if (_isIE6) {
            cssText += 'position:absolute;left:expression(' + domTxt + '.scrollLeft);top:expression('
                + domTxt + '.scrollTop);width:expression(' + domTxt
                + '.clientWidth);height:expression(' + domTxt + '.clientHeight);';

            overlay.html(
            '<iframe src="about:blank" style="width:100%;height:100%;position:absolute;' +
            'top:0;left:0;z-index:-1;filter:alpha(opacity=0)"><\/iframe>');
        } else {
            cssText += 'position:fixed;width:100%;height:100%;left:0;top:0;';
        }

        overlay[0].style.cssText = cssText;
        overlay
        .stop()
        .on('dblclick', function () {
            that.close();
        });
        if (settings.duration === 0) {
            overlay.css({opacity: settings.opacity});
        } else {
            overlay.animate({opacity: settings.opacity}, settings.duration);
        };
        that.$overlay = overlay;
        that._lock = true;
        return that;
    },
    unlock: function () {
        var that = this,
            overlay = that.$overlay;
        
        if (!that._lock) return that;
        var un = function () {
            overlay.attr({'style':''}).remove();
        };
        overlay.stop().off();
        if (!that.settings.duration) {
            un();
        } else {
            overlay.animate({opacity: 0}, that.settings.duration, un);
        };
        that._lock = false;
        return that;
    },
    ie6SelectFix: function () {
        if (!_isIE6 || this.settings.lock) {
            return this;
        }
        var wrap = this.$wrap[0],
            iframe = this.DOM.iframe,
            width = wrap.offsetWidth,
            height = wrap.offsetHeight;

        if (iframe) {
            iframe.style.width = width + 'px';
            iframe.style.height = height + 'px';
        } else {
            iframe = wrap.appendChild(document.createElement('iframe'));
            this.DOM.iframe;
            iframe.src = 'about:blank';
            iframe.style.cssText = 'position:absolute;z-index:-1;left:0;top:0;'
            + 'filter:alpha(opacity=0);width:' + width + 'px;height:' + height + 'px';
        };
    }

}
window.dialog = Dialog;
})(jQuery, window);

