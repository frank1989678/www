<template>
<div class="setting">
	<div class="info">
		<dl>
			<dt>
				<strong>{{score}}</strong>分
				<sub>综合评分</sub>
			</dt>
			<dd>
				<strong>{{count}}</strong>单
				<sub>本周成功订单</sub>
			</dd>
			<dd>
				<strong>{{income}}</strong>元
				<sub>本周收入</sub>
			</dd>
		</dl>
	</div>
	<div class="button">
		<mt-button type="primary" size="large" @click="onAddOrderSet">新增接单方式</mt-button>
	</div>

	<mt-cell v-for="item of gameList" :title="item.val">
		<mt-switch v-model="form[item.key]" @change="onSwitchGame"></mt-switch>
	</mt-cell>

	<mt-cell title="价格：" is-link>
		<em>{{form.price}}</em>
	</mt-cell>
	<mt-cell title="单位：" is-link>
		<em>{{form.unitVal}}</em>
	</mt-cell>

	<div class="button">
		<mt-button type="primary" size="large" @click="onStartReceiving">开始接单</mt-button>
	</div>
</div>
</template>

<script>

export default {
	data() {
		return {
			form: {},
			score: '',
			count: '',
			income: '',
			price: '',
			unit: '',
			gameList: [
				{'val': '绝地求生', 'key': '1', 'checked': '0'},
				{'val': '王者荣耀', 'key': '2', 'checked': '1'}
			]
		}
	},
	created() {
		// created是数据初始化的过程
		this._getData();
	},
	methods: {
		// 获取用户的评分、订单、收入数据
		_getData: function() {
			axios.get('./static/json/setting.json')
			  .then(res => {
			  	this.score = res.data.score;
			  	this.count = res.data.count;
			  	this.income = res.data.income;
			  })
			  .catch(err => {
			  	console.log(err)
			  });
		},

		// 新增接单方式
		onAddOrderSet: function() {
			this.$router.push('/OrderSet');
		},

		// 游戏开关
		onSwitchGame: function(a,b,c) {
			console.log(a)
		},

		// 开始接单
		onStartReceiving: function() {}


	}
}
</script>

<style lang="scss">
.button{padding:10px 0;}
</style>
