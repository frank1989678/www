!(function($) {
	var isIe8 = navigator.userAgent.indexOf('MSIE 8.0') > 0;
	var mp3 = 'assets/voice/warn.mp3';
	var voice = isIe8 ? 
		'<embed id="warnMusic" autostart="false" loop="true" hidden="true" style="display:none;" type="audio/mp3" src="' + mp3 + '"></embed>' : 
		'<audio id="warnMusic" autostart="false" loop="loop" hidden="true" style="display:none;"><source src="' + mp3 + '" type="audio/mpeg"/></audio>';
	var playMusic = true;

	$('body').append(voice);

	$.stopMusic = function() {
		setTimeout(function() {
			playMusic = true;
		}, 3 * 60 * 1e3);
		$.messagerClose();
	}

	$.messagerClose = function(speed) {
		$('.messager').slideUp(speed || 300, function() {
        	$(this).remove();
        });
        playMusic = false;
        document.getElementById('warnMusic').pause();
	}
	$.messager = function(options) {
		var defaults = {
			width: 200,
			height: 100,
			time: 4000,
			speed: 600,
			title: '提示',
			content: '',
			easing: 'slide',
			music: true
		}
		var timer1 = null;
		var opts = $.extend(defaults, options || {});
		var delayClose = function() {
			if (opts.time > 0) {
				timer1 = setTimeout(function() {
	        		$.messagerClose();
	        	}, opts.time);
			}
		}
		var html = '<div class="messager" style="font-size:12px;border:#b9c9ef 1px solid;z-index:100;width:'
                + opts.width
                + 'px;height:'
                + opts.height
                + 'px;position:fixed; display:none;background:#cfdef4; bottom:0; right:0; overflow:hidden;"><div style="border:1px solid #fff;border-bottom:none;width:100%;height:25px;overflow:hidden;color:#1f336b;"><span class="message_close" style="float:right;padding:5px 0 5px 0;width:16px;line-height:auto;color:red;font-weight:bold;text-align:center;cursor:pointer;overflow:hidden;">×</span><div style="padding:5px 0 5px 5px;width:100px;line-height:18px;text-align:left;overflow:hidden;">'
                + opts.title
                + '</div><div style="clear:both;"></div></div> <div style="padding-bottom:5px;border:1px solid #fff;border-top:none;width:100%;height:auto;"><div id="message_content" style="margin:0 5px 0 5px;border:#b9c9ef 1px solid;padding:10px 0 10px 5px;width:'
                + (opts.width - 17)
                + 'px;height:'
                + (opts.height - 50)
                + 'px;color:#1f336b;text-align:left;overflow:hidden;">'
                + opts.content 
                + '</div></div></div>';

		$('body').append(html);

		$('.messager').on('click', '.message_close', function() {
			$.messagerClose();
		})
		$('.messager').on({
			mouseenter: function() {
				clearTimeout(timer1);
				timer1 = null;
			},
			mouseleave: function() {
				delayClose();
			}
		})
		$('.messager').slideDown(opts.speed);
		delayClose();

		if (playMusic) {
			 document.getElementById('warnMusic').play();
		}
	}
})(jQuery);

// 暂停声音3分钟
function stopMusic() {
	$.stopMusic();
}

function queryWaitAlarmWarn() {
	var data = {a: (new Date).getTime()};
	$.ajax({
		url: 'json/alarmwran.json',
		data: data,
		error: function() {
			$.messagerClose();
		},
		success: function(res) {
			var count = res.count;
			if (count == 0) {
				$.messagerClose();
			} else {
				$.messager({
					title: '待处理信息提醒', 
					content: '待处理的事故共<font style="font-size: 14px; color: red;padding: 0px 2px;">' + count + '</font>件<br/><a href="javascript:stopMusic();" style="font-size: 13px; color: black;" >点击</a>声音暂停3分钟',
					time: 0
				})
			}
		}
	})

	setTimeout(function() {
		queryWaitAlarmWarn();
	}, 60 * 1000);
}

$(function() {
	queryWaitAlarmWarn();
});