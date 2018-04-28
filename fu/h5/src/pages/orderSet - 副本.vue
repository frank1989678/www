<template>
	<div class="setting">
		
		<div class="form">
			<mt-cell title="游戏：" is-link>
				<em>{{form.gameVal}}</em>
				<i class="trigger" v-on:click="onTogglePicker('game', 1)"></i>
			</mt-cell>
			<mt-cell title="价格：" is-link>
				<em>{{form.price}}</em>
				<i class="trigger" v-on:click="onOpenPciceDialog"></i>
			</mt-cell>
			<mt-cell title="单位：" is-link>
				<em>{{form.unit}}</em>
				<i class="trigger" v-on:click="onTogglePicker('unit', 1)"></i>
			</mt-cell>
		</div>
	
		<!-- 选择游戏 -->
		<mt-popup v-model="gamePickerHide" position="bottom" class="mint-popup-4">
          <div class="picker-toolbar">
            <button type="button" class="mint-datetime-action mint-datetime-cancel" v-on:click="onTogglePicker('game', 0)">取消</button>
            <button type="button" class="mint-datetime-action mint-datetime-confirm" v-on:click="onChooseData('game')">确定</button>
          </div>
		  <mt-picker :slots="gamePickerList" :valueKey="valueKey" :visibleItemCount="3" v-on:change="onPickerGameData()"></mt-picker>
        </mt-popup>
		<!-- 选择单位 -->
		<mt-popup v-model="unitPickerHide" position="bottom" class="mint-popup-4">
          <div class="picker-toolbar">
            <button type="button" class="mint-datetime-action mint-datetime-cancel" v-on:click="onTogglePicker('unit', 0)">取消</button>
            <button type="button" class="mint-datetime-action mint-datetime-confirm" v-on:click="onChooseData('unit')">确定</button>
          </div>
		  <mt-picker :slots="unitPickerList" :valueKey="valueKey" :visibleItemCount="3" v-on:change="onPickerUnitData()"></mt-picker>
        </mt-popup>
	</div>
</template>

<script>
import { MessageBox } from 'mint-ui';
export default{
	data() {
		return {
			form: {},
			valueKey: 'val', // picker的显示字段key

			gamePickerData: {}, // 选择游戏数据
			gamePickerHide: false,
			gamePickerList: [{
				values:[], 
				defaultIndex: 2
			}],
			unitPickerHide: false,
			unitPickerList: [{
				values:[], 
				defaultIndex: 2
			}]
		}
	},
	created() {
		// created是数据初始化的过程
		// this.getUserData();
	},
	methods: {
		// 获取用户的评分、订单、收入数据
		getUserData: function() {
			axios.get('./static/json/orderset.json')
			  .then(res => {
			  	this.gamePickerList[0].values = res.data.games;
			  	this.unitPickerList[0].values = res.data.units;
			  })
			  .catch(err => {
			  	console.log(err)
			  });
		},

		// 选择游戏，未确认
		onPickerGameData: function(picker, values) {
			console.log(values)
			// this.gamePickerData = values[0];
	    },
		// 选择单位，未确认
		onPickerUnitData: function(picker, values) {
			// this.unitPickerData = values[0];
	    },

	    // 确认选择picker选项，保存数据
	    onChooseData: function(name) {
	    	// this.form.gameVal = this.gamePickerData.val;
	    	this.form[name + 'Val'] = this[name + 'PickerData'].val;
	    	this.form[name + 'Key'] = this[name + 'PickerData'].key;
	    	this.onTogglePicker(name, 0);
	    },

	    // 打开或关闭picker
	    onTogglePicker: function(name, show) {
	    	this[name + 'PickerHide'] = show === 1;
	    	// this.gamePickerHide = true;
	    },
	    // 关闭picker
	    onClosePicker: function(name) {
	    	this[name + 'PickerHide'] = false;
	    	// this.gamePickerHide = false;
	    },

	    // 打开价格输入层
	    onOpenPciceDialog: function() {
	    	const that = this;
	    	MessageBox.prompt('价格', '', {inputType: 'number', inputPlaceholder: '请输入价格'})
	    	.then(po => {
	    		that.form.price = po.value;
	    	})
	    	console.log(that.form)
	    },
	    // 关闭价格输入层
	    onClosePciceDialog: function() {
	    	this.gamePickerHide = false;
	    }
	}
}
</script>

<style>
	
.mint-popup-4 {
    width: 100%;
}
.mint-popup-4 .picker-slot-wrapper, .page-popup .mint-popup-4 .picker-item {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}
.picker-toolbar{overflow:hidden;}

.form .trigger{position:absolute;top:0;left:0;right:0;bottom:0;text-align:right;}
</style>