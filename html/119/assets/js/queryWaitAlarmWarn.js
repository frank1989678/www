!(function($) {
	var timer = null;
	var _time = 3;
	var isIe8 = navigator.userAgent.indexOf('MSIE 8.0') > 0;
	var mp3 = 'assets/voice/warn.mp3';
	var voice = isIe8 ? 
		'<embed id="warnMusic" autostart="false" loop="true" hidden="true" style="display:none;" type="audio/mp3" src="' + mp3 + '"></embed>' : 
		'<audio id="warnMusic" autostart="false" loop="loop" hidden="true" style="display:none;"><source src="' + mp3 + '" type="audio/mpeg"/></audio>';

	$('body').append(voice);

	$.playMusic = function(time) {
		time = time || _time;
		timer && clearTimeout(timer);
		document.getElementById('warnMusic').play();
		timer = setTimeout(function() {
			document.getElementById('warnMusic').pause();
		}, time * 1e3);
	}

	$.stopMusic = function(time) {
		time = time || 1;
		timer && clearTimeout(timer);
		timer = setTimeout(function() {
			document.getElementById('warnMusic').pause();
		}, time * 1e3);
	}
})(jQuery);
