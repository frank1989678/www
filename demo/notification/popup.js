
$(document).ready(function() {
	$('input').on('click', function() {
		showNotification({
			title: '通知',
			content: 'frank 回复了任务 新任务',
			replaceId: (new Date).getTime()
		})
	})
});


// Notification.requestPermission(function(status){  //status值有三种：default/granted/denied
//   if(Notification.permission !== status){
//     Notification.permission = status;
//   }
// });

// Notification.permission = 'default';

function showNotification(options) {
	if (!window.Notification || !options) {
		return;
	}
	Notification.requestPermission(function() {}); // 获取权限

	var defaults = {
		body: options.content || '',
		icon: options.icon || 'https://tower.im/assets/icon-tower-474bc4b10ace7535e103a70cc2f10f0a.png',
		tag: options.replaceId || (new Date).getTime()
	}
	var t = new Notification(options.title || '通知', defaults);

	t.onshow = function(){
		$("#notification-audio")[0].play();
	}
	t.onclick = function(){}
	t.onclose = function(){}
	t.onerror = function(){}

	setTimeout(function() {
		t.close();
	}, options.delay || 5e3);
	return t;
}

var subpub = {};
(function( subpub ){
    var list = {};
    subpub.publish = function(topic,msg){
        for(var i = 0; i<list[topic].length; i++) {
            list[topic][i](msg);
        }
    }
    subpub.subscribe = function( topic,listener){
        if(!list[topic]) list[topic] = [];
        list[topic].push(listener);
    }
})( subpub )

function Order( goods ){
    this.goods = goods;
}
Order.prototype = {
    done: function(){
        this.sendSuccessMsg();
    },
    sendSuccessMsg: function(){
        subpub.publish('order/done',this.goods);
    }
}
function Message(){
    subpub.subscribe('order/done',this.sendMsg);
}
Message.prototype = {
    sendMsg: function( goods ){
    	showNotification(goods);
    }
    //其它信息模块的方法
}
var message = new Message();
var order = new Order({ title:"索尼耳机", content:100, tag: (new Date).getTime()});

setInterval(function() {
	// order.done() //弹出商品的信息
}, 7e23)