/**
 * @目录：
 * @判断是否是ie6
 * @取得窗口左边和上边的位置
 * @取得页面视口大小
 * @随机生成一个给定区间的整数
 * @数组操作
 * @添加onload队列时间
 * @添加页面滚动事件
 * @返回顶部
 * @添加或删除事件
 * @获取页面传值参数
 * @添加样式表
 * @文档操作
 * @闪烁动画
 * @获取元素的偏移量(offset)
 * @获取鼠标当前坐标
 * @如何从元素中除去HTML
 * @导航高亮
 * @去掉首尾空格
 * @ajax
 * @动态添加js
 * @添加收藏
 * @时间操作
 * @placeholder
 * @全选
 * @判断微信
 * @判断placeholder
 * @cookie
 * @trim
 * @商品数量只能输入正整数
 * @清除文本选择
 * @检验数组/对象中包含值/属性
 * @获取移动端系统
 * @生成ID
 * @生成uuid
 * @防抖动函数
 * @简单的节流函数
 * @输入数量
 * @输入单价
 * @随机颜色
 * @获取数组中的最大最小值
 */


/**
 * @判断是否是ie6
 */ 
function isIe6() {
    return window.VBArray && !window.XMLHttpRequest;
}

/**
 * @取得窗口左边和上边的位置，兼容性差，不建议使用，详见8.1.3
 * @scrollX和scrollY 火狐浏览器支持
 * @screenLeft和screenTop ie、safari、opera、chrome支持
 */

function winPos() {
    var pos = [];
    pos.push(typeof window.screenLeft === 'number' ? [window.screenLeft, window.screenTop] : [window.screenX, window.screenY]);
    return pos;
}

/**
 * @取得页面视口大小，详见8.1.4
 */
function docPos() {
    var pos = [window.innerWidth, window.innerHeight];
    if (typeof pos[0] !== "number") {
        pos = document.compatMode === 'CSS1Compat' ? [document.documentElement.clientWidth, document.documentElement.clientHeight] : [document.body.clientWidth, document.body.clientHeight];
    };
    return pos;
}

/**
 * @取得页面高度，详见12.2.3.3
 */
function getDoc() {
    var pos = [window.innerWidth, window.innerHeight];
    if (typeof pos[0] !== "number") {
        pos = document.compatMode === 'CSS1Compat' ? [document.documentElement.clientWidth, document.documentElement.clientHeight] : [document.body.scorllHeight, document.body.clientHeight];
    };
    return pos;
}

/*
 * @随机生成一个给定区间的整数
 * @param  {Number} lowerValue 最小数
 * @param  {Number} upperValue 最大数
 */
function selectFrom(lowerValue, upperValue) {
    return Math.floor(Math.random() * (upperValue - lowerValue + 1)) + lowerValue;
}
function getRandomNum(a, b) {
    return a + Math.round(Math.random() * (b - a))
}


/*
 * @数组操作
 */
var arrDemo = [1, 11, 23, 56, 3, 4, 5, 7, 562, 67];
// 从小到大排序
arrDemo.sort(function(a, b) {
    return a - b
}); 
// 从大到小排序
arrDemo.sort(function(a, b) {
    return b - a
}); 
// 数组随机排序
arrDemo.sort(function(){
    return Math.random()>.5 ? -1 : 1
}); 

var m = [1,2,3,4,5,6,7,8,9,10];
var n = [];
while (n.length < 10) {
    var i = Math.floor(Math.random() * m.length);
    n.push(m[i]);
    m.splice(i, 1);
}
console.log(n)

// 获取数组中的最大数
Math.max.apply(Math, arrDemo)


/*
 * @添加onload队列时间
 */
function _addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

/*
 * @添加页面滚动事件
 */
function _addScroll(func) {
    var oldScroll = window.onscroll;
    if (typeof window.onscroll != 'function') {
        window.onscroll = func;
    } else {
        window.onscroll = function() {
            oldScroll();
            func();
        }
    }
}

/*
 * @返回顶部
 */
var goTop = {
    fn: function() {
        goTop.el.style.display = ((document.documentElement.scrollTop + document.body.scrollTop) <= 400) ? "none": "block"      
    },
    go: function() {
        window.scroll(0, 0);
        goTop.fn();
    },
    init: function(id) {
        goTop.el = document.getElementById(id);
        if (goTop.el === null) {
            goTop.el = document.createElement("div");
            goTop.el.className = "goTop";
            goTop.el.innerHTML = '<a href="javascript:void(0);" hidefocus="true" id="goTop" onclick="goTop.go()">回顶部</a>';
            document.body.appendChild(goTop.el)
        }       
        window.onscroll = goTop.fn; 
    }   
}
// 返回顶部
$('.gotop').on('click', function(e) {
    gotoTop();
    e.preventDefault();
});

function gotoTop() {
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
$.fn.goTop = function(options) {
    return this.each(function() {

        var $obj = $(this);
        var defaults = {
            min: 300,
            fadeSpeed: 200,
            scrollSpeed: 200
        }
        var settings = $.extend({}, defaults, options);
        methods = {
            init: function() {
                $obj.hide();
                methods.event();
            },
            event: function() {
                $(window).scroll(function() {
                    if ($(window).scrollTop() >= settings.min) {
                        $obj.fadeIn(settings.fadeSpeed);
                    } else {
                        $obj.fadeOut(settings.fadeSpeed);
                    }
                });
                $obj.on('click', function(e) {
                    e.preventDefault();
                    $('html,body').animate({
                        scrollTop: 0
                    }, settings.scrollSpeed);
                });

                
            }
        }
        methods.init();
    });
}

/**
 * @ 添加或删除事件
 * @ 使用 attachEvent 时，事件中的this = window （ie8详见13.2.4）
 */
var EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.deleteEvent) {
            element.deleteEvent("on" + type, handler);
        } 
    },
    getEvent: function(event) {
        return event || window.event;
    },
    getTarget: function(event) {
        var event = event || window.event;
        return event.target || event.scrElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else{
            event.returnValue = false;
        };
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else{
            event.cancleBubble = true;
        };
    }
}

//绑定scroll事件
EventUtil.addHandler(window, "scroll", function(event) {
    //do something
    //var scrollTop = document.documentElement.scrollTop || document.body.scrollTop

})


/**
 * @ 获取页面传值参数
 */
function getParams() {
    var ret = {},
        params = window.location.search.replace(/^\?/,'').split('&'),
        len = params.length, i = 0, s;

    for (;i<len;i++) {
        if (!params[i]) { 
            continue; 
        }
        s = params[i].split('=');
        ret[s[0]] = s[1];
    }
    return ret;
}

// 获取地址栏附带参数
GetQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}

/*
 * 添加样式表
 * @object:操作对象
 * @name:样式名称，多个之间使用空格隔开。eg：[class1 class2]
 * @op:添加或删除的样式名称，必选，当为add时添加，为remove时删除
 */
function setClass(object, name, op) {
    var className = " " + object.className + " ",
        classNames = (name || "").split(/\s+/),
        i = classNames.length - 1;
    while (i >= 0) {
        if (op === "add" && !~className.indexOf(classNames[i])) {
            className += classNames[i] + " ";

        } else if (op === "remove") {
            var pattern = new RegExp(" " + classNames[i] + " ", "g");
            className = className.replace(pattern, " ");
        } else {
            // donothing
        }

        i--;
    }
    object.className = className.replace(/^\s+/, "").replace(/\s+$/, "");
}

/**
 * @文档操作
 */
document.getElementsByTagName("form") = document.forms;
document.getElementsByTagName("img") = document.images;
var a = document.links; //包含页面中所有带href特性的a元素
var html = document.documentElement;
var body = document.body;
var scrollTop = document.documentElement.scrollTop || document.body.scrollTop


/**
 * @闪烁动画
 * @para {object} id
 * @para {number} times
 * @para {string} bgcolor
 */
function Splash(id, times, bgcolor) {
    this.actioning = id;
    this.element = document.getElementById(id);
    this.times = times;
    this.bg2 = bgcolor;
    this.bg1 = this.element.className;
    this.time = 0;
    var _this = this,
        actioning = this.element.getAttribute("data-action");
    if (actioning && actioning === "true") {
        return false;
    } else {
        this.element.setAttribute("data-action", "true");
    };
    this.action = function() {
        _this.element.className = (_this.time % 2 == 0) ? _this.bg2 : _this.bg1;
        _this.time++;
        if (_this.time < _this.times) {
            _this.actioning = true;
            setTimeout(function() {
                _this.action();
            }, 770)
        } else {
            _this.element.setAttribute("data-action", "false");
        };
    };
    this.action();
}

document.getElementById(id).onclick = function() {
    new Splash(id, 24, classname);
}


/**
 * @获取元素的偏移量
 * @para {object} element
 */
function offset(element) {
    var pos = [0, 0]
    do {
        pos[0] += element.offsetTop;
        pos[1] += element.offsetLeft;
        element = element.offsetParent;
    } while (element !== null);
    return pos;
}


/**
 * @获取鼠标当前坐标
 */
function mousePos() {
    EventUtil.addHandler(document, "click", function(event) {
        event = event || window.event;
        alert(event.clientX, event.clientY)
    })
}

/**
 * @如何从元素中除去HTML
 */
(function($) {
    $.fn.stripHtml = function() {　　
        var regexp = /<("[^"]*"|'[^']*'|[^'">])*>/gi;　　
        this.each(function() {　　　　
            $(this).html($(this).html().replace(regexp, ''));　　
        });　　
        return $(this);
    }
})(jQuery);


/**
 * @导航高亮
 */
function setNavCurr() {
   var  links = $('.fn-side ul a'),
        URL = document.URL.split('#')[0].split('?')[0];
    links.each(function() {
        if (URL.toLowerCase().indexOf(this.href.toLowerCase()) !== -1) {
            $(this).addClass("curr");
            return false;
        }
    }) 
}

// 检验数组/对象中包含值/属性
function in_array(needle, array) {
    if (typeof needle == 'string' || typeof needle == 'number') {
        for (var i in array) {
            if (array[i] == needle) {
                return true;
            }
        }
    }
    return false;
}
Array.prototype.has = function(needle) {
    for (var i in this) {
        if (this[i] == needle) {
            return true;
        }
    }
    return false;
}


/**
 * @去掉首尾空格
 */
function trim(str) {
    return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
}


/**
 * @ajax
 */
function Ajax(recvType, waitId) {
    var aj = new Object();
    aj.loading = '请稍候...';
    aj.recvType = recvType ? recvType: 'XML';
    aj.waitId = waitId ? $(waitId) : null;
    aj.resultHandle = null;
    aj.sendString = '';
    aj.targetUrl = '';
    aj.setLoading = function(loading) {
        if (typeof loading !== 'undefined' && loading !== null) aj.loading = loading;
    };
    aj.setRecvType = function(recvtype) {
        aj.recvType = recvtype;
    };
    aj.setWaitId = function(waitid) {
        aj.waitId = typeof waitid == 'object' ? waitid: $(waitid);
    };
    aj.createXMLHttpRequest = function() {
        var request = false;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
            if (request.overrideMimeType) {
                request.overrideMimeType('text/xml');
            }
        } else if (window.ActiveXObject) {
            var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
            for (var i = 0; i < versions.length; i++) {
                try {
                    request = new ActiveXObject(versions[i]);
                    if (request) {
                        return request;
                    }
                } catch(e) {}
            }
        }
        return request;
    };
    aj.XMLHttpRequest = aj.createXMLHttpRequest();
    aj.showLoading = function() {
        if (aj.waitId && (aj.XMLHttpRequest.readyState != 4 || aj.XMLHttpRequest.status != 200)) {
            aj.waitId.style.display = '';
            aj.waitId.innerHTML = '<span><img src="' + IMGDIR + '/loading.gif" class="vm"> ' + aj.loading + '</span>';
        }
    };
    aj.processHandle = function() {
        if (aj.XMLHttpRequest.readyState == 4 && aj.XMLHttpRequest.status == 200) {
            if (aj.waitId) {
                aj.waitId.style.display = 'none';
            }
            if (aj.recvType == 'HTML') {
                aj.resultHandle(aj.XMLHttpRequest.responseText, aj);
            } else if (aj.recvType == 'XML') {
                if (!aj.XMLHttpRequest.responseXML || !aj.XMLHttpRequest.responseXML.lastChild || aj.XMLHttpRequest.responseXML.lastChild.localName == 'parsererror') {
                    aj.resultHandle('<a href="' + aj.targetUrl + '" target="_blank" style="color:red">内部错误，无法显示此内容</a>', aj);
                } else {
                    aj.resultHandle(aj.XMLHttpRequest.responseXML.lastChild.firstChild.nodeValue, aj);
                }
            } else if (aj.recvType == 'JSON') {
                var s = null;
                try {
                    s = (new Function("return (" + aj.XMLHttpRequest.responseText + ")"))();
                } catch(e) {
                    s = null;
                }
                aj.resultHandle(s, aj);
            }
        }
    };
    aj.get = function(targetUrl, resultHandle) {
        targetUrl = hostconvert(targetUrl);
        setTimeout(function() {
            aj.showLoading()
        },
        250);
        aj.targetUrl = targetUrl;
        aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
        aj.resultHandle = resultHandle;
        var attackevasive = isUndefined(attackevasive) ? 0 : attackevasive;
        if (window.XMLHttpRequest) {
            aj.XMLHttpRequest.open('GET', aj.targetUrl);
            aj.XMLHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            aj.XMLHttpRequest.send(null);
        } else {
            aj.XMLHttpRequest.open("GET", targetUrl, true);
            aj.XMLHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            aj.XMLHttpRequest.send();
        }
    };
    aj.post = function(targetUrl, sendString, resultHandle) {
        targetUrl = hostconvert(targetUrl);
        setTimeout(function() {
            aj.showLoading()
        },
        250);
        aj.targetUrl = targetUrl;
        aj.sendString = sendString;
        aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
        aj.resultHandle = resultHandle;
        aj.XMLHttpRequest.open('POST', targetUrl);
        aj.XMLHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        aj.XMLHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        aj.XMLHttpRequest.send(aj.sendString);
    };
    aj.getJSON = function(targetUrl, resultHandle) {
        aj.setRecvType('JSON');
        aj.get(targetUrl + '&ajaxdata=json', resultHandle);
    };
    aj.getHTML = function(targetUrl, resultHandle) {
        aj.setRecvType('HTML');
        aj.get(targetUrl + '&ajaxdata=html', resultHandle);
    };
    return aj;
}


/**
 * @动态添加js
 */
function loadScript(url) {
    var script = document.createElement("script");
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
function addScript(e, t) {
    var a = document.createElement("script");
    a.type = "text/javascript", a.async = !0, a.src = is_https ? t : e, document.getElementsByTagName("head")[0].appendChild(a)
}

function addScriptFromFDC(e) {
    var t = "//assets.alicdn.com/s/fdc/",
        a = "//assets.alicdn.com/s/fdc/";
    addScript(t + e, a + e)
}

function createIframe(e, t) {
    var a = document.createElement("iframe");
    a.style.width = "1px", a.style.height = "1px", a.style.position = "absolute", a.style.display = "none", a.src = e, t && (a.name = t);
    var o = document.getElementsByTagName("body")[0];
    return o.appendChild(a), a
}

/**
 * @动态添加css
 */
function loadStyle(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.src = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}


/**
 * @生成随机字符串
 * @para {Number} len,生成的字符长度
 */
function generateRandomAlphaNum(len) {
    var rdmString = "";
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
    return rdmString.substr(0, len);
}


/**
 * 添加收藏
 * @ url：要加入到收藏的链接地址
 * @ title: 收藏显示的标题
 */
function addFavorite(url, title) {
    if (!url) {
        url = window.location.href;
    }
    if (!title) {
        title = document.title;
    }
    try {
        window.external.addFavorite(url, title);
    } catch(e) {
        try {
            window.sidebar.addPanel(url, title, "");
        } catch(e) {
            dialog({
                title: "收藏本站失败！",
                content: "对不起，您的浏览器不支持此操作!<br />请您使用菜单栏或Ctrl+D收藏本站。",
                width: 300
            })
        }
    }
}

// 时间操作
var time = 1422948697000;
var date = new Date(time);
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDay();
var hours = date.getHours();
var minute = date.getMinutes();
var second = date.getSeconds();
var microsecond = date.getMilliseconds();

// alert(year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second);

// 欢迎时间显示
now = new Date();
hour = now.getHours()
if(hour < 5){document.write("夜已深，请注意休息哦！")}
else if (hour < 9){document.write("早上好，欢迎访问电影迷影院_最新电影_快播电影！")}
else if (hour < 12){document.write("上午好，欢迎访问电影迷影院_最新电影_快播电影！")}
else if (hour < 14){document.write("中午好，欢迎访问电影迷影院_最新电影_快播电影！")}
else if (hour < 18){document.write("下午好，欢迎访问电影迷影院_最新电影_快播电影！")}
else if (hour < 24){document.write("晚上好，欢迎访问电影迷影院_最新电影_快播电影！")}
    
var timeago = {
    parseDate: function(e) {
        return e.parse("2011-10-28T00:00:00+08:00") && function(t) {
            return new e(t)
        } || e.parse("2011/10/28T00:00:00+0800") && function(t) {
            return new e(t.replace(/-/g, "/").replace(/:(\d\d)$/, "$1"))
        } || e.parse("2011/10/28 00:00:00+0800") && function(t) {
            return new e(t.replace(/-/g, "/").replace(/:(\d\d)$/, "$1").replace("T", " "))
        } || function(t) {
            return new e(t)
        }
    }(Date),
    fullDate: function(t) {
        return t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日"
    },
    fullTime: function(e) {
        var t = this.parseDate(e);
        return t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日 " + t.toLocaleTimeString()
    },
    elapsedTime: function(e) {
        var t = this.parseDate(e),
            s = new Date,
            a = (s - t) / 1e3;
        return 10 > a ? "刚刚" : 60 > a ? Math.round(a) + "秒前" : 3600 > a ? Math.round(a / 60) + "分钟前" : 86400 > a ? Math.round(a / 3600) + "小时前" : (s.getFullYear() == t.getFullYear() ? "" : t.getFullYear() + "年") + (t.getMonth() + 1) + "月" + t.getDate() + "日"
    }
}

var timeago = {
    fillZero: function(number) {
        return number < 10 ? '0' + number : number;
    },
    format: function(t) {
        return t.getFullYear() + "-" 
            + this.fillZero(t.getMonth() + 1) + "-" 
            + this.fillZero(t.getDate()) + " " 
            + this.fillZero(t.getHours()) + ':' 
            + this.fillZero(t.getMinutes()); 
    },
    fullTime: function(e) {
        var t = new Date(e);
        return this.format(t);
    },
    elapsedTime: function(e) {
        var t = new Date(e),
            s = new Date,
            a = (s - t) / 1e3;
        return 10 > a ? "刚刚" : 60 > a ? Math.round(a) + "秒前" : 3600 > a ? Math.round(a / 60) + "分钟前" : 86400 > a ? Math.round(a / 3600) + "小时前" : this.format(t)
    }
}

// placeholder
$(".placeholder").focus(function() {
    if ($.trim(this.value) == this.defaultValue) {
        this.value = "";
    }
    $(this).removeClass("gray");
}).blur(function() {
    if ($.trim(this.value) == "" || $.trim(this.value) == this.defaultValue) {
        this.value = this.defaultValue;
        $(this).addClass("gray");
    }
})

/**
 * 全选全选
 * @param {Object} oCheckAll  全选按钮对象(集)
 * @param {Object} oCheckList 单个选中按钮对象(集)
 */
function checkAll(oCheckAll, oCheckList) {
    var length = oCheckList.length; // 总个数
        count  = 0, // 当前选中的个数
        status = false; // 控制全选按钮只在任何单个控件取消选中时执行一次清除全选按钮的选中状态

    // 绑定单个控件事件
    oCheckList.on("click", function() {
        count += this.checked ? 1 : -1;

        oCheckAll.each(function() {
            this.checked = count === length ? true : false;
        })
    }).each(function() {
        // onload 后计算被选中的控件个数
        count += this.checked ? 1 : 0;
    });

    // 绑定全选按钮事件
    oCheckAll.on("click", function() {
        var icheck = this.checked;
        oCheckList.each(function() {
            this.checked = icheck;
        });
        oCheckAll.each(function() {
            this.checked = icheck;
        });
        count  = icheck ? length : 0;

    }).each(function() {
        if (count !== 0 && count === length) {
            this.checked = true
        } else {
            // 退出循环
            return false;
        }
    });

}

// 判断微信
function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}
// 后端 eg:php
function is_weixin(){
    if ( strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false ) {
            return true;
    }  
    return false;
}


function placeholderFn() {
    "placeholder" in document.createElement("input") || $("[placeholder]").focus(function() {
        var a = $(this);
        a.val() == a.attr("placeholder") && (a.val(""), a.removeClass("placeholder"))
    }).blur(function() {
        var a = $(this);
        ("" == a.val() || a.val() == a.attr("placeholder")) && (a.addClass("placeholder"), a.val(a.attr("placeholder")))
    }).blur(), "" === $("[placeholder]").value && ($("[placeholder]").value = $("[placeholder]").attr("placeholder"))
}

// cookie
cookieFn = {
    addCookie: function(objName,objValue,objHours) {
        var str = objName + "=" + escape(objValue);
        if(objHours > 0){
            var date = new Date();
            var ms = objHours*3600*1000;
            date.setTime(date.getTime() + ms);
            str += "; expires=" + date.toGMTString();
        }
        str += '; path=/; domain=lppz.com';
        document.cookie = str;
    },
    getCookie: function(objName){
        var arrStr = document.cookie.split("; ");
        for(var i = 0;i < arrStr.length;i ++){
            var temp = arrStr[i].split("=");
            if(temp[0] == objName) return unescape(temp[1]);
        } 
    },
    delCookie: function(name) {
        var date = new Date();
        date.setTime(date.getTime() - 1);
        var cval = this.getCookie(name);
        if(cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },
    
    set: function(key, val, day) {
        var ck = key + "=" + escape(val);
        if(day > 0){
            var date = new Date();
            var ms = day * 24 * 3600 * 1e3;
            date.setTime(date.getTime() + ms);
            ck += "; expires=" + date.toGMTString();
        }
        document.cookie = ck;
    },
    get: function(key) {
        var ck = document.cookie.split('; ');
        for (var i = 0; i < ck.length; i++) {
            var temp = ck[i].split('=');
            if (temp[0] == key) return unescape(temp[1]);
        }
    },
    del: function(key) {
        var date = new Date();
        date.setTime(date.getTime() - 1e4);
        document.cookie = key + '=v; expires =' + date.toGMTString();
    }
}

function checkLS() {
    var e = !1;
    if ("localStorage" in win && null != win.localStorage) try {
        localStorage.setItem("test", "test"), localStorage.removeItem("test"), e = !0
    } catch (t) {}
    return e
}

// trim
function trim(e) {
    return isString(e) ? e.replace(/^\s+|\s+$/g, "") : ""
}

// 商品数量只能输入正整数，绑定 keyup change就行
function setAmount(ele, val) {
    var val = ele.value;
    if (val) {
        val = (!isNaN(val = parseInt(val, 10)) && val) > 0 ? val : 1;
        this.value = val;
    }
}
// 价格输入
$('body').on('blur', '.td3 .text', function() {
    var t = $(this)
      , n = $.trim(t.val());

    return n = Number(n),
    isNaN(n) ? t.val(0) : (n = n.toFixed(2).toString(),
    n.length > 7 && (n = n.slice(7)),
    t.val(Number(n).toFixed(2)));
})

// 清除文本选择
var clsSelect = 'getSelection' in window ? function () {
    window.getSelection().removeAllRanges();
} : function () {
    try {
        document.selection.empty();
    } catch (e) {};
};

// 生成ID
function generateID() {
    var x = (new Date).getTime(),
        e = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
            var n = (x + 16 * Math.random()) % 16 | 0;
            return x = Math.floor(x / 16), ("x" == e ? n : 7 & n | 8).toString(16);
        });
    return e
}

// 生成uuid
uuid = {
    generateUUIDV4 = function() {
        var x = (new Date).getTime(),
            e = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
                var n = (x + 16 * Math.random()) % 16 | 0;
                return x = Math.floor(x / 16), ("x" == e ? n : 7 & n | 8).toString(16)
            });
        return e
    },

    uuidCompact = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}

// 获取移动端系统
function getOS() {
    var e = navigator.userAgent,
        t = {
            webkit: !!e.match(/WebKit\/([\d.]+)/),
            android: !(!e.match(/(Android)\s+([\d.]+)/) && !e.match(/Silk-Accelerated/)),
            androidICS: !(!this.android || !e.match(/(Android)\s4/)),
            android2: !!e.match(/(Android)\s2/i),
            androidFF: !!e.match(/Android/i),
            ipad: !!e.match(/(iPad).*OS\s([\d_]+)/),
            iphone: !(e.match(/(iPad).*OS\s([\d_]+)/) || !e.match(/(iPhone\sOS)\s([\d_]+)/)),
            ios: !!e.match(/(iPad).*OS\s([\d_]+)/) || !(e.match(/(iPad).*OS\s([\d_]+)/) || !e.match(/(iPhone\sOS)\s([\d_]+)/)),
            wphone: !!e.match(/Windows Phone/i),
            firefox: !!e.match(/Firefox/i),
            cmblife: !!e.match(/cmblife/i),
            UCBrowser: !!e.match(/(UCBrowser)|(UCWeb)/g),
            Safari: !!e.match(/Safari/i),
            weiXin: !!e.toLowerCase().match(/micromessenger/i)
        };
    return t
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}



// 防抖动函数
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// 简单的节流函数
function throttle(func, wait, mustRun) {
    var timeout,
        startTime = new Date();
 
    return function() {
        var context = this,
            args = arguments,
            curTime = new Date();
 
        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if(curTime - startTime >= mustRun){
            func.apply(context,args);
            startTime = curTime;
        // 没达到触发间隔，重新设定定时器
        }else{
            timeout = setTimeout(func, wait);
        }
    };
};

// 输入数量
$('.plist2').on('keyup', '.stock', function() {
    var val = this.value;
    if (val) {
        val = (!isNaN(val = parseInt(val, 10)) && val) > 0 ? val : '';
        this.value = val;
    }
})
// 输入单价
$('.plist2').on('keyup', '.price', function() {
    var val = this.value;
    if (!/^\d+\.?\d*$/.test(val)) {
        val = Math.abs(parseFloat(val));
        this.value = isNaN(val) ? '' : val;
    }
})

$('#price').on('blur', function() {
    var val = this.value;
    if (!/^\d+\.?\d*$/.test(val)) {
        val = Math.abs(parseFloat(val));
    }
    val = Math.abs(parseFloat(val));
    this.value = isNaN(val) ? '' : parseFloat(val.toFixed(2));
})

// 随机颜色
var color = '#' + (~~(Math.random() * (1 << 24))).toString(16);


// 获取数组中的最大最小值
Math.min.apply(null,arr);//获取数组中最小值
Math.max.apply(null,arr);//获取数组中的最大值

// table拖动
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


// 获取表单数据并生成json
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


// 获取当前系统时间
function getSystemTime() {
    var date   = new Date();
    var year   = date.getFullYear();
    var month  = date.getMonth() + 1
    var day    = date.getDate();
    var hour   = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return ([year, month, day, hour, minute, second]).map(function (n) {
        n = n.toString();
        return n[1] ? n : '0' + n
    }).join('');
}
