var reg = {
	strReg: /[^\x00-\xff]/g;
}

(function(w,undefined){
	var c = {};
	c.isNumber = function(e) {
		var d = /^[1-9]\d*$/;
		return d.test(e)
	};
	c.limitStr = function(s, m, n) {
		s = parseInt(a.trim(s).length, 10);
		if(m == -1) {m = s + 1};
		if(n == -1){n = s - 1};
		return (s <= m && s >= n)
	};
	c.limitNum = function(s, m, n) {
		s = parseInt(s, 10);
		if(m == -1) {m = s + 1};
		if(n == -1){n = s - 1};
		return (s <= m && s >= n)
	};
	c.char = function(e,m,n) {
		var d = /[^\x00-\xff]/g;
		e.replace(d,"**");	
		return c.limitStr(e);

	};
	c.required = function(e) {
		return a.trim(e).length;
		// return e.replace(/^[\s\xA0]+/,"").replace(/[\s\xA0]+$/,"").length;
	};
	c.spChar = function(e) {
		var d = /^([a-zA-Z0-9 ,.\(\)'"£¬¡£¡°¡®¡¯¡±-]|[\u4e00-\u9fa5])*$/;
		return d.test(a.trim(e))
	};

	c.nickName = function(e) {
		var d = /^([a-zA-Z]|[\u4e00-\u9fa5]){2,6}$/;
		return d.test(a.trim(e))
	};

	c.mobile = function(e) {
		var d = /^1[345678]\d{9}$|^01[345678]\d{9}$/;
		return d.test(e);
	};
	c.tel = function(e) {
		var d = /^(0\d{2,4}-?)?[2-9]\d{6,7}(-\d{2,5})?$|^(?!\d+(-\d+){4,})[48]00(-?\d){7,16}$/;
		return d.test(e);
	};
	c.phone = function(e) {
		return c.mobile(e) || c.tel(e);
	};

	c.hasTelMail = function(e) {
		var d = /[0-9£°£±£²£³£´£µ£¶£·£¸£¹ÁãÒ»¶þÈýËÄÎåÁùÆß°Ë¾ÅÒ¼·¡ÈþËÁÎéÂ½Æâ°Æ¾Á]{6,}/
		return !d.test(e);
	};

	c.isContent = function(s, m, n) {
		if (a.trim(s).length <= 0 || (c.limitStr(s, m, n) && c.spChar(s))) {
			return true
		} 
		return false
	};
	
	c.choose = function(e) {
		return e == -1 ? false : true
	};

	c.username = function(e) {
		var d = /^([a-zA-Z0-9]|[\u4e00-\u9fa5]){4,16}$/;
		return d.test(e);
	};

	c.pwd = function(e) {
		var d = /^([a-zA-Z0-9_]){6,}$/;
		return d.test(e);
	};
	c.isNan = function(e) {
		return isNaN(e);
	};
	c.time = function(e) {
		var d = /^(\d{4})-(\d{2})-(\d{2})$/;  
		return d.test(e);
	};
	c.email = function() {
		var d = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		return d.test(e);
	};
	w.regex = c;
}(window));


function identityCodeValid(code) {
	var 
		tip    = "",
		pass   = !1,
		factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
		parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
		_code  = 0,
		iSum   = 0,
		i      = 0;

	if (!code) {
		tip = "请输入身份证号码";
	} else if (code.length === 15) {
		code = code.substr(0, 6) + '19' + code.substr(6, code.length - 6);
		for ( ; i < 17; i++) {
            _code += code.substr(i, 1) * factor[i];
        }
        code += parity[_code % 11];
	}

	if (code.length === 18) {
		if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
			tip = "身份证号格式错误";

		} else {
			for (i = 17; i >= 0; i--) {
	            iSum += (Math.pow(2, i) % 11) * parseInt(code.charAt(17 - i), 11);
	        }
	        if (iSum % 11 != 1) {
	        	tip = "身份证号无效";
	        } else {
	        	pass = !0;
	        }
		}
	} else {
		tip = "身份证长度或格式错误";
	}
}