<template>
    <div class="page page4">
        <template v-if="level1">
        <div class="tit">请选择您需要办理的业务名称</div>

        <div class="btn-box">
            <template v-for="item of list">
                <button type="button" class="ubtn ubtn-blue" v-bind:pname="item.name" v-bind:pid="item.key" v-on:click="chooseBusiness">{{item.name}}</button>
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
                <button type="button" class="ubtn ubtn-blue" v-bind:name="item.name" v-bind:id="item.key" v-on:click="chooseSon">{{item.name}}</button>
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
                var that = this;
                that.list = [];
                that.$axios.get('/api/list')
                  .then(function (res) {
                    if (res.data.success === true) {
                        that.list = res.data.data;
                    }
                  })
                  .catch(function (res) {
                  });
            },
            getSon: function() {
                var that = this;
                that.sonList = [];
                that.$axios.get('/api/data', {pId: that.pid})
                  .then(function (res) {
                    if (res.data.success === true) {
                        that.sonList = res.data.data;
                    }
                  })
                  .catch(function (res) {
                  });
            },
            chooseBusiness: function(event) {
                this.pid = event.target.getAttribute('pid');
                this.pname = event.target.getAttribute('pname');
                this.level1 = false;
                this.getSon();
            },
            chooseSon: function() {
                var that = this;
                var id = event.target.getAttribute('id');
                var name = event.target.getAttribute('name');
                this.$router.push({
                    name: 'page6',
                    params: {
                        'id': id,
                        'name': name,
                        'pid': that.pid,
                        'pname': that.pname
                    }
                })
            },
            reset: function() {
                this.level1 = true;
            }
        }
    }
</script>