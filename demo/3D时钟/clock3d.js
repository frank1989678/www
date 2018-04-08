;$(function() {
	// 3d clock 

	var date = new Date(),
		hours = date.getHours(),
		minutes = date.getMinutes(),
		seconds = date.getSeconds();

	var $clock = $("#flipclock"),
		$hours = $clock.find(".flip:eq(0)"),
		$minute = $clock.find(".flip:eq(1)"),
		$second = $clock.find(".flip:eq(2)");

	var timer = -1; // 定时器

	var flip = function($obj, val) {
		var up = $obj.find(".flip-up"),
			down = $obj.find(".flip-down");

		if (val < 10) {
			val = "0" + val;
		}

		$obj.find(".flip-text").html(val);
	}

	var start = function() {
		flip($second, seconds);
		flip($minute, minutes);
		flip($hours, hours);
	}

	var resume = function() {
		timer = setInterval(function() {
			seconds ++;
			flip($second, seconds);
			if (seconds === 60) {
				seconds = 0;
				minutes ++;
				flip($minute, minutes);
				if (minutes === 60) {
					minutes = 0;
					hours ++;
					if (hours === 24) {
						hours = 0;
						flip($hours, hours);
					} 
				}
			}
		}, 1000);
	}

	start();
	resume();


});