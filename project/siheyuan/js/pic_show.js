$(function() {
	/*
	本代码由素材家园收集并编辑整理;
	尊重他人劳动成果;
	转载请保留素材家园链接 - www.sucaijiayuan.com
	*/
	var firstpic = $(".picmidmid ul li").first().find("img");
	var firstsrc = firstpic.attr("bigimg");
	var firsttxt = firstpic.attr("text");
	$("#pic1").attr("src", firstsrc);
	firstpic.addClass("selectpic");
	$("#preArrow").hover(function() {
		$("#preArrow_A").css("display", "block")
	},
	function() {
		$("#preArrow_A").css("display", "none")
	});
	$("#nextArrow").hover(function() {
		$("#nextArrow_A").css("display", "block")
	},
	function() {
		$("#nextArrow_A").css("display", "none")
	});
	var getli = $(".picmidmid ul li");
	function nextclick() {
		var currrentindex = parseFloat($("#pic1").attr("curindex"));
		var length = getli.length;
		if (currrentindex != (length - 1)) {
			var curli = getli.eq(currrentindex);
			if (currrentindex > 2) {
				getli.eq(currrentindex - 3).css("display", "none");
				getli.eq(currrentindex + 1).css("width", "210px").css("display", "block")
			}
			var curnextli = getli.eq(currrentindex + 1);
			var curnextsrc = curnextli.find("img").attr("bigimg");
			var curnexttxt = curnextli.find("img").attr("text");
			curli.find("img").removeClass("selectpic");
			curnextli.find("img").addClass("selectpic");
			$("#pic1").attr("src", curnextsrc);
			$("#pic1").attr("curindex", currrentindex + 1);
		} else {
		}
	}
	$("#nextArrow_B").click(function() {
		nextclick()
	});
	$("#nextArrow").click(function() {
		nextclick()
	});
	function preclick() {
		var currrentindex = parseFloat($("#pic1").attr("curindex"));
		if (currrentindex != 0) {
			var curli = getli.eq(currrentindex);
			var length = getli.length;
			if (currrentindex <= (length - 4)) {
				getli.eq(currrentindex + 3).css("display", "none");
				getli.eq(currrentindex - 1).css("width", "210px").css("display", "block")
			}
			var curnextli = getli.eq(currrentindex - 1);
			var curnextsrc = curnextli.find("img").attr("bigimg");
			var curnexttxt = curnextli.find("img").attr("text");
			curli.find("img").removeClass("selectpic");
			curnextli.find("img").addClass("selectpic");
			$("#pic1").attr("src", curnextsrc);
			$("#pic1").attr("curindex", currrentindex - 1);
		} else {
		}
	}
	$("#preArrow_B").click(function() {
		preclick()
	});
	$("#preArrow").click(function() {
		preclick()
	});
	getli.click(function() {
		var currentliindex = $(this).index(".picmidmid ul li");
		$(".picmidmid ul li img[class='selectpic']").removeClass("selectpic");
		var currentli = getli.eq(currentliindex);
		currentli.find("img").addClass("selectpic");
		var bigimgsrc = currentli.find("img").attr("bigimg");
		var curnexttxt = currentli.find("img").attr("text");
		$("#pic1").attr("src", bigimgsrc);
		$("#pic1").attr("curindex", currentliindex);
	});
});
/*
本代码由素材家园收集并编辑整理;
尊重他人劳动成果;
转载请保留素材家园链接 - www.sucaijiayuan.com
*/