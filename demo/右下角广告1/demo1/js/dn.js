function Dn(id){
	var obj = $("#div_dn ."+id)
	if(id=="hide"){
		$("#div_dn").slideUp(200);
		addCookie('51app_dn','hide',12);
		return;
	}else if(id=="minimize"){
		$("#div_dn").show();
		$("#div_dn .dmt_zm_mod").nextAll().slideUp(200);
		obj.hide().next().show();
		addCookie('51app_dn','minimize',12);
	}else{
		$("#div_dn").show();
		$("#div_dn .dmt_zm_mod").nextAll().slideDown(200);
		obj.hide().prev().show();
		addCookie('51app_dn','maximize',12);
	}	
}

function addCookie(objName,objValue,objHours){
	var str = objName + "=" + escape(objValue);
	if(objHours > 0){
		var date = new Date();
		var ms = objHours*3600*1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
	}
	document.cookie = str;
}

function getCookie(objName){
	var arrStr = document.cookie.split("; ");
	for(var i = 0;i < arrStr.length;i ++){
		var temp = arrStr[i].split("=");
		if(temp[0] == objName) return unescape(temp[1]);
	} 
}

$(function(){
	var isShowDn = getCookie('51app_dn');
	if(isShowDn == undefined){
		addCookie('51app_dn','maximize',12);
		isShowDn = 'maximize';
	}

	if(isShowDn=='hide') return;
	setTimeout(function()
	{
		if(isShowDn=='maximize'){
			$('#div_dn').slideDown(200);
		}else{
			$("#div_dn .dmt_zm_mod").nextAll().hide().parent().slideDown(100);
			$("#div_dn .minimize").hide().next().show();
		}
	},1000); 
})