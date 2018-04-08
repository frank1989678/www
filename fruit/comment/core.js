//评论&回复 2013-08-23

var COMMENT = {
	SEND: false, //是否正在发送数据
	REPLY_SIZE:5, //每条评论每页显示的回复数量
	COMMENT_SIZE: 20,//每页显示的评论数量
	REPLY_ID: "#reply_list_",
	COMMENT_ID: "#comments",
	LOAD: true,//加载数据时为true， 评论或回复时为false
	SORT: "newest",//排序，默认最新，其他还有 最早（oldest）， 最热（hottest）
	TOP: false //第一次加载时不需页面滚动
}

//打开选择过了提示
function OpenYetCkTip(id) {
    var cWidth = $("#"+id).width() / 2;
    var windowH = $(window).height() / 2 - 90;
    $("#"+id).css("left", (document.documentElement.scrollWidth / 2) - cWidth + "px");
    $("#"+id).css("top", windowH + $(window).scrollTop());

    $(window).scroll(function() {
        $("#"+id).css("top", windowH + $(window).scrollTop());
    });
    $("#"+id).show();
}

//关闭选择过了提示
function closeYetCk(id) {
    $("#"+id).hide();
}

var comments = {
	maxWords: 200,
	lastUid: null,
	secure: function(str) {
		var e = {
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#x27;",
			"`": "&#x60;"
		},
		t = /&(?!\w+;)|[<>"'`]/g,
		n = /[&<>"'`]/,
		r = function(t) {
			return e[t] || "&amp;"
		};
		return str.replace(t, r);
	},
	height: function(el,minHeight) {
		el.style.height = minHeight + 'px';
		if (el.scrollHeight > minHeight) {
			el.style.height = el.scrollHeight + 'px';
		}
	},
	focus: function(el, tips) {
		el.parentNode.className += " ui_textarea_focus";
		comments.text(el, tips);	
	},
	blur: function(el) {
		el.parentNode.className = el.parentNode.className.replace(" ui_textarea_focus","");
	},
	like: function(cid, el) {
		var condition = cookieFn.getCookie(cid);
		if(condition == null || condition == "" || condition != "liked") {
			$.ajax({
				url: "",
				type: "get"	,
				data: {cid:cid, time:new Date().getTime().toString()},
				success: function(msg) {
					if(msg.liked) {
						$(el).html("<b>\u5DF2\u559C\u6B22</b>");
						return false;
					}
					document.getElementById("vote_" + cid).innerHTML = 29992 || msg.reply.count;				
					$(el).find("i").show().animate({ bottom: 26, opacity: "hide" }, 1000, function() {
						$(this).removeAttr("style");
						cookieFn.addCookie(30, cid, "liked");
						$(el).html("<b>\u5DF2\u559C\u6B22</b>");
					})
					
				}
			})
		} else {
			$(el).html("<b>\u5DF2\u559C\u6B22</b>");
		}
	},
	reply: function(cid) {
		if($("#reply_" + cid + ">.ui_comment_publish").length === 0) {
			if(this.lastUid !== null && this.lastUid !== cid) {		
				var old = document.getElementById("reply_" + this.lastUid);
				old.removeChild(old.firstChild);
				old.style.display = "none";
			}
			$("#reply_" + cid).prepend(this.replyDiv(cid));
		}
		if($(COMMENT.REPLY_ID + cid + ">.ui_list").length == 0) {
			getPage(1, cid, "reply");
		}
		this.toggle("reply_" + cid);
	},
	toggle: function(id) {
	//	toggle(id);
		if(document.getElementById(id) !== null){
			var el = document.getElementById(id),
				status = el.currentStyle ? el.currentStyle.display : window.getComputedStyle(el,null).display;
			if(status == "none") {
				el.style.display = "block";
				$("#reply_text").focus();
			} else {
				el.style.display = "none";			
			}
		}
				
		window.parent.iFrameHeight();		
		var mao = $("#iframepage",window.parent.document).offset().top + $("#" + id.replace("reply","comment")).offset().top;
		window.parent.scrollTo(0, mao);
	
	},
	publish: function(el, type, iid) { //iid：评论时为appId，回复时为userId
		//先判断登录		
		if(1 == 2) {
			//弹出一个登录框
			return false;		
		} else {
				
		}
		var tips = document.getElementById(type + "_beyond");//错误时提示		
		var content = document.getElementById(type + "_text").value;//内容
		if(0 == content.length) {
			tips.style.display = "none";
			tips.nextSibling.style.display = "inline-block";
			tips.nextSibling.innerHTML = "\u4F60\u8FD8\u6CA1\u6709\u8F93\u5165\u5185\u5BB9";//你还没有输入内容
			return false;
		}else if(this.maxWords > 0 && this.maxWords < content.length) {
			tips.style.display = "none";
			tips.nextSibling.style.display = "inline-block";
			tips.nextSibling.innerHTML = "\u4F60\u7684\u8F93\u5165\u5185\u5BB9\u592A\u957F\u4E86";//你的输入内容太长了 
			return false;	
		} else {
			tips.style.display.display = "inline-block";
			tips.nextSibling.style.display = "none";
		}				
		
		content = comments.secure(content);//特殊字符处理
		if(!COMMENT.SEND) {
			COMMENT.SEND = true;
			el.className = el.className + "_on";
			$.ajax({
				url: "",
				type: "get",
				data: {textcont:content, iid:iid, type: type},		
				success: function(msg) {
					if(msg.result || 1 > 0) {
						$("#" + type + "_tips").show().animate({ bottom: 46, opacity: "hide" }, 1000, function() {
							$(this).removeAttr("style");
						})
						document.getElementById(type + "_text").value = "";
						if(comments.maxWords > 0) {
							$("#" + type + "_beyond").html("\u8FD8\u80FD\u8F93\u5165<i>" + comments.maxWords + "</i>\u4E2A\u5B57");
						} else {
							$("#" + type + "_beyond").hide();
						}
						if(type === "reply") {
							jsnop_c = {
								cont: [
									{
										cid: iid,
										text: content,
										img: "../style/images/avatar.gif",
										name: "新回复",
										time: new Date().toLocaleTimeString()
									}
								],
								page: {
									curPage: 1,
									totalPages: 5,
									showPage: 2,
									count: 24
								}
							}
						} else {					
							jsnop_c = {
								cont: [
									{
										cid: $("#comments>.ui_list").length+1,
										text: content,
										img: "../style/images/avatar.gif",
										name: "新评论",
										time: new Date().toLocaleTimeString(),
										liked: 0
									}
								],
								page: {
									curPage: 1,
									totalPages: 5,
									showPage: 2,
									count: 24
								}
							}
						}		
						COMMENT.LOAD = false;		
						comments.render(type, jsnop_c);//返回结果组织页面元素
					} else {
						tips.style.display = "none";
						tips.nextSibling.style.display = "inline-block";
						tips.nextSibling.innerHTML = "错误提示";//服务器返回的错误信息
					}
					el.className = el.className.replace("_on","");
					COMMENT.SEND = false;
				}
			})
		}
	},
	text: function(el, tips) {
		this.height(el ,52);
		if(this.maxWords > 0){
			var content = el.value,
				tips = document.getElementById(tips + "_beyond"),
				maxWords = this.maxWords - content.length;
			
			if(maxWords >= 0){
				tips.innerHTML = "\u8FD8\u80FD\u8F93\u5165<i>" + maxWords + "</i>\u4E2A\u5B57";//还能输入x字
				//tips.removeAttribute("class");
			} else {
				tips.innerHTML = "\u5DF2\u8D85\u8FC7<i style=\"color:red\">" + (-maxWords) + "</i>\u5B57";//已超过x字	
				//tips.className = "red";
			}		
			tips.removeAttribute("style");	
			tips.nextSibling.style.display = "none";
		} else {
			tips.style.display = "none";	
		}
	},
	replyDiv: function(cid){
		var html  = '<div class="ui_comment_publish">';
			html +=         '<div class="ui_avatar">';
			html +=             '<img id="reply_avata" src="../style/images/avatar.gif" alt="\u6211\u7684\u5934\u50CF" />';
			html +=         '</div>';
			html +=         '<div class="ui_input">';
			html +=             '<div class="ui_textarea_box">';
			html +=                 '<div class="ui_textarea">';
			html +=                     '<textarea id="reply_text" onblur="comments.blur(this)" onfocus="comments.focus(this, \'reply\')" onkeyup="comments.text(this, \'reply\')"></textarea>';
			html +=                '</div>';
			html +=                '<div class="ui_tips" id="reply_tips">\u56DE\u590D\u6210\u529F\uFF01</div>';
			html +=            '</div>';
			html +=            '<div class="ui_submit">';
			html +=                '<span id="reply_beyond">\u8FD8\u80FD\u8F93\u5165<i>' + this.maxWords +'</i>\u4E2A\u5B57</span><span class="red"></span>\n';
			html +=                '<a class="ui_btn_submit" href="javascript:;" onclick="comments.publish(this, \'reply\', ' + cid + ')">\u7ACB\u5373\u56DE\u590D</a>';
			html +=            '</div>';
			html +=          '</div>';
			html +=    '</div>';
		this.lastUid = cid;
		return html;                    
	},
	render: function(type, jsnop) {
		var html = '',
			number = jsnop.page.count - (jsnop.page.curPage - 1) * COMMENT.REPLY_SIZE;//计算回复楼层的序号	
		if(type === "comment") {
			$("#comment_count").html(jsnop.page.count);	
		}
		$.each(jsnop.cont, function(i, json) {			
			html += type == "reply" ? '<div class="ui_list">' : '<div id="comment_' + json.cid + '" class="ui_list">';
			html += '	<div class="ui_avatar">';
			html += '		<img alt="\u6211\u7684\u5934\u50CF" src="' + json.img + '">';	
			html += '	</div>';
			html += '   <div class="ui_input">';
			html += '   	<div class="ui_userinfo">';
			if(type != "comment"){
				html += '		<i>' + (number - i) + '</i>';		
			}
			html += '       	<a href="javascript:;">' + json.name + '</a>';
			html += '    	</div>';
			html += '   	<div class="ui_content">';
			html += '       	<p>' + json.text + '</p>';
			html += '    	</div>';
			html += '    	<div class="ui_footer">';
			html += '       	<div class="ui_msg">';
			html += '           	<span>' + json.time + '</span>';  
			if(type == "comment") {
				html += '			<span><i class="red" id="vote_' + json.cid + '">' + json.liked + '</i>人喜欢</span>';   
			}
			html += '        	</div>';
			if(type == "comment") {
				html += '       <div class="ui_control">';
				html += '           <a onclick="comments.reply(' + json.cid + ')" href="javascript:;">回复</a>';
				html += '           <a onclick="comments.like(' + json.cid + ', this)" href="javascript:;">喜欢<i>+1</i></a>';                  
				html += '       </div>';
			}
			html += '     	</div>';
			if(type == "comment") {
				html += '   <div id="reply_' + json.cid + '" class="ui_reply_list">';
				html += '		<div id="reply_list_' + json.cid + '"><div class="loader">正在加载...</div></div>';
				html += '	</div>';
			}
			html += '	</div>';
			html += '</div>';	
		})
		var wrapDiv = type === "comment" ? $(COMMENT.COMMENT_ID) : $(COMMENT.REPLY_ID + jsnop.cont[0].cid);
		if(!COMMENT.LOAD){	
			wrapDiv.prepend(html);
			var count = type === "comment" ? COMMENT.COMMENT_SIZE : COMMENT.REPLY_SIZE;
			if(wrapDiv.find(">.ui_list").length >  count) {
				wrapDiv.find(">.ui_list:last").remove();
			}
		} else {
			wrapDiv.html(html);
		}
		if(jsnop.cont.length > 0) {
			showPage(jsnop.page.curPage, jsnop.page.totalPages, jsnop.page.showPage, jsnop.cont[0].cid, type);
		} else {
			wrapDiv.html("");
		}
		window.parent.iFrameHeight();
	}
}



/*
@curPage:当前页码 int
@totalPages:总页数 int
@showPage:前后显示的页码数量  int
@cid:页码被添加到的div元素id标示符
@type:回复或评论的页码 reply/comment
*/
function showPage(curPage, totalPages, showPage, cid, type) {
	curPage = parseInt(curPage);
	totalPages = parseInt(totalPages);
	showPage = parseInt(showPage);	
	if(totalPages <= 1) {
		return false;	
	}
	currPage = curPage > totalPages ? 1 : curPage;
	var first,//第一页
		last,//最后一页
		html = '',
		top = COMMENT.REPLY_ID + cid;//锚点，翻页后回到顶部
	if(type == "comment") {
		cid = 0;//无用的	
		top = COMMENT.COMMENT_ID;
	}
	first = curPage > showPage ? curPage - showPage : 1;
	last = totalPages > (curPage + showPage) ? curPage + showPage : totalPages;    
	for( ; first <= last; first++){
		html += '<a href="javascript:;"' + ((first == curPage) ? ' class="p_hov"' : ' onclick="getPage(' + first + ', \'' + cid + '\', \'' + type + '\')"') + '>' + first + '</a>\n';
	}
	if(curPage != 1) {
		html = '<a href="javascript:;" onclick="getPage(1, \'' + cid + '\', \'' + type + '\')">首页</a>\n<a href="javascript:;" onclick="getPage(' + (curPage -1 ) + ', \'' + cid + '\', \'' + type + '\')">上一页</a>' + html;
	}
	if(curPage != totalPages) {
		html += '<a href="javascript:;" onclick="getPage(' + (curPage + 1) + ', \'' + cid + '\', \'' + type + '\')">下一页</a>\n<a href="javascript:;" onclick="getPage(' + totalPages + ', \'' + cid + '\', \'' + type + '\')">末页</a>';
	}
	html = '<div class="ui_page">' + html + '</div>'
	var wrapDiv = type === "comment" ? $(COMMENT.COMMENT_ID) : $(COMMENT.REPLY_ID + cid);
	if(type !== "comment") {
		html += '<div class="ui_pick_up"><a href="javascript:;" onclick="comments.toggle(\'reply_' + cid + '\')">收起回复</a></div>';
		$(COMMENT.REPLY_ID + cid + ">.ui_pick_up").remove();	
	}
	wrapDiv.find(">.ui_page").remove();
	wrapDiv.append(html);
	
}

//评论是不需要cid,因为没有cid, 只有插入这条数据后才会相应的生成一个
function getPage(curPage, cid, type) {
	var orderby = type === "comment" ? COMMENT.SORT : 'newest';//回复只做默认排序
	var loading = type === "comment" ? $(COMMENT.COMMENT_ID) : $(COMMENT.REPLY_ID + cid);
	var count = type === "comment" ? COMMENT.COMMENT_SIZE : COMMENT.REPLY_SIZE;//返回多少条数据
	loading.css({position:"relative"}).append('<div class="loading">正在加载...</div>');	
	$.ajax({
		url: "",
		type: "get",
		data: {curPage: curPage, cid: cid, type: type, orderby: orderby, count: count},
		success: function() {
			COMMENT.LOAD = true;
			
			/** 这里是ajax返回的数据
		
			jsnop_r.page.curPage = curPage;
			comments.render(type, jsnop_r);
			**/
			
			/* 以下是在做本地测试 使用时请删掉 */
			if(type == "comment") {
				$.each(jsnop_c.cont, function(n, item){
					item.text = "这是第" + curPage + "页的第<i>" + curPage * (n+1) + "</i>数据,";
				})				
				jsnop_c.page.curPage = curPage;
				comments.render(type, jsnop_c);	
			} else {
				$.each(jsnop_r.cont, function(n, item){
					item.text = "这是第" + curPage + "页的第<i>" + curPage * (n+1) + "</i>数据,";
					item.cid = cid;
				})				
				jsnop_r.page.curPage = curPage;
				comments.render(type, jsnop_r);
			}
			/* end 本地测试*/
			
			loading.removeAttr("style").find(".loading").remove();
			if(COMMENT.TOP) {
				loading = type === "comment" ? $(COMMENT.COMMENT_ID).prev() : $("#reply_text").parent();
				var mao = $("#iframepage",window.parent.document).offset().top + loading.offset().top;
				window.parent.scrollTo(0, mao);
			}			
			COMMENT.TOP = true;
		}
	})
	
}

$(function(){
	//getPage(1, 0, "comment");//加载评论
	$("#comment_sort").on("click", "a", function() {
		if(this.className !== "curr") {
			$(this).addClass("curr").siblings().removeAttr("class");
			$(COMMENT.COMMENT_ID).html('<div class="loader">\u8BC4\u8BBA\u52A0\u8F7D\u4E2D...</div>');				
			COMMENT.SORT = $(this).attr("data-sort");
			getPage(1, 0, "comment");
		}
	})
})


//回复的json格式
var jsnop_r = {
	cont: [
		{
			cid: 111,
			text: "第一条回复",
			img: "../style/images/avatar.gif",
			name: "老大",
			time: "2000-09-10"
		},
		{
			cid: 111,
			text: "第二条回复",
			img: "../style/images/avatar.gif",
			name: "老二",
			time: "2012-12-13"
		},
		{
			cid: 111,
			text: "第三条回复",
			img: "../style/images/avatar.gif",
			name: "老三",
			time: "2000-09-10"
		},
		{
			cid: 111,
			text: "第四条回复",
			img: "../style/images/avatar.gif",
			name: "老四",
			time: "2012-12-13"
		},
		{
			cid: 111,
			text: "第五条回复",
			img: "../style/images/avatar.gif",
			name: "老五",
			time: "2000-09-10"
		}
	],
	page: {
		curPage: 1,
		totalPages: 5,
		showPage: 2,
		count: 24
	}
}

//评论的json格式
var jsnop_c = {
	cont: [
		{
			cid: 1,
			text: "第一条评论。这里是一段评论，你可以是一个汉字，一个英文字母，甚至是一个字母；但是你输入的这段话不能超过200个字",
			img: "../style/images/avatar.gif",
			name: "楼主",
			time: "2000-09-10",
			liked: 9
		},
		{
			cid: 2,
			text: "装有弹簧或厚泡沫塑料等的靠背椅，两边有扶手。构架是用木材或钢材内衬棉絮及其他泡沫材料等做成的椅子，整体比较舒适。",
			img: "../style/images/avatar.gif",
			name: "沙发",
			time: "2012-12-13",
			liked: 99
		},
		{
			cid: 3,
			text: "板凳腿，类似于建筑里的柱子，承重构件。 板凳板凳面，类似于建筑里的屋顶，把力分散到板凳腿上,与人接触面积大压强小，坐着不疼(要不直接坐腿上人受不了) ，在百姓的生活中充当着不可或缺的角色。",
			img: "../style/images/avatar.gif",
			name: "板凳",
			time: "2013-08-13",
			liked: 999
		},
		{
			cid: 4,
			text: "板凳腿，类似于建筑里的柱子，承重构件。 板凳板凳面，类似于建筑里的屋顶，把力分散到板凳腿上,与人接触面积大压强小，坐着不疼(要不直接坐腿上人受不了) ，在百姓的生活中充当着不可或缺的角色。",
			img: "../style/images/avatar.gif",
			name: "板凳",
			time: "2013-08-13",
			liked: 999
		}
	],
	page: {
		curPage: 1,
		totalPages: 5,
		showPage: 2,
		count: 24
	}
}



