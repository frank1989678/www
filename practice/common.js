// JavaScript Document
$(function () {
    //导航显示下拉菜单
    $('.nav li.navb').hover(function () {
        $(this).addClass('nav_hover');
        $(this).children('.dropdown').show();
    }, function () {
        $(this).removeClass('nav_hover');
        $(this).children('.dropdown').hide();
    });
    //退出用户
    $(".top_admin_txt").click(function (e) {
        $(this).find(".top_show").show();
        e.stopPropagation();
    });
    //关闭弹出退出用户
    $("body").click(function () {
        $(".top_show").hide();
    });
});

var fx = {
    param: {},

    // 初始化公用功能
    init: function () {

    },
    // JS初始化页面数据
    initData: function (data) {

    },
    succeed: function (msg, okey) {
        var d = dialog({
            fixed: true,
            title: '提示',
            content: msg,
            width: 240,
            okValue: '确定',
            ok: function () {
                if (typeof(okey) == "function") {
                    okey();
                }
            }
        });
        d.show();
        return d;
    },
    error: function (msg, okey) {
        var d = dialog({
            fixed: true,
            title: '错误提示',
            content: msg,
            width: 240,
            okValue: '确定',
            ok: function () {
                if (typeof(okey) == "function") {
                    okey();
                }
            }
        });
        d.show();
        return d;
    },
    alert: function (msg, okey) {
        var d = dialog({
            fixed: true,
            title: "提示",
            content: msg,
            okValue: '确定',
            width: 240,
            ok: function () {
                if (typeof(okey) == "function") {
                    okey();
                }
            }
        });
        d.show();
        return d;
    },
    confirm: function (msg, ok, cancel, title) {
        var title = title || '提示';
        var d = dialog({
            fixed: true,
            title: title,
            content: msg,
            okValue: '确定',
            ok: function () {
                if (typeof(ok) == "function") {
                    ok();
                }
            },
            cancelValue: '取消',
            cancel: function () {
                if (typeof(cancel) == "function") {
                    cancel();
                }
            }
        }).showModal();
        return d;
    },
    dialog: function (content, ok, title) {
        var title = title || '提示';
        var d = dialog({
            fixed: true,
            title: title,
            content: content,
            okValue: '确定',
            ok: function () {
                if (typeof(ok) == "function") {
                    ok();
                }
            },
        }).showModal();
        return d;
    },

    loading: function (msg) {
        if (!msg) {
            msg = "加载中，请稍等...";
        }
        var _sdown = $(".znhsj-sdown");
        if (_sdown.attr("class")) {
            _sdown.removeClass("hide");
        } else {
            $("body").append($('<div class="znhsj-sdown"></div>'));
        }
        this.loadingBox = dialog({
            fixed: true,
            content: '<div class="mg-tp-10"><span class="ui-dialog-loading">Loading..</span></div><div class="mg-tp-10">' + msg + '</div>'
        }).showModal();
    },
    closeLoading: function () {
        $(".znhsj-sdown").addClass("hide");
        if (this.loadingBox) {
            this.loadingBox.close();
        }
    },
    loadReturn: function (responseTxt, statusTxt, xhr) {

        fx.closeLoading();
        // if(statusTxt=="success")

        if (statusTxt == "error")
            fx.alert("加载失败，请重试！");
    },
    // 获取地址栏附带参数
    GetQueryString: function (name) {
        //console.log(name)
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    },
    //以字符串输出key-value的obj对象
    printObj: function (obj) {
        var str = "";
        for (var key in obj) {
            str += key + "=" + obj[key] + "   ";
        }
        return str;
    },
    //设置select的选中
    jsSelectItemByValue: function (selId, selValue) {
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
    jsSelectItemByValue4Select2: function (containerId, muti, name, data, selectedData, selCfg) {
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
    replaceAll: function (str, s1, s2) {
        return str.replace(new RegExp(s1, "gm"), s2);
    },
    // 获取表单数据并生成json
    getFormJson: function (frm) {
        var o = {};
        var a = $(frm).serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            }
            else {
                o[this.name] = this.value || '';
            }
        });

        return o;
    },
    //异步请求
    request: function (url, data, success, error, before) {
        if (!data) {
            data = {};
        }
        
        var canCloseLoading = true;
        if(url.indexOf("queryWaitAlarmWarn.htm") > 0 ){
        	canCloseLoading = false;
        }
        
        
        
        
        //加载中
        //fx.loading("加载中，请稍等片刻喔！");
        $.ajax({
            timeout: 30000,
            type: "POST",
            url: url,
            data: data,
            dataType: "json",
            beforeSend: before,
            error: function (jqXHR, textStatus, errorThrown) {
            	if(canCloseLoading){
            		fx.closeLoading();
            	}
                if (typeof(error) == "function") {
                    error();
                } else if (textStatus == "timeout") {
                    fx.error("网络超时，请稍候再试");
                } else {
                    fx.error("请稍后再试");
                }
            },
            success: function (datas, status) {
            	if(canCloseLoading){
            		fx.closeLoading();
            	}
                if (datas.result == "SUCCESS") {
                    success(datas);
                } else {
                    var msg = datas.message || datas.expMsg || datas;
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
    },
    // 获取浏览器类型与版本
    myBrowser: function () {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
        if (isIE) {
            var IE5 = IE55 = IE6 = IE7 = IE8 = false;
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            IE55 = fIEVersion == 5.5;
            IE6 = fIEVersion == 6.0;
            IE7 = fIEVersion == 7.0;
            IE8 = fIEVersion == 8.0;
            if (IE55) {
                return "IE55";
            }
            if (IE6) {
                return "IE6";
            }
            if (IE7) {
                return "IE7";
            }
            if (IE8) {
                return "IE8";
            }
        }//isIE end
        if (isFF) {
            return "FF";
        }
        if (isOpera) {
            return "Opera";
        }
    }
};

var storageLocal = window.localStorage;//检测浏览器是否支持localStorage
if (typeof  window.localStorage == 'undefined') {
    //创建localStorage
    var localStorage1Class = function () {
        this.options = {
            expires: 60 * 24 * 3600,
        }
    }
    localStorage1Class.prototype = {
        //初实化。添加过期时间
        init: function () {
            var date = new Date();
            date.setTime(date.getTime() + 60 * 24 * 3600);
            this.setItem('expires', date.toGMTString());
        },
        //内部函数参数说明(key) 检查key是否存在
        findItem: function (key) {
            var bool = document.cookie.indexOf(key);
            if (bool < 0) {
                return true;
            } else {
                return false;
            }
        },
        //得到元素值 获取元素值 若不存在则返回 null
        getItem: function (key) {
            var i = this.findItem(key);
            if (!i) {
                var array = document.cookie.split(';')
                for (var j = 0; j < array.length; j++) {
                    var arraySplit = array[j];
                    if (arraySplit.indexOf(key) > -1) {
                        var getValue = array[j].split('=');
                        // 将 getValue[0] trim删除两端空格
                        getValue[0] = getValue[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '')
                        if (getValue[0] == key) {
                            return getValue[1];
                        } else {
                            return 'null';
                        }
                    }
                }
            }
        },
        //重新设置元素
        setItem: function (key, value) {
            var i = this.findItem(key)
            document.cookie = key + '=' + value;
        },
        //removeItem
        removeItem: function (key) {
            var date = new Date();
            date.setTime(date.getTime() - 100);
            document.cookie = key + "=a; expires=" + date.toGMTString();
        },
        //清除所有cookie 参数
        clear: function () {
            var array = document.cookie.split(';')
            for (var cl = 0; cl < array.length; cl++) {
                var date = new Date();
                date.setTime(date.getTime() - 100);
                document.cookie = array[cl] + "=a; expires=" + date.toGMTString();
            }
        }
    }
    storageLocal = new localStorage1Class();
    storageLocal.init();
    //storageLocal.setItem("datauri",path);
} else {
    //storageLocal.setItem("datauri",path);
}
;


/**
 * JavaScript Map对象
 */
function Map() {
    this.elements = new Array();

    //获取Map元素个数
    this.size = function () {
        return this.elements.length;
    },

    //判断Map是否为空
    this.isEmpty = function () {
        return (this.elements.length < 1);
    },

    //删除Map所有元素
    this.clear = function () {
        this.elements = new Array();
    },

    //向Map中增加元素（key, value)
    this.put = function (_key, _value) {
        if (this.containsKey(_key) == true) {
            if (this.containsValue(_value)) {
                if (this.remove(_key) == true) {
                    this.elements.push({
                        key: _key,
                        value: _value
                    });
                }
            } else {
                this.elements.push({
                    key: _key,
                    value: _value
                });
            }
        } else {
            this.elements.push({
                key: _key,
                value: _value
            });
        }

        return this;
    },

    //删除指定key的元素，成功返回true，失败返回false
    this.remove = function (_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    },

    //获取指定key的元素值value，失败返回null
    this.get = function (_key) {
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch (e) {
            return null;
        }
    },

    //获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null
    this.element = function (_index) {
        if (_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    },

    //判断Map中是否含有指定key的元素
    this.containsKey = function (_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    },

    //判断Map中是否含有指定value的元素
    this.containsValue = function (_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    },

    //获取Map中所有key的数组（array）
    this.keys = function () {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    },

    //获取Map中所有value的数组（array）
    this.values = function () {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };
}


<div id="fixed-bottom-background"> <div class="fixed-bottom-container"> <div class="fixed-bottom-button-hidden" style="display: block;"> <div class="mx"> <div style="float:left; margin-left:50px;"><img src="/data/upload/20161229/5864ce57b8aa1.png"></div> <a href="javascript:void(0);" class="fixed-bottom-button" style="display: block;"></a> <div class="animate-bounce-up" style="display: none;"></div> <div class="zzzz" style="float: left; margin-top: 70px; margin-left: 110px;"><img src="/statics//images/biao.png"></div> </div> </div> <div class="dibubm"> <div class="dibubmz"> <div class="zxbj_zxys"> <div class="con_bj clear"> <div class="con_bj_cal col_l"> <h3 class="calputer_tit">装修计算器
<span>累计已有
<em class="zxys_num_man">1550</em> 位业主获取装修预算
</span> </h3> <form action="/api/guestbook/sybm.html" method="post" id="fixed-bottom-form" autocomplete="off" onsubmit="return false"> <div class="mod_form bj_form"> <div class="form_line"> <label class="label" for=""> <em class="label_start">*</em>所在地区：
</label> <div class="element"> <div class="province-town clear"> <input type="hidden" name="loupan" value="底部条报名"> <select id="zxys_Shen" class="select_Shen" name="province"> <option value="武汉">武汉</option> </select> <select id="zxys_City" class="select_City" name="full_name"> <option value="江岸区">江岸区</option> <option value="江汉区">江汉区</option> <option value="硚口区">硚口区</option> <option value="汉阳区">汉阳区</option> <option value="武昌区">武昌区</option> <option value="洪山区">洪山区</option> <option value="青山区">青山区</option> <option value="东西湖区">东西湖区</option> <option value="蔡甸区">蔡甸区</option> <option value="江夏区">江夏区</option> <option value="黄陂区">黄陂区</option> <option value="新洲区">新洲区</option> <option value="汉南区">汉南区</option> </select> </div> </div> </div> <div class="form_line"> <label class="label" for=""> <em class="label_start">*</em>房屋面积：
</label> <div class="element"> <div class="text_wrap"> <input id="zxys_square" class="text area_text fixed-input-chenghu" placeholder="输入您的房屋面积(例如:120）" name="jianzhumianji" type="text"> <em class="unit" style="color: black;">m²</em> </div> </div> </div> <div class="form_line"> <label class="label" for=""> <em class="label_start">*</em>装修方式：
</label> <div class="element"> <div class="form-input-new"> <input type="radio" value="简单装修" name="style">&nbsp;简单装修&nbsp; 
<input type="radio" value="中等环保" checked="checked" name="style">&nbsp;中等环保&nbsp;
<input type="radio" value="豪华装修" name="style">&nbsp;豪华装修&nbsp;
</div> </div> </div> <div id="zxys_phoneInput" class="form_line"> <label class="label" for=""> <em class="label_start">*</em>手机号码：
</label> <div class="element"> <div class="text_wrap"> <input id="zxys_phonenumber" class="text phonetext fixed-input-dianhua" placeholder="报价结果将发送到您的手机" name="phone" type="text"> </div> </div> </div> <div class="form_line  fixed-submit-button"> <a id="zxys_calc_btn" class="calc-btn-start" href="javascript:void(0);"> <label id="zxys_btn_calc" class="calcstart" for="zxys_calc_btn">开始计算</label> <input id="zxys_myptag" name="ptag" value="1_1_1_99" type="hidden"> </a> </div> </div> <input type="hidden" name="__hash__" value="0db7b59c933256b5bc51949c1cc38b53_fcdd2bbe0cd8e08300787ef1f9f9c94f"></form> </div> <div class="con_bj_res col_l"> <div class="zxys_result"> <span class="zxys-result-span">您的装修预算</span> <b id="bprice">？</b> <span>元</span> </div> <div class="zxgs-list"> <ul class="zxgs-list-before"> <li class=""> <span>材料费：</span> <strong id="materialPay"> <em>？</em>元
</strong> </li> <li class=""> <span>人工费：</span> <strong id="artificialPay"> <em>？</em>元
</strong> </li> <li class=""> <span>设计费：</span> <strong id="designPay"> <em>？</em>元
</strong> </li> <li class=""> <span>软装费：</span> <strong id="qualityPay"> <em>？</em>元
</strong> </li> </ul> </div> <div class="bj_explain zxys_explain" style="display:none"> <p class="attention"> <b>*</b>稍候装修管家将回电您，免费提供装修咨询服务
</p> <p> <b>*</b>因材料品牌及工程量不同，具体报价以量房实测为准
</p> </div> </div> </div> </div> </div> </div> <!-- <form action="/api/guestbook/yy4.html" method="post" id="fixed-bottom-form" autocomplete="off" onsubmit="return false"> <input type="text" name="full_name" class="fixed-input-chenghu"/> <input type="text" name="phone" class="fixed-input-dianhua"/> <input type="submit" class="fixed-submit-button" value="" title="点击获取"/> <input type="hidden" name="__hash__" value="0db7b59c933256b5bc51949c1cc38b53_fcdd2bbe0cd8e08300787ef1f9f9c94f" /></form> <span class="fixed-bottom-info">已有<b>3560</b>人报名</span>--> </div> </div>