(function(a,b) {
	var c = a(".pub-input,select[data-verifiy]"),
		formVerifiy = {};
	b.v = function(t) {
		var s = t.closest(".pub-item").find("p"),
			o = eval( "(" + t.attr("data-verifiy") + ")" ),
			m = t.attr("data-max") || -1,
			n = t.attr("data-min") || -1,
			v = t.attr("data-skip") || 0,
			x = t.val();
		if (v == 1) {
			return false;
		}
		for (var i in o) {
			if (!b.reg[i](x,m,n)) {
				s.html(i === "required" ? "\u4E0D\u80FD\u4E3A\u7A7A" : o[i]).show();
				t.addClass("error-input errorTips");
				formVerifiy[t.attr("name")] = 0;
				setTimeout(function() {
					t.removeClass("errorTips");
				}, 800)
				break;
			} else {
				formVerifiy[t.attr("name")] = 1;
			}
		}
	}
	c.on("focus", function(e) {
		a(this).removeClass("error-input");
		a(this).closest(".pub-item").find("p").hide();
	});
	c.on("blur", function(e) {
		var t = a(this);
		v(t);
	});

	a("#from").submit(function(l) {
		return false
	});

	a("#submit").on("click", function(w) {
		c.each(function(){
			t = a(this);
			b.v(t);
		})
		for (var i in formVerifiy) {
			if (formVerifiy[i] == 0) {
				scrollTo(0, a("[name="+i+"]").offset().top);
				return false;
			}
		}	

		//以下部分是表单提交数据
		var p = b("#form").serialize();
		return true; //提交表单
	})

}(Zepto,window));