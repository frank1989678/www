//function lazyload(option) { var settings = { defObj: null, defHeight: 0 }; settings = $.extend(settings, option || {}); var defHeight = settings.defHeight, defObj = (typeof settings.defObj == "object") ? settings.defObj.find("img") : $(settings.defObj).find("img"); var pageTop = function() { var d = document, y = (navigator.userAgent.toLowerCase().match(/iPad/i) == "ipad") ? window.pageYOffset : Math.max(d.documentElement.scrollTop, d.body.scrollTop); return d.documentElement.clientHeight + y - settings.defHeight }; var imgLoad = function() { defObj.each(function() { if ($(this).offset().top <= pageTop()) { var src2 = $(this).attr("data-original"); if (src2) { $(this).attr("src", src2).removeAttr("data-original") } } }) }; imgLoad(); $(window).bind("scroll", function() { imgLoad() }) } 

function loazyload() {
	var docTop  	= 0,
		docHeight	= 0,
		img 		= null,
		client  	= null,
		src 		= '',
		images  	= document.images || [],
		lazyimg 	= [];
		
	var getEleClient = function(element) {
		var h  = element.offsetHeight,
			t 	= 0;

	    while (element.offsetParent) {
			t += element.offsetTop;
	        element = element.offsetParent;
	    }
	    return {top: t, height: h};
	}

	for (var i = 0; i < images.length; i++) {
		img    = images[i];
		src    = img.getAttribute("data-original") || null;
		src && !lazyimg.hasOwnProperty(img) && lazyimg.push(img);
	}

	var imgLoad = function() {
		for (var i = 0; i < lazyimg.length; i++) {
			img = lazyimg[i];
			client  = getEleClient(img);
			src     = img.getAttribute("data-original") || null;
			if (client.top <= docTop + docHeight && client.top + client.height >= docTop) {
				img.src = src;
				img.removeAttribute("data-original");
				lazyimg.splice(i, 1);
			 	i --;
			 	i === 0 && $(window).off("scroll.lazyload");
			}
		}
	}

	imgLoad();

	var lazyloadTimer = null;
	$(window).bind("scroll.lazyload", function() {
		lazyloadTimer && clearTimeout(lazyloadTimer);
		lazyloadTimer = setTimeout(function() {
			docHeight = document.documentElement.clientHeight;
			docTop  = (document.documentElement.scrollTop || document.body.scrollTop);
			imgLoad();
		}, 50);
	})
}