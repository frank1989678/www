$(function() {
	$("section.model").addClass("active");
	var url = getQueryString("url");
	var urlInput = $("header .input-group input.url");
	urlInput.val(url);
	if (url == "" || url.length == 0) urlInput.focus();
	// if (!authentication()) return;
	$("section.model .device iframe").each(function(i, item) {
		if ($(this).parents(".ipad").length == 1) $(this).height($(this).parent().height() - 97).css("margin-top", 97);
		else $(this).height($(this).parent().height() - 45 - 64).css("margin-top", 64);
		if (url != "" && url.length > 0) window.frames[i].location.href = url
	});
	writePagesize();
	$("header .input-group .btn").bind("click",
	function() {
		var href = window.location.href;
		var pos = href.indexOf("?");
		if (pos > 0) href = href.substring(0, pos);
		var url = urlInput.val();
		if (url == "" || url.length == 0) {
			window.location.href = href;
			return
		}
		if (url.indexOf("http://") != 0) url = "http://" + url;
		window.location.href = href + "?url=" + url
	});
	$("header .right a.screenZoom").bind("click",
	function() {
		if ($(this).hasClass("zoom")) {
			$("section.model .device iframe").each(function(i, item) {
				if ($(this).parents(".ipad").length == 1) return;
				$(this).height($(this).parent().height() - 45 - 64).css("margin-top", 64)
			});
			$(this).removeClass("zoom")
		} else {
			$("section.model .device iframe").each(function(i, item) {
				if ($(this).parents(".ipad").length == 1) return;
				$(this).height($(this).parent().height() - 20).css("margin-top", 20)
			});
			$(this).addClass("zoom")
		}
		writePagesize()
	})
});
function writePagesize() {
	$("section.model .box").each(function(i, item) {
		var page = $(this).find(".device iframe");
		$(this).find("p u").html("页面尺寸： 宽 " + page.width() + " × 高 " + page.height() + " ( px )")
	})
}
function authentication() {
	var suffix = "com",
	count = 1,
	dot = ".";
	var d = (count + 999).toString() + "zhu" + dot + suffix;
	if (window.location.host.indexOf(d) < 0) {
		$("body").remove();
		return false
	}
	return true
}
function getQueryString(key) {
	var returnValue = "";
	var URLString = new String(document.location);
	var serachLocation = -1;
	var queryStringLength = key.length;
	do {
		serachLocation = URLString.indexOf(key + "\=");
		if (serachLocation != -1) {
			if ((URLString.charAt(serachLocation - 1) == '?') || (URLString.charAt(serachLocation - 1) == '&')) {
				URLString = URLString.substr(serachLocation);
				break
			}
			URLString = URLString.substr(serachLocation + queryStringLength + 1)
		}
	} while ( serachLocation != - 1 ) if (serachLocation != -1) {
		var seperatorLocation = URLString.indexOf("&");
		if (seperatorLocation == -1) returnValue = URLString.substr(queryStringLength + 1);
		else returnValue = URLString.substring(queryStringLength + 1, seperatorLocation)
	}
	return returnValue
}