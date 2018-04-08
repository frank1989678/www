var url = document.getElementById("dingkeImagePicker").getAttribute("src");
var dAddr = url.split("/")[2];


var T,TT;
window.onload = function(){
setTimeout('dingkeExtend(true)', 1000)
}
function dingkeExtend(boolen){  
    clearTimeout(T);
    DingkePicker(boolen)
}

function H(obj){
    T=setTimeout(function () {
		obj.style.display="none",k=null
	},300)
}

function G(a,obj){
    clearTimeout(T)
    var b=0,c=0;
    if(a&&a.getBoundingClientRect()) { 
		var d=window,e=document.body,f=document.documentElement,g=a.getBoundingClientRect(),h=f.clientTop||e.clientTop||0,i=f.clientLeft||e.clientLeft||0,j=d.pageYOffset||e.scrollTop,k=d.pageXOffset||e.scrollLeft;
		b=g.left+k-i-10,c=g.top+j-h-10;
		obj.style.top=(c>0?c:0)+"px";
		obj.style.left=(b>0?b:0)+"px";
		obj.style.display="block";
		var url = "http://"+dAddr+"/user/outPin.aspx?url="+encodeURIComponent(window.location.href)+"&src="+dS(a.src);
		obj.onclick = function(){
			　window.open(url,"name1","width=712,height=360,toolbar=no,scrollbars=no,menubar=no,screenX=100,screenY=100"); 
			　return false;
		}	
	}
}

//var dingkePicker = new DingkePicker(true);
function DingkePicker(boolen){
    if(document.getElementById("closeDingke")!=null)return
    if(window.location.toString().indexOf("800246")>=0){
        var isDefault = document.getElementById("dingkeImagePicker")
        isDefault?document.getElementsByTagName("head")[0].removeChild(isDefault):isDefault /**/
        if(!boolen)
            alert("你就在钉客本站，无需使用此工�?");
        return;
    }
	DingkePicker.limitWidth = 150;
	DingkePicker.boxWidth = 200;
	DingkePicker.boxHeight = 200;
	DingkePicker.top = 0;
	this.url = location.href;
	this.body = document.getElementsByTagName("body")[0];
	this.overlay = document.createElement("div");
	this.container = document.createElement("div");
	this.cancel = document.createElement("a");
	this.validImgSortingArray = new Array();
	this.validImg = new Array();
	this.styleElement = document.createElement("style");
	this.absStep = 0.69314;
	this.staticUrl = dAddr;
	this.stylesheet = ".dingkeContainer , .dingkeOverlay{background-color:white; position:absolute; top:0; left:0; z-index:2147483647; width:100%; opacity:0.95; filter:alpha(opacity=95)} .dingkeContainer{background:none; opacity:1; filter:alpha(opacity:100)} .dingkePickerCancel{z-index:100;color:#333;width:100%;height:30px;text-align:center;font:700 14px/30px '';display:block;position:fixed;top:0;left:0;border-bottom:1px solid #ccc;background:#fff} .dingkePickerCancel:hover{background:#B71A19; color:#fff;} .dingkePickerBlock{width:200px; height:200px; float:left;border:1px solid #CCC;overflow:hidden;border-width:0 1px 1px 0;position:relative; text-align:center;} .dingkePickerBlock img{position:absolute; top:0; left:0; z-index:1;} .dingkePickerBlock .dimension{border-radius: 4px 4px 4px 4px; background:#eee;font:12px arial; margin-top:180px; position:relative; z-index:2; display:inline-block; padding:1px 5px;} .dingkePickerBlock .dingkePickerButton{display:none;color:#14829d;font-size:0px;line-height:0; text-indent:-9999px;cursor:pointer;background:url(http://"+this.staticUrl+"/images/book.gif); position:absolute;height:32px; top:90px; z-index:3; width:114px; border:none;} #dingke{background:#FFFFFF;border:1px solid #EAEAEA;border-radius: 5px 5px 5px 5px;color: #211922;cursor:pointer;display:none;font:12px/14px arial;padding:5px 8px;position:absolute;text-align:center;z-index:2147483647;top:0;left:0}#dingke:hover{background:#B71A19; color:#fff;text-decoration:none}"
	
	var _this = this;
	this.init = function(){
        //if(window.location.toString().indexOf("800246")>=0)return
	    if(!document.getElementById("dingkecss")){
		    var e=document.createElement("style"),d=this.stylesheet;
			e.id="dingkecss",(document.getElementsByTagName("head")[0]||document.body).appendChild(e),e.styleSheet?e.styleSheet.cssText=d:e.appendChild(document.createTextNode(d))
		}
		if(!boolen){
		    this.extend();
		}
	    this.getAllImages();
	    if(this.validImg.length==0){
	        _this.body.removeChild(_this.overlay) , _this.body.removeChild(_this.container)
	        if (document.all){  
                window.detachEvent('scroll',dingkescroll)//IE�?   
            }  
            else{  
                window.removeEventListener('scroll',dingkescroll,false);//firefox   
            } 	
	        alert("未找到合适的图片");
	        return;
	    }
		for(i = 0 ; i < this.validImg.length ;i++){
			this.wrapImage(this.validImg[i]);
		}    
	}
	this.extend = function(){
		this.appendOverlay();
		this.appendClose();
	}
	this.appendClose = function(){
	    this.cancel.id = "closeDingke";
		this.cancel.className = "dingkePickerCancel";
		this.cancel.innerHTML = "关闭";
		this.cancel.href = "javascript:;";		
		this.cancel.onclick = function(){_this.body.removeChild(_this.overlay) , _this.body.removeChild(_this.container);return false}
		this.container.appendChild(this.cancel);
	}
	
	this.appendOverlay = function(){
		var height = document.documentElement.scrollHeight;
		var top = document.documentElement.scrollTop + document.body.scrollTop;
		this.body.appendChild(this.overlay);
		this.body.appendChild(this.container);
		this.overlay.style.height = height+"px";
		this.overlay.className = "dingkeOverlay";
		this.container.style.paddingTop = (top+30)+"px";
		this.container.className = "dingkeContainer";
	}

	this.getAllImages = function(){
	    var _dingke = document.getElementById("dingke")||document.createElement("a");
        _dingke.id = "dingke";
        _dingke.href = "javascript:;";
        _dingke.innerHTML="装订";
        _dingke.onmouseover = function(){G()};
        _dingke.onmouseout = function(){H(_dingke)};
        document.body.appendChild(_dingke);
		var domImages = document.getElementsByTagName("img");
		for(i = 0 ; i < domImages.length ; i++){
			var imgObj = new Image();
			imgObj.src = domImages[i].getAttribute("src");
			if(imgObj.width > DingkePicker.limitWidth){
			    if(!domImages[i].getAttribute("data-dingke")){
			        domImages[i].setAttribute("data-dingke","registered");
		            domImages[i].onmouseover = function(){G(this,_dingke)};
		            domImages[i].onmouseout = function(){H(_dingke)};
		        }
				var absRatioFactor = Math.abs(Math.log(imgObj.height / imgObj.width));
				var tPixel = imgObj.width * imgObj.height;
				this.validImgSortingArray.push([imgObj , absRatioFactor , tPixel]);
			}
		}
		this.sortAllImages();
	}

	this.sortAllImages = function(){
		var validImgArray = new Array();
		for(i = 0; i < this.validImgSortingArray.length ; i++){
			var currentImgObj = this.validImgSortingArray[i];
			var currentRatio = Math.floor(currentImgObj[1] / this.absStep);
			if(typeof(validImgArray[currentRatio]) == "undefined")
				validImgArray[currentRatio] = new Array();
			validImgArray[currentRatio].push([currentImgObj[0] , currentImgObj[2]]);
		}
		
		for(i = 0 ; i< validImgArray.length; i++){
			if(validImgArray[i] instanceof Array)
				validImgArray[i].sort(sortByPixel);
		}
		
		for(i=0; i < validImgArray.length; i++){
			if(validImgArray[i] instanceof Array){
				for(j=0; j<validImgArray[i].length;j++){
					this.validImg.push(validImgArray[i][j][0]);
				}
			}
		}
		
		function sortByPixel(a , b){
			return b[1] - a[1];
		}
	}
	
	this.wrapImage = function(imgObj){
		var html = "";
		if(typeof(imgObj)!="undefined"){
			html = '{"pic_url":'+'"'+imgObj.src+'","title":"\u79cb\u51ac\u65b0\u6b3e\u5973\u88c5\u52a0\u7ed2\u52a0"},'

			var imageWrapper = document.createElement("div");
			imageWrapper.innerHTML = html;
			this.container.appendChild(imageWrapper);
		}
	}
	
	this.setSize = function(imgObj){
		var size = {}
		var ratio = imgObj.width / imgObj.height;
		if(ratio > 1){
			size.width = DingkePicker.boxWidth;
			size.height = imgObj.height * (200 / imgObj.width);
			size.top = (DingkePicker.boxHeight - size.height) / 2;
		}else{
			size.width = imgObj.width * (200 / imgObj.height);
			size.height = DingkePicker.boxHeight;
			size.left = (DingkePicker.boxWidth - size.width) / 2;
		}
		return size;
	}
	
	this.appendImageUtils = function(imageWrapper , imgObj){
		var dimension = document.createElement("span");
		dimension.className = "dimension";
		dimension.innerHTML = imgObj.width + " x " + imgObj.height;
		imageWrapper.appendChild(dimension);
		var pinButton = document.createElement("button");
		pinButton.className = "dingkePickerButton";
		pinButton.innerHTML = "钉客dingke";
		imageWrapper.onmouseover = function(){pinButton.style.display = "inline-block"};
		imageWrapper.onmouseout = function(){pinButton.style.display = "none"};
		imageWrapper.appendChild(pinButton);
		var left = (DingkePicker.boxWidth - 120) / 2;
		pinButton.style.left = left + "px";
		this.bindingPost(imageWrapper , imgObj , pinButton);
	}
	
	this.bindingPost = function(imageWrapper , imgObj , pinButton){
		var url = "http://"+this.staticUrl+"/user/outPin.aspx?url="+encodeURIComponent(this.url)+"&src="+ dS(imgObj.src);
		pinButton.onclick = function(){
			　window.open(url,"name1","width=712,height=360,toolbar=no,scrollbars=no,menubar=no,screenX=100,screenY=100"); 
		}
	}
    if (document.all){  
        window.attachEvent('scroll',dingkescroll)//IE�?   
    }  
    else{  
        window.addEventListener('scroll',dingkescroll,false);//firefox   
    } 	
    this.init();
}
function dingkescroll(){
    clearTimeout(TT);
	TT = setTimeout('dingkeExtend(true)',1000);
}
function dS(s){
    if(s.indexOf("?")>0){
        s = s.substring(0,s.indexOf("?"));
    }
    return s;
}
