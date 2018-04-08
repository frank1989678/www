
//alert(KEY.TXT.length)
keys = [
	{0:"boluo",1:"菠萝"},
	{0:"ganju",1:"柑桔"},
	{0:"hongsheguo",1:"红蛇果"},
	{0:"hongti",1:"红提"},
	{0:"huolongguo",1:"火龙果"},
	{0:"lanmei",1:"蓝莓"},
	{0:"li",1:"梨"},
	{0:"lihe",1:"礼盒"},
	{0:"liulian",1:"榴莲"},
	{0:"longyan",1:"龙眼"},
	{0:"mangguo",1:"芒果"},
	{0:"mihoutao",1:"猕猴桃"},
	{0:"mugua",1:"木瓜"},
	{0:"ningmeng",1:"柠檬"},
	{0:"pingguo",1:"苹果"},
	{0:"putao",1:"葡萄"},
	{0:"qiyiguo",1:"奇异果"},
	{0:"shanzu",1:"山竹"},
	{0:"shengnvguo",1:"圣女果"},
	{0:"shiliu",1:"石榴"},
	{0:"taozi",1:"桃子"},
	{0:"xiangjiao",1:"香蕉"},
	{0:"youzi",1:"柚子"},
	{0:"yezi",1:"椰子"},
	{0:"yingtao",1:"樱桃"},
]


function nextResult(n){
    var list = $("#allCitySelect ul li");
    var r = false;
    for(var i=0;i<list.length;i++){
        if(r==false&&list.eq(i).hasClass("keyover")){
            if(i!=list.length-1){
                list.eq(i).removeClass("keyover");
                list.eq(i+1).addClass("keyover");
                r = true;
            }else{
                list.eq(i).removeClass("keyover");
                list.eq(0).addClass("keyover");
            }
        }
    }
}

function prevResult() {
    var list = $("#allCitySelect ul li");
    var r = false;
    for(var i=0;i<list.length;i++){
        if(r==false&&list.eq(i).hasClass("keyover")){
            if(i!=0){
                list.eq(i).removeClass("keyover");
                list.eq(i-1).addClass("keyover");
                r = true;
            }else{
                list.eq(0).removeClass("keyover");
                list.eq(list.length-1).addClass("keyover");
            }
        }
    }
}


