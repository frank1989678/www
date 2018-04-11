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
        data.rqType = "asyn";
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
    },
    rotateVideo: function(videoId, arrow) {
        var $video = $('#' + videoId).find('video:eq(0)');
        var rotation = $video.data('rotate') || 0;
        rotation += arrow;
        if (rotation === 4) {
            rotation = 0;
        } else if (rotation === -1) {
            rotation = 3;
        }
        $video.css({
            'transform': 'rotate(' + (90 * rotation) + 'deg)',
            'WebkitTransform': 'rotate(' + (90 * rotation) + 'deg)',
            'OTransform': 'rotate(' + (90 * rotation) + 'deg)',
            'msTransform': 'rotate(' + (90 * rotation) + 'deg)',
            'MozTransform': 'rotate(' + (90 * rotation) + 'deg)'
        }).data('rotate', rotation)
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
            $(this).addClass('current').closest('dl').addClass('active');
            return false; // break
        }
    })
    // 耳机导航
    $nav.on({
        mouseenter: function() {
            $(this).addClass('hover').find('dd').slideDown(150);
        },
        mouseleave: function() {
            $(this).removeClass('hover').find('dd').hide();
        }
    }, 'dl')
}

function _checkbox() {
    var $tbody = $('#tbody');
    var $cbxAll = $('thead').find('.cbx input');

    var isCheckAll = function() {
        return $tbody.find('.cbx input').length === $tbody.find('.cbx input:checked').length;
    }

    $tbody.on('click', '.cbx input', function() {
        $(this).parent()[this.checked ? 'addClass' : 'removeClass']('cbx-on');
        if (this.checked && isCheckAll()){
            $cbxAll.prop('checked', true).parent().addClass('cbx-on');
        } else {
            $cbxAll.prop('checked', false).parent().removeClass('cbx-on');
        }
    })

    $cbxAll.on('click', function() {
        var checked = this.checked;
        $(this).parent()[checked ? 'addClass' : 'removeClass']('cbx-on');
        $tbody.find('.cbx input').each(function() {
            this.checked = checked;
            $(this).parent()[checked ? 'addClass' : 'removeClass']('cbx-on');
        })
    })
}

$(function() {
    _nav();
    _checkbox();
})