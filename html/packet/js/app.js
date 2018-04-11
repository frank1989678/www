var fx = {
	msg: function(message, time) {
		if (message) {
			this.hideMsg(1);
			$('body').append('<div class="pop-msg fadeIn animated"><span>' + message + '</span></div>');
			this.hideMsg(time || 3e3);
		}
	},
	hideMsg: function(time) {
		time = time || 1;
		if (time === 1) {
			 this.msgTime && clearTimeout(this.msgTime);
			$('.pop-msg').remove();
		} else {
			this.msgTime = setTimeout(function() {
				$('.pop-msg').remove();
			}, time);
		}
	}
}

