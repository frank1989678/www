var zd = {
	loading: function(msg) {
		msg = msg || '正在加速，请稍后...';
        this.closeLoading();
        $('<div class="loading"><i class="s"></i><span class="text">' + msg + '</span></div>').appendTo($('body'));
	},
    closeLoading: function() {
        $('.loading').remove();
    },
    /**
	 * 跳转到首页
	 * @param  {string} time 延迟时间，单位秒，默认2分钟
	 */
    pagehome: function(time) {
        window.location.href = 'page1.html';
    	time = isNaN(time) ? 120 : time;
    	this.time1 = setTimeout(function() {
    		parent.$('#iframe').fadeOut();
    		parent.$('#home').fadeIn();
    	}, time * 1e3);
    },
    page: function(url) {
    	var k = (new Date).getTime();
        window.location.href = url;
		parent.$('#iframe').hide().attr('src', url + '?_' + k).fadeIn();
    	parent.$('#home').hide();
    }
}