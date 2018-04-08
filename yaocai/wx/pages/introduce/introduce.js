Page({
    data: {
        pages: 10
    },
    onLoad: function() {
    },
    onShareAppMessage: function() {
    	return {
    		title: '原来亳州的那些大户都来这里采购药材......',
            path: '/page/introduce/introduce'
    	}
    }
})
