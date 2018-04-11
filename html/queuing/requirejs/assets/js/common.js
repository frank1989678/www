var zd = {
	loading: function(msg) {
		msg = msg || '请稍后...';
        this.closeLoading();
        $('<div class="waiting"><i class="process"></i><span class="text">' + msg + '</span></div>').appendTo($('body'));
	},
    closeLoading: function() {
        $('.waiting').remove();
    },
    /**
	 * 跳转到首页
	 * @param  {string} time 延迟时间，单位秒，默认2分钟
	 */
    pagehome: function(time) {
    	time = isNaN(time) ? 120 : time;
    	this.time1 = setTimeout(function() {
    		$('#iframe').fadeOut();
    		$('#home').fadeIn();
    	}, time * 1e3);
    },
    page: function(url) {
        $.ajax({
            url: ''
        })
		$('#iframe').html().fadeIn();
    	$('#home').hide();
    }
}