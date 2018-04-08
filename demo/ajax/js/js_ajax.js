// 生成随机数
function createNum(lowerValue, upperValue) {
    var count = upperValue - lowerValue + 1;
    return Math.floor(Math.random() * count + lowerValue)
}

// 获取数组中的极值（最大/最小）
function getMaximin (arr,maximin) {  
    if (maximin == "max") {  
        return Math.max.apply(Math, arr);  
    }else if (maximin == "min") {  
        return Math.min.apply(Math, arr);  
    }  
}  

// 获取已知年月的最大天数
function getDayNum(year,month) {
	if (year > 0 && month > 0) {
    	return 32 - new Date(year,month,32).getDate();
	} else {
		return 0;
	}
}

// 生成日期
function createDate() {
	var date  = new Date(),
		year  = date.getFullYear() - createNum(0, 100), //随机生成距今100年内的某一年
		month = createNum(1, 12),	//随机生成月
		day   = createNum(1, getDayNum(year, month)); 	//随机生成日

	month < 10 && (month = "0"+month);
	day < 10 && (day = "0"+day);

	return year + '-' + month + '-' + day;
}

// 生成手机号码
function createTelphoneNum() {
	var t = [3,4,5,6,8],
		r = '1' + t[createNum(0, 4)];

	for (var i = 0; i < 9; i++) {
		r += createNum(0, 9)
	}
	return r;
}

// 获取城市的id
function getId(object) {
	var id = [];
	for (var i in object) {
		object.hasOwnProperty(i) && i != 0 && id.push(i);
	}
	return id;
}

// 生成地址（需关联全国地区js库）
function createAddress(citys) {
	if (typeof citys !== "object") {
		return '';
	}
	var id = getId(citys);
	var pid = id[createNum(0, id.length-1)];
	var obj = citys[pid];
	var address = obj.n;


	id = getId(obj.s);
	pid = id[createNum(0, id.length-1)];
	obj = obj.s[pid];
	address += obj.n;

	id = getId(obj.s);
	pid = id[createNum(0, id.length-1)];
	address += obj.s[pid];

	return address;
}


// 生成姓名
function createName() {
	var t = createNum(0, surname.length-1),
		n = createNum(0, lastname.length-1)
	return (surname[t] + lastname[n]);
}

// 填入身份信息
function initForm() {
	$("#birthday").val(createDate());
	$("#tel").val(createTelphoneNum());
	$("#address").val(createAddress(CITYLIST));
	$("#name").val(createName());
}

// 
function tipsMsg(msg, delay) {
	var tips = $("#tipsMsg");
	 if (tips.length !== 1) {
	 	tips = $('<div id="tipsMsg" class="tipsMsg"></div>').appendTo($("body"));
	 }
	 tips.stop(true, false).html(msg).fadeIn(300).delay(delay * 1000).fadeOut(300);
}


$(function() {
	// tab切换
	$(".tab_btn").on("click", function() {
		var t = $(this),
			k = t.index();
		t.addClass("curr").siblings().removeClass("curr");
		t.parent().next().find(">.tabcont").removeClass("curr").eq(k).addClass("curr");
	})

	// 全选
	var cbx_one = $(".cbx_one"),
		cbx_all = $(".cbx_all"),
		cbx_max = cbx_one.length;
		cbx_min = 0,
		cbx_flag = false;

	cbx_one.on("click", function() {
		this.checked ? cbx_min++ : cbx_min--;
		if (cbx_min === cbx_max) {
			cbx_flag = true;
			cbx_all.each(function() {
				this.checked = true;
			})
		} else if (cbx_flag) {
			cbx_flag = false;
			cbx_all.each(function() {
				this.checked = false;
			})			
		}
	}).each(function() {
		this.checked && cbx_min++;
	});

	cbx_all.on("click", function() {
		var flag = this.checked;
		cbx_one.each(function() {
			this.checked = flag;
		});
		cbx_min = flag ? cbx_max : 0;
		cbx_flag = flag;
	});

	// 删除
	$("body").on("click", ".del", function() {
		var iid = $(this).attr("data-iid"),
			tr  = $(this).closest("tr"),
			dia = dialog({
				title: "消息",
				content: "确认删除吗？",
				icon: "question",
				width: 300,
				padding: "25px 25px 5px",
				ok: function() {
					var t
					$.ajax({
						url: "php/del.php",
						type: "POST",
						dataType: "json",
						data: {delIid: iid},
						success: function(data) {
							if (data.status == 1) {
								// window.location.reload();
								dia.close();
								tipsMsg("删除成功！", "5");
								tr.remove();
							}
						}
					})
				},
				cancel: function() {}

			})
	})


	var flag = false;
	initForm();
	// 随机
	$("#random").on("click", function() {
		initForm();
	})
	
	// 提交
	$("#sub").on("click", function() {
		var that = $(this);
		if (flag) return false;
		flag = true;
		that.addClass("disabled")
		$.ajax({
			url:"php/add.php",
			type:"POST",
			data: $('#myform').serialize(),
			error: function(request) {
                that.next().attr("class", "msg error").html("提交失败！")
            },
            success: function(data) { 
            	tipsMsg("提交成功！", 3);
            	window.location.reload(true);
            }
		})
	});	

	var page = 1,
		ajaxLoader = null;
	$("#load").on("click", function() {
		ajaxLoader && ajaxLoader.abort()
		var that = $(this);
		that.addClass("disabled").val("正在加载...")
		ajaxLoader = $.ajax({
			url:"php/print.php",
			type:"POST",
			dataType: "json",
			data: {page: page},
			error: function(request) {
                that.next().attr("class", "msg error").html("网络错误！")
            },
            success: function(data, textStatus) { 
            	ajaxLoader = null;
            	if (textStatus !== 'success') {
            		return false; //ajax abort
            	}

                var html = '',
                	json = '';

				$.each(data, function(i, item){
					html += '<tr>';
					html += '<td>' + ((page - 1)*10 + (i + 1)) + '</td>';
					html += '<td>' + item.iid + '</td>';
					html += '<td class="tl">' + item.name + '</td>';
					html += '<td>' + item.tel + '</td>';
					html += '<td>' + item.birthday + '</td>';
					html += '<td class="tr">' + item.address + '</td>';
					html += '</tr>';
					//打印返回的对象
					json += ',<br />{<br />&#12288;&#12288;"iid":"' + item.iid + '"';
					json += ',<br />&#12288;&#12288;"name":"' + item.name + '"';
					json += ',<br />&#12288;&#12288;"tel":"' + item.tel + '"';
					json += ',<br />&#12288;&#12288;"address":"' + item.address + '"';
					json += ',<br />&#12288;&#12288;"birthday":"' + item.birthday + '"<br />}';
				})
				$("#ajaxJosn").append(html);
				$("#ajaxJosnSource").html('[' + json.substring(1) + ']').show();
            	page ++;    	
                that.removeClass("disabled").val("加载更多...");

            }
		})
	}).trigger("click");

	// 提交4
	$("#sub4").on("click", function() {
		// $("#myform").submit();
		var that = $(this);
		if (flag) return false;
		flag = true;
		that.addClass("disabled")
		$.ajax({
			url:"php/surname.php",
			type:"POST",
			data: $('#myform4').serialize(),
			error: function(request) {
                that.next().attr("class", "msg error").html("提交失败！");
            },
            success: function(data) { 
            	if (data.status == 0) {
            		that.next().attr("class", "msg error").html("提交失败！");
            		return false;
            	}
                that.next().attr("class", "msg success").html("提交成功！").show();
                $(".ipt").val("");
                setTimeout(function() {
                	flag = false;  
                	that.removeClass("disabled");
                	that.next().fadeOut(300);

                }, 1)
            }
		})
	});	

	// 提交5
	$("#sub5").on("click", function() {
		// $("#myform").submit();
		var that = $(this);
		if (flag) return false;
		flag = true;
		that.addClass("disabled")
		$.ajax({
			url:"php/name.php",
			type:"POST",
			data: $('#myform5').serialize(),
			error: function(request) {
                that.next().attr("class", "msg error").html("提交失败！");
            },
            success: function(data) { 
            	if (data.status == 0) {
            		that.next().attr("class", "msg error").html("提交失败！");
            		return false;
            	}
                that.next().attr("class", "msg success").html("提交成功！").show();
                $(".ipt").val("");
                setTimeout(function() {
                	flag = false;  
                	that.removeClass("disabled");
                	that.next().fadeOut(300);

                }, 1)
            }
		})
	});
})
