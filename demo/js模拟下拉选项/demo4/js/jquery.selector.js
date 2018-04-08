;(function($, window) {

	var MAXCOUNT = 10;
	var ZINDEX = 999;
	var DEFAULT = false; // select的第一项是否显示为“请选择”

	var $op1 = $("#dropDown1");
	var $op2 = $("#dropDown2");
	var $op3 = $("#dropDown3");

	function DropDown(id, level) {
		this.$el = $( "#" + id );
		this.level = level;
		this._wrap()._init();
	};

	DropDown.prototype = {
		_init: function() {
			this._getDate()._addOptions();
			return this;
		},
		_wrap: function() {
			this.$wrap = $('<div class="dropdown"></div>');
			this.$el.before(this.$wrap);
			// this.$el.hide();
			this.$wrap.data("level", this.level);
			return this;
		},
		_getDate: function() {
			if (this.level === 1) {
				this.dataSource = window.addressCode;
			} else if (this.level === 2) {
				this.dataSource = window.addressCode[$op1.val()];
			} else {
				this.dataSource = window.addressCode[$op1.val()][$op2.val()];
			}
			return this;
		},
		_addOptions: function() {
			var self = this;
			var options = [];
			var lis = [];
			var defaultOption = '<option value="-1">请选择</option>';
			DEFAULT && options.push(defaultOption);
			$.each(self.dataSource, function(i, item){
				if (typeof item === "object") {
					options.push('<option value="' + i + '">' + item.n + '</option>');
					lis.push('<li data-value="' + i + '">' + item.n + '</li>');
				}
			});
			if (options.length > (DEFAULT ? 1 : 0)) {
				this.$el.html(options.join(""));
				this.$wrap.show();
				this._addLi(lis);
			} else {
				this.$wrap.hide();
			}
			return this;
		},
		_addLi: function(lis) {
			var self = this;
			lis.unshift('<ul' + (lis.length > MAXCOUNT ? ' class="mul"' : '') +  '>');
			lis.push('</ul>');
			lis.unshift('<h3><em>' + self.$el.find("option:checked").text() + '</em><i></i></h3>');
			this.$wrap.html(lis.join(""));
			return this;
		}
	};

    var dropdown1 = new DropDown("dropDown1", 1);
    var dropdown2 = new DropDown("dropDown2", 2);
    var dropdown3 = new DropDown("dropDown3", 3);

	// 关闭所有下拉
    var hideOthersDropdown = function() {
    	$(".dropdown ul").slideUp(300);
    };

    // 展开/关闭下拉，根据当前的状态自动执行
    $(document).on("click.dropdown", ".dropdown h3", function() {
    	hideOthersDropdown();
    	$(this).next().css({zIndex: ZINDEX ++}).stop(true, false).slideToggle(300);
    	return false;
    });

    // 点击选项后设置原select的相对应的option为选中状态
    $(document).on("click.dropdown", ".dropdown li", function() {
    	var val = $(this).data("value");
    	var txt = $(this).text();
    	$(this).parent().prev().find("em").html(txt);
    	$(this).parent().slideUp(300).parent().next().find("option").each(function() {
    		if (this.value == val) {
    			this.selected = true;
    			return false;
    		}
    	});

    	switch ($(this).closest(".dropdown").data("level")) {
    		case 1:
    			dropdown2._init();
    			dropdown3._init();
    			break;
    		case 2:
    			dropdown3._init();
    			break;
    		// no default;
    	}
    	return false;
    });

    // 点击页面时关闭下拉
    $(document).on("click.dropdown", function() {
    	hideOthersDropdown();
    });

    

})(jQuery, window);
