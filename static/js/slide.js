// slide
!(function($){
	var defaults = {
		speed: 700,
		delay: 5e3,
		idx: 0,
		easing: 'easeInOutExpo',
		autoPlay: true
	}
	function Carousel(elem, options) {
		this.settings = $.extend({}, defaults, options);
		this.idx = this.settings.idx;
		this.$elem    = $(elem);
		this.length = this.$elem.find('.bd li').length;
		this.length > 1 && this.init();
	}
	Carousel.prototype = {
		init: function() {
			this.createNav();
			this.$slide = this.$elem.find('.bd ul');
			this.$items = this.$slide.find('li');
			this.$nav = this.$elem.find('.hd i');
			this.bindEvent();
			this.setCss();
			this.autoPlay();
		},
		createNav: function() {
			var modal = [];
			var i = 0;
			for (; i < this.length; i++) {
				modal.push('<i', (this.idx === i ? ' class="current"' : '') ,'></i>');
			}
			if (this.$elem.find('.hd').length === 0) {
				this.$elem.append('<div class="hd">' + modal.join('') + '</div>');
			} else {
				this.$elem.find('.hd').html(modal.join(''));	
			}
		},
		doPlay: function(immediate) {
			var self = this;
			self.$nav.eq(self.idx).addClass('current').siblings().removeClass('current');
			self.$slide.stop().animate({'left': -self.idx + '00%'}, immediate ? 1 : self.settings.speed, self.settings.easing);
		},
		autoPlay: function() {
			var self = this;
			if (self.settings.autoPlay !== true) {
				return;
			}
			this.timer && clearInterval(this.timer);
			this.timer = setInterval(function() {
				self.idx = self.idx === self.length - 1 ? 0 : self.idx + 1;
				self.doPlay();
			}, self.settings.delay);
		},
		bindEvent: function() {
			var self = this;
			self.$nav.on('click', function() {
				self.idx = $(this).index();
				self.doPlay();
				self.autoPlay();
			})
		},
		setCss: function() {
			var width = this.length + '00%'
			this.$slide.css({'width': this.length + '00%', 'position':'absolute', 'left':'0', 'top':'0'});
			this.$items.css({'float':'left', 'width': (100 / this.length) + '%'});
		}
	}
	$.fn.carousel = function(options) {
		return this.each(function() {
			new Carousel(this, options);
		});
	}
})(jQuery);