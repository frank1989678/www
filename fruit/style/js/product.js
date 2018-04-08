// JavaScript Document

$(function() {
	$("#jqzoom").jqueryzoom({
		xzoom: 328,
		yzoom: 398,
		change: 'pic_list'
	})
})

$.fn.jqueryzoom = function(t) {
	var i = {
		xzoom: 200,
		yzoom: 200,
		offset: 10,
		lens: 1,
		change: 0
	};
	var e = jQuery;
	t && e.extend(i, t);
	var s = "";
	e(this).hover(function() {
		function t(e) {
			this.x = e.pageX,
			this.y = e.pageY
		}
		var a = e(this).offset().left,
			o = e(this).offset().top,
			n = e(this).find("img").get(0).offsetWidth,
			r = e(this).find("img").get(0).offsetHeight;
			s = e(this).find("img").attr("alt"),
			c = e(this).find("img").attr("jqimg");
		e(this).find("img").attr("alt", ""),
		0 == e("#zoomdiv").get().length && (e(this).after("<div id='zoomdiv'><img id='bigimg' src='" + c + "'/></div>"), e(this).append("<div id='jqZoomPup'>&nbsp;</div>")),
		e("#zoomdiv").width(i.xzoom).height(i.yzoom).show(),
		i.lens || e(this).css("cursor", "crosshair"),
		e(document.body).mousemove(function(s) {
			var mouse = new t(s);
			var c = e("#bigimg").get(0).offsetWidth,
				d = e("#bigimg").get(0).offsetHeight,
				l = "x",
				p = "y";
			if (isNaN(p) | isNaN(l)) {
				var p = c / n,
					l = d / r;
					e("#jqZoomPup").width(i.xzoom / (1 * p)).height(i.yzoom / (1 * l)),
					i.lens && e("#jqZoomPup").css("visibility", "visible")
			}
			var xpos = mouse.x - e("#jqZoomPup").width() / 2 - a,
				ypos = mouse.y - e("#jqZoomPup").height() / 2 - o;
			i.lens && (xpos = a > mouse.x - e("#jqZoomPup").width() / 2 ? 0 : mouse.x + e("#jqZoomPup").width() / 2 > n + a ? n - e("#jqZoomPup").width() - 2 : xpos, ypos = o > mouse.y - e("#jqZoomPup").height() / 2 ? 0 : mouse.y + e("#jqZoomPup").height() / 2 > r + o ? r - e("#jqZoomPup").height() - 2 : ypos),
			i.lens && e("#jqZoomPup").css({
				top: ypos + 9,
				left: xpos + 9
			}),
			scrolly = ypos,
			e("#zoomdiv").get(0).scrollTop = scrolly * l,
			scrollx = xpos,
			e("#zoomdiv").get(0).scrollLeft = scrollx * p
		})
	},
	function() {
		e(this).children("img").attr("alt", s),
		e(document.body).unbind("mousemove"),
		i.lens && e("#jqZoomPup").remove(),
		e("#zoomdiv").remove();
	})
	
	if(i.change) {
		var items = e("#"+i.change).find("li");
		items.eq(0).addClass("curr");
		items.on("mouseover", function() {
			$(this).addClass("curr").siblings().removeAttr("class");
			var url = $(this).find("img").attr("data-url"),
				path = "upload/";
			if(url) {
				$("#jqzoom").find("img").attr("src","uploads/400/" + url).attr("jqimg","uploads/800/" + url);
			}
		})
	}
}


