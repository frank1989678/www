// slide
!(function($){
	$.easing.easeInOutExpo = function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}

	var defaults = {
		speed: 700,
		delay: 5e3,
		idx: 0,
		easing: 'swing',
		autoPlay: true
	}

	// Carousel
	function Carousel(elem, options) {
		this.settings = $.extend({}, defaults, options);
		this.idx      = this.settings.idx;
		this.$elem    = $(elem);
		this.$items   = this.$elem.find('li');
		this.length   = this.$items.length;
		this.length > 1 && this.init();
	}
	Carousel.prototype = {
		init: function() {
			this.createNav();
			this.setCss();
			this.bindEvent();
			this.autoPlay();
		},
		createNav: function() {
			this.$elem.append('<div class="ctrl prev"></div><div class="ctrl next"></div>');
			this.$prev = this.$elem.find('.prev');
			this.$next = this.$elem.find('.next');
		},
		doPlay: function(step) {
			var self = this;
			self.$items.eq(self.idx).stop().animate({'left': -1 * step + '00%'}, self.settings.speed, self.settings.easing, function(){
				$(this).removeClass('current');
			});

			if (step === -1) {
				self.idx = self.idx === 0 ? self.length - 1 : self.idx - 1;
			} else {
				self.idx = self.idx === self.length - 1 ? 0 : self.idx + 1;
			}

			self.$items.eq(self.idx).stop().addClass('current').css({'left':step + '00%'}).animate({'left':0}, self.settings.speed, self.settings.easing);
			self.autoPlay();
		},
		autoPlay: function() {
			var self = this;
			if (self.settings.autoPlay !== true) {
				return;
			}
			this.timer && clearInterval(this.timer);
			this.timer = setInterval(function() {
				self.$next.trigger('click');
			}, self.settings.delay);

		},
		bindEvent: function() {
			var self = this;
			self.$prev.on('click', function() {
				self.doPlay(-1);
			})
			self.$next.on('click', function() {
				self.doPlay(1);
			})
		},
		setCss: function() {
			this.$items.eq(0).addClass('current');
		}
	}
	$.fn.carousel = function(options) {
		return this.each(function() {
			new Carousel(this, options);
		});
	}
})(jQuery);