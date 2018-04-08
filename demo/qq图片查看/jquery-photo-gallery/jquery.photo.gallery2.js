/*
 * AppGo使用的 图片查看插件
 * Author : lufeng@bingosoft.net
 * Version: 1.0.0
 * Date : 2015/11/17
 */
!(function($) {

var windowMargin = 8; //加多边距的宽高，使得图片看起来有边框效果
//图片查看器
$.fn.extend({  	
	photoGallery: function(options) {
		var isFirefox = navigator.userAgent.indexOf("Firefox") > -1 ;
		var MOUSEWHEEL_EVENT = isFirefox ? "DOMMouseScroll" : "mousewheel";
		var defaults = {
      		//图片缩放倍率
 	 		ratio : 1.2, 
 	 	 	//HTML模版
 	 	 	template : {
	 	 	 	//操作工具
	 	 	 	OPERTATION : '<div class="oper">' +
								'<span class="prev"><i class="icon_tool-prev"></i></span>' +
								'<span class="next"><i class="icon_tool-next"></i></span>' +
							 '</div>' +
							 '<div class="tool">' +
							 	'<div class="toolct">' +
								 	'<span class="oper_fullscreen" title="查看全屏"><i class="icon_tool-fullscreen"></i></span>' +
									'<span class="oper_bigger" title="放大图片"><i class="icon_tool-bigger"></i></span>' +
									'<span class="oper_smaller" title="缩小图片"><i class="icon_tool-smaller"></i></span>' +
									'<span class="oper_rotate" title="向右旋转"><i class="icon_tool-rotate"></i></span>' +
								'</div>' +
							 '</div>',
				//大图
				IMAGE : '<img class="image" ondragstart="return false;"/>' 	 	 	
 	 	 	}
		};
      
		var o = $.extend(defaults, options),
        	$gallery = $(this);
      	$gallery.append(o.template.OPERTATION);    

      	var $tool = $(this).find(".tool"),
			$fullscreen = $(this).find(".oper_fullscreen"),
			$bigger = $(this).find(".oper_bigger"),
			$smaller =  $(this).find(".oper_smaller"),
			$rotate = $(this).find(".oper_rotate"),
			$image,
			imageWidth,
			imageHeight,
			imgRatio,
			dragX,
			dragY,
			cW,
			cH,
			w,h,isVertical;
    	  
      	//显示工具栏
  	  	$gallery.on("mouseenter",function(e){
  	  		$tool.show();
			dragX = -1;
		}).on("mouseleave",function(e){
			$tool.hide();
		}).on("mousedown",function(e){
  	 		dragX=e.pageX || e.clientX;
			dragY=e.pageY || e.clientY;
			cW = document.body.clientWidth;
			cH = document.body.clientHeight;
  	  		e.stopPropagation(); 
  	  	}).on("mousemove",function(e){
  	  		if(dragX > 0){
	   	  		var nextDragX=e.pageX || e.clientX;
				var nextDragY=e.pageY || e.clientY ;
				var o = $image.offset(),
					left = o.left +  (nextDragX - dragX),
					top = o.top + (nextDragY - dragY),
					w = $image.width(),
					h = $image.height();
			
				if(isVertical){
					w = [h, h = w][0];
				}
				if(w > cW){
					if(left > 0){
						left = 0 ;
					}
					else if(left < cW - w){
						left = cW - w;
					}
				}else{
					left = o.left;
				}
				if(h > cH){
					if(top > 0){
						top = 0 ;
					}
					else if(top < cH - h){
						top = cH - h;
					} 
				} else{
					top = o.top;
				}	
			
				$image.offset({
					left : left,
					top : top
				});
				dragX=nextDragX;
				dragY=nextDragY; 	  
  	  		}
  	 	}).on("mouseup",function(e){
  	  		dragX = -1;
  	  	});
  	    	  
  	  	//全屏
		var isMax,preWidth, preHeight, preTop, preLeft;
  	 	$fullscreen.on("click", function(){
			var parentD = window.parent.document,
				J = $(parentD.getElementById("J_pg"));
			if(!isMax){
				isMax = true;
				preWidth = document.body.clientWidth;
				preHeight = document.body.clientHeight;
				preTop = J.css("top");
				preLeft = J.css("left");
				J.css({
					top: 0,
					left : 0,
					width : parentD.body.clientWidth,
					height : parentD.body.clientHeight,
				});
			} else{
				isMax = false;
				J.css({
					top: preTop,
					left : preLeft,
					width : preWidth,
					height : preHeight
				});
			}
  	  	});
  	  
  	  	//放大图片
  	  	$bigger.on("click", function(){
  	  		biggerImage();
  	  	});
  	  
  	  	//缩小图片
  	 	$smaller.on("click", function(){
			smallerImage();
  	  	});
  	  
  	  	//旋转
  	  	$rotate.on("click", function(){
  	  	
  	  		var rotateClass = $image.attr("class").match(/(rotate)(\d*)/);

  	  		if(rotateClass){
  	  			var nextDeg = (rotateClass[2] * 1 + 90) % 360;
				$image.removeClass(rotateClass[0]).addClass("rotate" + nextDeg);
  	  			resizeImage(nextDeg);
  	  			isVertical = nextDeg == 90 || nextDeg == 270;
  	  		} else{
  	  			$image.addClass("rotate90");
  	  			resizeImage("90");
  	  			isVertical = true;
  	  		}
  	  	});
  	  
	  	$(window).on("resize",function(){
	  		setImagePosition();
	  	});
		
		if(document.attachEvent){
			document.attachEvent("on"+MOUSEWHEEL_EVENT, function(e){
				mouseWheelScroll(e);
			});
		} else if(document.addEventListener){
			document.addEventListener(MOUSEWHEEL_EVENT, function(e){
				mouseWheelScroll(e);
			}, false);
		}	
		
		function mouseWheelScroll(e){
			var _delta = parseInt(e.wheelDelta || -e.detail),
				_pos = {"x":e.pageX, "y":e.pageY};
	    	//向上滚动
	  		if (_delta > 0) {
        		biggerImage(_pos);
        	}
        	//向下滚动
        	else {
            	smallerImage(_pos);
        	}
		}
		
		
	  	function init(){
  	    	toggleImage();
  	    	$(o.template.IMAGE)
  	    		.appendTo($gallery)
  	    		.attr("src", o.url)
  	    		.css({
			  	 	width : img.imgWidth,
			  	 	height : img.imgHeight,
			  	 	left : (cW - img.imgWidth)/2,
			  	 	top: (cH - img.imgHeight)/2
		  	})
	  	}
	  
	  	function toggleImage() {
	  		var img = new Image();
	    	imageWidth = o.imgs[o.activeIndex].imgWidth;
       		imageHeight = o.imgs[o.activeIndex].imgHeight;
       		imgRatio = imageWidth/ imageHeight;
        	cW = document.body.clientWidth;
			cH = document.body.clientHeight;
			$(".image", $gallery).removeClass("active");
			$image = $(".image[index='"+o.activeIndex+"']", $gallery).addClass("active").css({
				width : imageWidth,
				height : imageHeight
			}).removeClass("rotate0 rotate90 rotate180 rotate270");
	  		isVertical = false;
	  		setImagePosition();
	  	}	
	  
	 
	  	function biggerImage(pos){
  			var w = $image.width(),
  	  	 		h = $image.height(),
  	  	 		nextW = w * o.ratio,
  	  	 		nextH = h * o.ratio;
		 	if(nextW - w < 1) nextW = Math.ceil(nextW);
  	  	 	var percent =  (nextW / imageWidth * 100).toFixed(0);
  	  	 	if(percent > 90 && percent < 110){
  	  	 		percent = 100;
  	  	 		nextW = imageWidth;
  	  	 		nextH = imageHeight;
  	  		}
  	  	 	else if(percent > 1600) {
  	  	 		percent = 1600;
  	  	 		nextW = imageWidth * 16;
  	  	 		nextH = imageHeight * 16; 
  	  	 	}

  	  	 	$image.width(nextW).height(nextH);
  	  	 	setImagePosition(pos);
  	  	 	showPercentTip(percent);
	  	}
	  
	  	function smallerImage(){
	  		var w = $image.width(),
  	  	 		h = $image.height(),
  	  	 		nextW,
  	  	 		nextH;
  	  	 	var percent =  (w / o.ratio / imageWidth * 100).toFixed(0) ;
  	  	 	if(percent < 5) {
  	 			percent = 5;
  	  	 		nextW = imageWidth / 20;
  	  	 		nextH = imageHeight / 20;
  	  	 	}
  	  	 	else if(percent > 90 && percent < 110){
  	  	 		percent = 100;
   	  	 		nextW = imageWidth;
  	  	 		nextH = imageHeight;
  	  	 	} else{
  	  	 		nextW = w / o.ratio;
  	  	 		nextH = h / o.ratio; 
  	  	 	}
  	  	 
  	  	 	$image.width(nextW).height(nextH);
  	  	 	setImagePosition();
  	  	 	showPercentTip(percent);
	  	}
	  
	  	//重置图片宽高
	  	function resizeImage(rotateDeg){
	  	
	  		var mH = document.body.clientHeight - windowMargin,
  	  			mW = document.body.clientWidth - windowMargin;
	  		if(rotateDeg == '90' || rotateDeg == '270'){
	  			mW = [mH, mH = mW][0];
	  		}

	  		var width, height;
	  		width = Math.min(imageWidth, mW);
	  		height = Math.min(imageHeight, mH);
		
	  		if(width / height > imgRatio){
	  			width = height * imgRatio;
	  		} else{
	  			height = width / imgRatio;
	  		}

	  		$image.css({
				width:width,
				height:height
  			});
  			setImagePosition();
	  	}
	  
	  
	  	//显示百分比提示
	  	function showPercentTip(percent){
	    	$gallery.find(".percentTip").remove();
	  		$("<div class='percentTip'><span>"+percent+"%</span></div>").appendTo($gallery).fadeOut(1500);
	  	}
	  
  	  	//设置图片位置
	  	function setImagePosition(pos){
	  		var w = $image.width(),
	  	    	h = $image.height(),
  	  			cW = document.body.clientWidth,
  	  			cH = document.body.clientHeight,
  	  			x = 0,
  	  			y = 0;

  	  		if (pos) {
  	  			x = pos.x;
  	  			y = pos.y;
  	  		}

	        x -= $image.offsetLeft;
	        y -= $image.offsetTop;
	 
	        //计算位置，以鼠标所在位置为中心
	        //以每个点的x、y位置，计算其相对于图片的位置，再计算其相对放大后的图片的位置
	        // bgX = bgX-(x-bgX)*(ns-scaleSize)/(scaleSize);
	        // bgY = bgY-(y-bgY)*(ns-scaleSize)/(scaleSize);
		 

  	  		var left = (cW - w)/2,
				top = (cH - h)/2;

  			$image.css("left", left +"px").css("top", top+"px");
	  	}
	  
	  
  	  	init();
		return this;
	}
});
  
$.extend({
	openPhotoGallery : function(){
		$(".gallery").photoGallery({
			url : this.url
		});
		$(".closeWin").click(function(){
			$(_jg).remove();
		});
	}
});
  
})(jQuery);
