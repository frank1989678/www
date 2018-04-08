// JavaScript Document
$(function(){
	var oMantle = $(".mantle");
	var oPreBtn  = oMantle.find(".pre_btn");
	var oNextBtn = oMantle.find(".next_btn");
	var oBigImg =  oMantle.find(".bigimg");
	var oSmallLi =  oMantle.find(".smalllist li");
	var iNum = 0;
	var Mopen = true;
	oMantle.time = null;
	
	oMantle.hover(function(){
		oPreBtn.add(oNextBtn).fadeTo(300,1);
		clearInterval(oMantle.time)
	},function(){
		oPreBtn.add(oNextBtn).fadeTo(300,0);
		GetInto();
	})
	
	oBigImg.append(oBigImg.html())
	var aBigLi  = oBigImg.find("li");
	oBigImg.css({"width":aBigLi.length*500})
	
	
	GetInto();
	oSmallLi.click(function(){
		if(Mopen)
		{
			Mopen = false;
			iNum = $(this).index();
			oBigImg.stop(true,true).animate({"left":-500*iNum},function(){
				Mopen = true;
			});
			$(this).addClass("cur").siblings("li").removeClass("cur");
		}
	});
	
	oNextBtn.click(function(){
		if(Mopen)
		{
			Mopen = false;
			if(iNum==aBigLi.length/2)
			{
				iNum = 0;
				oBigImg.css({"left":0});
			}
			iNum++
			oBigImg.stop(true,true).animate({"left":-iNum*500},function(){
				Mopen = true;
			})
			if(iNum==aBigLi.length/2)
			{
				oSmallLi.eq(0).addClass("cur").siblings("li").removeClass("cur");	
			}
			else
			{
				oSmallLi.eq(iNum).addClass("cur").siblings("li").removeClass("cur");	
			}
		}
	});
	
	oPreBtn.click(function(){
		if(Mopen)
		{
			Mopen = false;
			if(iNum==0)
			{
				iNum = aBigLi.length/2;
				oBigImg.css({"left":-aBigLi.length/2*500});
			}
			iNum--
			oSmallLi.eq(iNum).addClass("cur").siblings("li").removeClass("cur");
			oBigImg.stop(true,true).animate({"left":-iNum*500},function(){
				Mopen = true;
			})	
		}
	});
	
	function GetInto(){
		if(oMantle.time){clearInterval(oMantle.time)}
		oMantle.time = setInterval(function(){
			if(Mopen)
			{
				Mopen = false;
				if(iNum==aBigLi.length/2)
				{
					iNum = 0;
					oBigImg.css({"left":0});
				}
				iNum++
				oBigImg.stop(true,true).animate({"left":-iNum*500},function(){
					Mopen = true;
				})
				if(iNum==aBigLi.length/2)
				{
					oSmallLi.eq(0).addClass("cur").siblings("li").removeClass("cur");	
				}
				else
				{
					oSmallLi.eq(iNum).addClass("cur").siblings("li").removeClass("cur");	
				}
			}
		},3000)
	}
})