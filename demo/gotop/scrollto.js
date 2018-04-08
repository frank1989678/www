var scrollto = function(id) {
	var elTop = getOffset(document.getElementById(id))[0];
	var diff = -1;
	var linear = function() {
		var stop2 = document.documentElement.scrollTop || document.body.scrollTop;

		timerAnim && clearTimeout(timerAnim);
		if (stop2 == elTop || diff == stop2) {
			fixed();
		    return;
		}
		diff = stop2;
		stop2 += elTop >= stop2 ? Math.ceil((elTop - stop2) / 2) : Math.floor((elTop - stop2) / 2);
		setTimeout(function(){linear()}, 10);
		window.scrollTo(0, stop2);
	}
	linear();
}