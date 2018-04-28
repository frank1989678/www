<template>
	<div class="wrapper">
		<div class="header">
			<div class="logo">{{ sysName }}</div>
			<div class="user">
				<el-dropdown trigger="hover">
					<span class="hd">
						<em class="cname">{{surname}}</em> 
						Hi, {{sysUserName}}
						<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item><i class="icon icon-mail"></i>我的消息</el-dropdown-item>
						<el-dropdown-item @click.native="logout"><i class="icon icon-off"></i>退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
		<div class="main">
			<aside class="menu-expanded sidebar">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
			</aside>

			<div class="content-container">
				<el-breadcrumb separator="/" class="breadcrumb">
					<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
						{{ item.name }}
					</el-breadcrumb-item>
				</el-breadcrumb>

				<transition name="fade" mode="out-in">
					<router-view></router-view>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
	import * as api from '@/utils/api';
	import * as lib from '@/utils/lib';
	export default {
		data() {
			return {
				sysName:'王者圈管理后台',
				collapsed:false,
				surname: '',
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				lib.logout();
				// this.$confirm('确认退出吗?', '提示', {
				// 	//type: 'warning'
				// }).then(() => {
				// 	lib.logout();
				// }).catch(err => {
				// 	console.log(err)
				// });
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {
			this.sysUserName = Cookies.get('sysUserName') || '';
			this.surname = (Cookies.get('sysUserName') || '').substring(0, 1);
		}
	}

</script>

<style scoped lang="scss">
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: #20a0ff;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					.cname{
						position: relative;
						display: inline-block;
						background: #7bd59f;
						color: #fff;
						width: 30px;
						height: 30px;
						line-height: 30px;
						margin-right: 10px;
						text-align: center;
						border-radius: 50%;
					}
				}
			}
			.logo {
				height:60px;
				font-size: 22px;
				padding: 0 20px 0 60px;
				border-right: 1px solid #eee;
				background: url('/static/images/logo.png') no-repeat 20px 50%;
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}

</style>