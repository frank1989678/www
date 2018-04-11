<template>
    <div class="page page4">
        <div class="tit">请选择您需要办理的业务名称</div>

        <template v-if="level1">
        <div class="btn-box">
            <template v-for="item of list">
                <button type="button" class="ubtn ubtn-blue" v-bind:val="item.key" v-on:click="chooseBusiness">{{item.name}}</button>
            </template>
        </div>


        <div class="notice">
            <dl>
                <dt>温馨提示</dt>
                <dd>1.个人业务：非直系亲属不能代办，若为直系亲属应提供证明如户口本、结婚证等。</dd>
                <dd>2.单位业务：需提供委托书（盖公章）和受托人身份证明原件及复印件。</dd>
            </dl>
        </div>
        </template>

        <template v-else>
        <div class="btn-box">
            <template v-for="item of sonList">
                <button type="button" class="ubtn ubtn-blue" v-bind:val="item.key" v-on:click="chooseSon">{{item.name}}</button>
            </template>
        </div>

        <div class="notice">
            <dl>
                <dt>温馨提示</dt>
                <dd>如果是校车、救护车或工程抢险车请提供上级部门出具的相关证明。</dd>
            </dl>
        </div>
        </template>

        <div class="footer">
            <router-link tag='a' class="ico ico-home" to='/page1'>首页</router-link>

            <template v-if="level1">
                <router-link tag='a' class="ico ico-back" to='/page3'>返回</router-link>
            </template>
            <template v-else>
            <span class="ico ico-back" v-on:click="reset">返回</span>
            </template>
            
            <span class="ico ico-ok disabled">确定</span>
        </div>
    </div>
</template>
<script>
    export default{
        data() {
            return {
                list: [],
                sonList: [],
                level1: true
            }
        },
        mounted() {
            this.getBusiness();
        },
        methods: {
            getBusiness: function() {
                var list = [{
                    "name": "新车上牌",
                    "key": "1",
                    "son": [{
                        "name": "国产新车",
                        "key": "11"
                    },{
                        "name": "进口新车",
                        "key": "12"
                    }]
                },{
                    "name": "新车上牌",
                    "key": "2"
                },{
                    "name": "临时号牌",
                    "key": "3"
                },{
                    "name": "补牌补证",
                    "key": "4"
                },{
                    "name": "车辆转出/转入",
                    "key": "5"
                },{
                    "name": "车辆信息档案更正",
                    "key": "6"
                },{
                    "name": "车辆年审",
                    "key": "7"
                },{
                    "name": "车辆注销",
                    "key": "8"
                },{
                    "name": "辖区内转移登记",
                    "key": "9"
                }]
                this.list = list;
            },
            chooseBusiness: function(event) {
                var val = event.target.getAttribute('val');
                this.level1 = false;
                for (let i = 0; i < this.list.length; i++) {
                    console.log(this.list[i].key)
                    if (this.list[i].key === val) {
                        this.sonList = this.list[i].son
                        break;
                    }
                }
            },
            chooseSon: function() {
                this.$router.replace({path:'/page6'});
            },
            reset: function() {
                this.level1 = true;
            }
        }
    }
</script>