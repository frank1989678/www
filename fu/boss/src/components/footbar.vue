<template>
	<footer class="footer">
		<router-link to="/setting">接单设置</router-link>
		<router-link to="/integrity">陪玩认证</router-link>
		<router-link to="/order">陪玩订单</router-link>
	</footer>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	computed: {
		isShowTabbar () {
			let routeLength = this.$route.path.split('/').length
			return routeLength > 2 ? false : true
		}
	}
}
</script>

<style scoped lang="scss">
.footer{
	position:fixed;
	left:0;
	bottom:0;
	right:0;
	height: 40px;
	line-height:40px;
	text-align:center;
	a{float:left;width:33.333%;}
}
</style>