$(function() {
	$(".ui-select").hover(
		function() {
			$(this).closest(".ui-select").find(".ui-select-op").show();
			$(this).addClass("ui-select-hover");			
		},
		function() {
			$(this).removeClass("ui-select-hover");
		}
	)

	$(".ui-select").on("mouseenter mouseleave click", "li", function(event){
		if (event.type === "mouseenter") {
			$(this).addClass("ui-select-hover");
		} else if (event.type === "mouseleave") {
			$(this).removeClass("ui-select-hover");
		} else {
			var val = $(this).text(),
			sel = $(this).closest(".ui-select");
			$("#" + sel.attr("data-value-id")).val(val);
			sel.find(".ui-selected>span").html($(this).text());
			$(this).siblings().removeClass("ui-select-curr");
			$(this).addClass("ui-select-curr").closest(".ui-select-op").hide();
		}
	})

})

;(function(window, $, undefined){
// cityList;

/*! 全国省市区三级联动菜单
 **	@id[string]: 下拉选择框父容器wrap 
 **	@p[string/number]: 选中省，可以传入名字或者id(数字)
 **	@c[string/number]: 选中市，可以传入名字或者id(数字)
 **	@t[string/number]: 选中区/县，可以传入名字或者id(数字)
 */
function JsSelect(id, p, c, t) {
	if (!(this instanceof JsSelect)) {
		return new JsSelect(id, p, c, t);	//强制使用new
	}
	this.init(id, p, c, t);
}

JsSelect.prototype = {
	init: function(id, p, c, t) {
		this.wrap = $("#" + id + ">.ui-select");
		this.psel = this.wrap.eq(0).find("ul");	//省下拉列表
		this.csel = this.wrap.eq(1).find("ul"); //市下拉列表
		this.tsel = this.wrap.eq(2).find("ul"); //区下拉列表
		this.pipt = this.wrap.eq(0).find(">.ui-selected>input"); //省隐藏域
		this.cipt = this.wrap.eq(1).find(">.ui-selected>input"); //市隐藏域
		this.tipt = this.wrap.eq(2).find(">.ui-selected>input"); //区隐藏域
		this.ptxt = this.wrap.eq(0).find(">.ui-selected>span"); //省文本值
		this.ctxt = this.wrap.eq(1).find(">.ui-selected>span"); //市文本值
		this.ttxt = this.wrap.eq(2).find(">.ui-selected>span"); //区文本值
		this.p = p || 0;
		this.c = c || 0;
		this.t = t || 0;
		this.view = null;  
		this.index = -1;		
		this.pipt.val(this.p);
		this.cipt.val(this.c);
		this.tipt.val(this.t);
		this.setPro(); //填充数据
		this.fn(); //绑定事件
	},
	options: function(elem, json, val) {
        var op = '',
        	k  = 0,
        	curr = '';
        for (var i in json) {
            if (i == val || json[i] == val || json[i].n == val) {
                curr = ' class="ui-select-curr"';
                k = 1;
            } else {
            	curr = '';
            	k = k == 1 ? 1 : 2;
            }
            op += '<li' + curr + ' data-value="' + i + '"><span>' + (typeof json[i] === "object" ? json[i].n : json[i]) + '</span></li>'; 
        }
        elem.html(op);
        if (k === 2) {
        	elem.find("li:first").addClass("ui-select-curr");
        }  
       	// elem.find(">li").length > 8 ? elem.addClass("ui-select-ovh") : elem.removeClass("ui-select-ovh");


    },
    setPro: function() {
    	this.options(this.psel, CITYLIST, this.p); //填充省
        var curr = this.psel.find("li.ui-select-curr");
    	this.ptxt.text(curr.text());
        this.pipt.val(curr.attr("data-value"));
    	this.setCity();
    },
    setCity: function() {
        var p = this.pipt.val();
        this.options(this.csel, CITYLIST[p].s, this.c);

        var curr = this.csel.find("li.ui-select-curr");
    	this.ctxt.text(curr.text());
        this.cipt.val(curr.attr("data-value"));

        this.setTown();
    },
    setTown: function() {
        var p = this.pipt.val(),
            c = this.cipt.val();
        this.options(this.tsel, CITYLIST[p].s[c].s, this.t);
        this.ttxt.text(this.tsel.find("li.ui-select-curr").text());
        this.tipt.val(this.tsel.find("li.ui-select-curr").attr("data-value"));
    },
    fn: function() {
    	var _this = this;

    	// 开关
    	this.wrap.hover(
			function() {
				_this.index = $(this).index();
				_this.getView(_this.index);
				_this.view.show();
				$(this).addClass("ui-select-hover");			
			},
			function() {
				_this.view = null;
				$(this).removeClass("ui-select-hover");
			}
		);


    	// 选值
		this.wrap.on("mouseenter mouseleave click", "li", function(event){
			if (event.type === "mouseenter") {
				$(this).addClass("ui-select-hover");

			} else if (event.type === "mouseleave") {
				$(this).removeClass("ui-select-hover");

			} else {
				$(this).siblings().removeClass("ui-select-curr");
				$(this).addClass("ui-select-curr");//.closest(".ui-select-op").hide();
				_this.view.hide();
				var val = $(this).attr("data-value"),
					txt = $(this).text();

				if (_this.index === 0) {
					_this.pipt.val(val);
					_this.ptxt.text(txt);
					_this.setCity();

				} else if(_this.index === 1) {
					_this.cipt.val(val);
					_this.ctxt.text(txt);
					_this.setTown();
				} else {

					_this.tipt.val(val);
					_this.ttxt.text(txt);
				}
			}
		})
    },
    getView: function(i) {
    	this.view = i == 0 ? this.psel : (i == 1 ? this.csel : (i == 2 ? this.tsel : null));
    }
}


if (!window.FRANK) {
	window.FRANK = {};
}

window.FRANK.jsSelect = JsSelect;

}(window, jQuery));


