var api = {
    fullScreen: function(el) {
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
            wscript;

        if (typeof rfs != 'undefined') {
            rfs && rfs.call(el);
        } else if (typeof window.ActiveXObject != 'undefined') {
            wscript = new ActiveXObject('WScript.Shell');
            wscript && wscript.SendKeys('{F11}');
        }
    },
    exitFullScreen: function(el) {
        var el= document,
            cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
            wscript;

        if (typeof cfs != 'undefined') {
            cfs && cfs.call(el);
        } else if (typeof window.ActiveXObject != 'undefined') {
            wscript = new ActiveXObject('WScript.Shell');
            wscript && wscript.SendKeys('{F11}');
        }
    }
}


// 全屏
$('.amapWrap').on('dblclick', function() {
    var content = document.getElementById('amap');
    api.fullScreen(content);
})