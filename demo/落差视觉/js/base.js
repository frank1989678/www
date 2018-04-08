$(function() {
	var stopSwitch = false;
	var sideNav = $("#sideNav li");
	var section = $(".pages");
	var count = section.length;
    var current = 0;
    var hh = section.eq(0).outerHeight();
    var $window = $(window);
    var winHeight = document.documentElement.clientHeight || document.body.clientHeight;

	$(document).on("mousewheel", function(event, delta, deltaX, deltaY) {
		event.preventDefault();
		if (stopSwitch || deltaY === 0) {
			return false;
		}
		var index = -1;
		var up = (deltaY > 0 || delta > 0) ? true: false;
		var down = (deltaY < 0 || delta < 0) ? true: false;

		if (up && current > 0) {
			index = current - 1;
		}
		if (down && current < count - 1) {
			index = current + 1;
		}
		index > -1 && pageSwitching(index);
	})

	function pageSwitching(idx) {
		stopSwitch = true;
		var poxY = parseInt(idx, 10) * hh;
		sideNav.eq(idx).addClass("active").siblings().removeClass("active");
		$('html, body').animate({scrollTop: poxY}, 1400, 'easeInOutExpo', function(){
			stopSwitch = false;
			current = idx;
		});
	}

	sideNav.on("click", function() {
		!stopSwitch && pageSwitching($(this).index());
	})

	// // 第一屏动画
	// pageSwitching(0);
	$('html, body').scrollTop(0);

	function setOpacity(options) {
		var speed = 30 || options.speed || 1;
		var height = options.height;
		var posY = options.posY;
		var opacity = options.opacity;
		$window.on("scroll", function() {
			var stop = $window.scrollTop();
			if ((height + posY) < stop || (stop + winHeight) < posY) {
				return
			}
			var Y = (posY - stop) * speed / height;
			options.dom.css("opacity", (opacity + (Y > 0 ? -Y : Y)));
		})
	}

	function setTop(options) {
		var speed = options.speed || 0.1;
		var posY = options.posY;
		$window.on("scroll", function() {
			var stop = $window.scrollTop();
			if ((options.height + posY) < stop || (stop + winHeight) < posY) {
				return
			}
			var y = (posY - stop) * speed;
			if (options.reverse) {
				y = -y;
			}
			options.dom.css("top", (options.top + y));
		})
	}

	function setLeft(options) {
		var speed = options.speed || 0.1;
		var posY = options.posY;
		$window.on("scroll", function() {
			var stop = $window.scrollTop();
			if ((options.height + posY) < stop || (stop + winHeight) < posY) {
				return
			}
			var y = (posY - stop) * speed;
			if (options.reverse) {
				y = -y;
			}
			options.dom.css("left", (options.left + y));
		})
	}

	function anmiPage1($el) {
		var height = $el.height();
		var posY = $el.offset().top;
		var tit = $el.find('.area');
		var ico = $el.find('.icon');
		setOpacity({
			dom: tit,
			height: height,
			posY: posY,
			opacity: 1,
			speed: 30
		})
		setLeft({
			dom: tit,
			height: height,
			posY: posY,
			left: parseInt(tit.css("left"), 10),
			reverse: true,
			speed: 4
		})
		setOpacity({
			dom: ico,
			height: height,
			posY: posY,
			opacity: 1,
			speed: 30
		})
		setLeft({
			dom: ico,
			height: height,
			posY: posY,
			left: parseInt(ico.css("left"), 10),
			speed: 4
		})
	}
	function anmiPage2($el) {
		var height = $el.height();
		var posY = $el.offset().top;
		var tit = $el.find('.area');
		var li1 = $el.find('.li1');
		var li2 = $el.find('.li2');
		var li3 = $el.find('.li3');
		setTop({
			dom: tit,
			height: height,
			top: parseInt(tit.css("top"), 10),
			posY: posY,
			speed: 2
		})
		setLeft({
			dom: li1,
			height: height,
			posY: posY,
			left: parseInt(li1.css("left"), 10),
			reverse: true,
			speed: 4
		})
		setOpacity({
			dom: li1,
			height: height,
			posY: posY,
			opacity: 1,
			speed: 30
		})
		setLeft({
			dom: li3,
			height: height,
			posY: posY,
			left: parseInt(li3.css("left"), 10),
			speed: 4
		})
		setOpacity({
			dom: li3,
			height: height,
			posY: posY,
			opacity: 1,
			speed: 30
		})
		setOpacity({
			dom: li2,
			height: height,
			posY: posY,
			opacity: 1,
			speed: 30
		})
	}

	section.each(function(i){
		var $el = $(this);
		switch(i) {
			case 0:
				anmiPage1($el);
				break;
			case 1:
			case 2:
			case 3:
				anmiPage2($el);
				break;
			// no default
		}
	})
})