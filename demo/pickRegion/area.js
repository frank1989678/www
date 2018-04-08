!(function($) {
	$.fn.citys = function(parameter) {
		var defaults = {
            dataUrl:'area.json',     //数据库地址
            dataType:'json',          //数据库类型:'json'或'jsonp'
            provinceField:'province', //省份字段名
            cityField:'city',         //城市字段名
            areaField:'area',         //地区字段名
            code:0,                   //地区编码
            province:0,               //省份,可以为地区编码或者名称
            city:0,                   //城市,可以为地区编码或者名称
            area:0,                   //地区,可以为地区编码或者名称
            required: true,           //是否必须选一个
            nodata: 'hidden',         //当无数据时的表现形式:'hidden'隐藏,'disabled'禁用,为空不做任何处理
            onChange:function(){}     //地区切换时触发,回调函数传入地区数据
        };
        var options = $.extend({}, defaults, parameter);
        var cacheData = {}; // 缓存城市数据
        return this.each(function() {
        	var 
        		$this     = $(this),
        		$province = $this.find('select[name="'+options.provinceField+'"]'),
        		$city     = $this.find('select[name="'+options.cityField+'"]'),
        		$area     = $this.find('select[name="'+options.areaField+'"]');

                //如果设置地区编码，则忽略单独设置的信息
                if(options.code){   
					options.province = options.code - options.code%1e4;
					options.city     = options.code%1e4 ? options.code - options.code%1e2 : 0;
					options.area     = options.code%1e2 ? options.code : 0;
                }

            var format = {
            	init: function() {
            		this.bindEvent();
                    this.province();
            	},
            	bindEvent: function() {
            		//事件绑定
                    $province.on('change',function(){
                        options.province = this.value;
                        options.city = 0;
                        options.area = 0;
                        format.city();
                    });
                    $city.on('change',function(){
                        options.city = this.value;
                        options.area = 0;
                        format.area();
                    });
                    $area.on('change',function(){
                        options.area = this.value;
                    });
            	},
            	province:function(){
            		var html = options.required ? [] : ['<option value=""> - 请选择 - </option>'];
	            	$.each(cacheData, function(i, item) {
	            		html.push('<option value="'+i+'">'+item.name+'</option>');
	            	})
	            	$province.empty().html(html.join('')).val(options.province);
                    options.province = $province.val();
                    this.city();
                },
                city:function(){
                    var html = options.required ? [] : ['<option value=""> - 请选择 - </option>'];
                    var hasSon = false;
                    // 省份编码为0时
                    try {
						$.each(cacheData[options.province]['node'], function(i, item) {
	                    	html.push('<option value="'+i+'">'+item.name+'</option>');
	                    	hasSon = true;
	                    })
                    } catch(err){
                    }
                    $city.empty().html(html.join('')).val(options.city);
                    options.city = $city.val();
					if(options.nodata==='disabled'){
                        $city.prop('disabled',!hasSon);
                    }else if(options.nodata==='hidden'){
                        $city.css('display',!hasSon?'none':'');
                    }
                    this.area();
                },
                area:function(){
                    var html = options.required ? [] : ['<option value=""> - 请选择 - </option>'];
                    var hasSon = false;
                    // 城市编码为0时
                    try {
						$.each(cacheData[options.province]['node'][options.city]['node'], function(i, item) {
	                    	html.push('<option value="'+i+'">'+item.name+'</option>');
	                    	hasSon = true;
	                    })
                    } catch(err) {

                    }
                    $area.empty().html(html.join('')).val(options.area);
					if(options.nodata==='disabled'){
                        $area.prop('disabled',!hasSon);
                    }else if(options.nodata==='hidden'){
                        $area.css('display',!hasSon?'none':'');
                    }
                }
            }

            $.ajax({
            	url: options.dataUrl,
            	type: 'get',
            	dataType: options.dataType,
            	data: {ran: (new Date).getTime()},
            	success: function(data) {
            		cacheData = data;
            		format.init();
            	}
            })
        })
	}
})(jQuery);