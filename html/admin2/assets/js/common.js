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

var fx = {
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
        msg = msg || '加载中，请稍等...';
        this.closeLoading();
        $('<div class="spinner">加载中...</div>').appendTo($('body'));
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
    //设置select的选中
    jsSelectItemByValue: function(selId, selValue) {
        var sel = document.getElementById(selId);
        for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value == selValue) {
                sel.options[i].selected = true;
            } else {
                sel.options[i].selected = false;
            }
        }
    },
    //设置select2的选中
    jsSelectItemByValue4Select2: function(containerId, muti, name, data, selectedData, selCfg) {
        var container = $("#" + containerId);
        container.empty();
        var selId = "sel" + containerId + name;
        var cls = "";
        if (muti) {
            cls = "select2_multiple";
        }
        var select2Str = '<select id="' + selId + '" class="' + cls + ' form-control" name="' + name + '" required="required" style="width:100%"';
        if (muti) {
            select2Str += ' multiple="multiple">';
        } else {
            select2Str += ' >';
        }
        for (var i = 0; i < data.length; i++) {
            var dd = data[i];
            var eq = false;
            for (var j = 0; j < selectedData.length; j++) {
                if (data[i].value == selectedData[j]) {
                    eq = true;
                }
            }
            if (eq) {
                select2Str += '<option value="' + dd.value + '" selected>' + dd.name + '</option>';
            } else {
                select2Str += '<option value="' + dd.value + '">' + dd.name + '</option>';
            }
        }
        select2Str += '</select>';
        container.append(select2Str);
        $("#" + selId).select2(selCfg);
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
        data.rqType = "asyn";
        //加载中
        fx.loading("加载中，请稍等片刻喔！");
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
                    fx.error("网络超时，请稍候再试");
                } else {
                    fx.error("请稍后再试");
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
                        fx.error(msg);
                    }
                }
            }
        });

        // 回滚
        if (typeof(before) == "function") {
            before();
        }
    }
};
// 初始化
function _init() {
    var $window = $(window),
        $nav = $('.nav'),
        $table = $('.table'),
        URL = document.URL.split('#')[0].split('?')[0].toLowerCase(),
        urlBefore = URL.split('/')[3],
        H = $('.header').outerHeight(),
        F = $('.footer').outerHeight(),
        timer = 0;

    // 导航高亮
    $nav.find('a').each(function() {
        var url = this.href.toLowerCase(),
            hrefBefore = url.split('/')[3];

        if (URL === url) {
            $(this).addClass('current').closest('dl').addClass('active expand');
            return false; // break
        }
    })

    $nav.on('click', 'dt', function() {
        $(this).parent().addClass('active').siblings().removeClass('active');
    })

    $nav.on('click', '.next', function() {
        var $scroll = $(this).parent().find('.scroll');
        var left = $scroll.data('left');
        $(this).hide().prev().show();
        $scroll.animate({
            'left': -left + 'px'
        }, 300);
    })
    $nav.on('click', '.prev', function() {
        $(this).hide().next().show();
        $(this).parent().find('.scroll').animate({
            'left': 0
        }, 300);
    })

    $table.on('click', '.next', function() {
        var $scroll = $table.find('.scroll'),
            idx = $scroll.data('idx') + 1,
            pos = $scroll.data('pos'),
            page = $scroll.data('page');

        if (idx < page) {
            $scroll.data('idx', idx).animate({
                'scrollLeft': idx * pos
            }, 300);
        }
        if (idx == page - 1) {
            $(this).addClass('disabled');
        }
        $(this).prev().removeClass('disabled');
    })
    $table.on('click', '.prev', function() {
        var $scroll = $table.find('.scroll'),
            idx = $scroll.data('idx') - 1,
            pos = $scroll.data('pos'),
            page = $scroll.data('page');

        if (idx > -1) {
            $scroll.data('idx', idx).animate({
                'scrollLeft': idx * pos
            }, 300);
        }
        if (idx == 0) {
            $(this).addClass('disabled');
        }
        $(this).next().removeClass('disabled');
    })

    // 处理子菜单过多、table列过多时显示左右箭头
    var initScroll = function() {
        $nav.find('.scroll').each(function() {
            var $el = $(this),
                $pa = $el.parent(),
                $curr = $el.find('.current'),
                W = $pa.outerWidth(),
                w = $el.outerWidth(),
                pos = w - W;

            $el.removeAttr('style').nextAll().remove();
            if (pos > 30) {
                $el.data('left', pos).after('<em class="ico ico-arrow-left prev"></em><em class="ico ico-arrow-right next"></em>');
                if ($curr.length === 1 && W < $curr.offset().left) {
                    $pa.find('.next').trigger('click');
                }
            }
        })

        $table.find('.scroll').each(function() {
            var $el = $(this),
                W = $el.outerWidth(),
                w = $el.find('table').outerWidth(),
                page = Math.ceil(w / W),
                pos = (w - W) / (page - 1);

            var data = {
                idx: 0,
                page: page,
                pos: pos
            }
            if (pos > 20) {
                $el.data(data);
                $table.find('.caption .prev, .caption .next').show();
            } else {
                $table.find('.caption .prev, .caption .next').hide();
            }
            $el.scrollLeft(0);
            $table.find('.caption .prev').addClass('disabled').next().removeClass('disabled');
        })
    }

    // 页面高度处理
    var fix = function() {
        var height = $window.height();
        $('.wrapper').css('min-height', height - H - F - 20);
    }


    $window.on('resize.scroll', function() {
        timer && clearTimeout(timer);
        timer = setTimeout(function() {
            initScroll();
            fix();
        }, 99);
    })

    initScroll();
    fix();
}

$(function() {
    // _fix();
    _init();
})