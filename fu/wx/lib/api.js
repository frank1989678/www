module.exports = {
	// 登录
	// LOGIN: '/api/v1/user/mobile/bind',
	LOGIN: '/test/login', // 临时测试接口
	SMS: '/api/v1/user/mobile/sms',

	// c端==========================================================================
	// 全部游戏分类接口
	category: '/api/v1/category/all',
	// 分页游戏分类接口
	catList: '/api/v1/category/list',

	// 游戏分类下商品列表接口
	catGames: '/api/v1/category/product/list',

	CENTER: '/api/v1/user/get',
	UPDATEINFO: '/api/v1/user/update',


	// b端==========================================================================
	// 陪玩师接口列表
	b: {
		// 查零钱
		getBalance: '/api/v1/user/balance/get'

		// 零钱明细
		,moneyList: '/api/v1/moneyDetails/list'

		// 取现
		,getBackMoney: 'api/v1/cashDraws/save'


		// 2、查询游戏所有销售方式
		,getSalesmode: '/api/v1/category/salesmode/list'

		// 1、陪玩师技能列表
		,getProduct: '/api/v1/user/tech/list'

		// 1、添加商品(接单方式)
		,addProduct: '/api/v1/product/order-receive/create'

		// 2、用户所有商品(接单方式)列表
		,getActiveList: '/api/v1/product/order-receive/list'

		// 3、修改用户商品(接单方式)
		,updateProduct: '/api/v1/product/order-receive/update'

		// 4、商品(接单方式)激活或关闭
		,activeProduct: '/api/v1/product/order-receive/enable'

		// 5、开始接单
		,start: '/api/v1/product/order-receive/start'

		// 6、停止接单
		,stop: '/api/v1/product/order-receive/stop' 

		// 7、用户收入评分和单数信息接口,
		,weekInfo: '/api/v1/product/order-receive/info'

		// 开始接单剩余时间
		,getSeconds: '/api/v1/product/order-receive/status'

		// 用户订单============
		// 1.查询陪玩师是否是服务状态
		,a6: '/api/v1/order/canservice'
		// 2.提交订单
		,a5: '/api/v1/order/submit'
		// 3、用户订单状态列表
		,orderStatus: '/api/v1/order/user/status'

		// 4、用户订单列表
		,getUserOrder: '/api/v1/order/user/list'
		// 5、用户取消订单
		,a1: '/api/v1/order/user/cancel'

		// 6、用户申诉订单
		,a2: '/api/v1/order/user/appeal'

		// 7、用户验收订单
		,a3: '/api/v1/order/user/verify'

		// 8、用户支付订单(测试用)
		,a4: '/api/v1/order/test/pay'

	}
}
