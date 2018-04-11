<template>
    <div class="page page5">
        <div class="tit">您选择办理的是：<em>{{pname}} <i class="arrow"></i> {{name}}</em></div>
        <div class="t2">
            <p>1.请确认以下资料是否已携带，如果已携带请点击“我有”按钮。</p>
            <p>2.未带齐资料，窗口不予受理。</p>
        </div>

        <div class="img">
            <div class="name">身份证明原件及复印件</div>
            <div class="num">{{page}}</div>
            <div class="thumb">
                <template v-for="(img,index) in list">
                    <img v-bind:src="img.src" v-bind:alt="img.alt" v-show="index === current" />
                </template>
            </div>
        </div>
        <div class="btn-box">
            <button type="button" class="ubtn ubtn-blue" v-on:click="back">我没有</button>
            <button type="button" class="ubtn ubtn-blue" v-on:click="next">我有</button>
        </div>

        <div class="footer">
            <router-link tag='a' class="ico ico-home" to='/page1'>首页</router-link>
            <router-link tag='a' class="ico ico-back" to='/page4'>返回</router-link>
            <template v-if="isComplete">
                <span class="ico ico-ok" v-on:click="linkto">确定</span>
            </template>
            <template v-else>
                <span class="ico ico-ok disabled">确定</span>
            </template>
        </div>
    </div>
</template>
<script>
    export default{
        data() {
            return {
                isComplete: false,
                page: '',
                current: 0,
                list: [],
                name: this.$route.params['name'],
                pname: this.$route.params['pname']
            }
        },
        mounted() {
            this.getInfo()
        },
        methods: {
            getInfo: function() {
                var that = this;
                var params = {
                    name: that.$route.params['name'],
                    pname: that.$route.params['pname'],
                    id: that.$route.params['id'],
                    pid: that.$route.params['pid']
                }
                that.params = params;
                that.$axios.get('/api/pic', params)
                  .then(function (res) {
                    if (res.data.success === true) {
                        that.list = res.data.data;
                        that.count = that.list.length;
                        that.idx = 1;
                        that.pagin();
                    }
                  })
                  .catch(function (res) {
                  });
            },
            pagin: function() {
                var that = this;
                that.page = that.idx + '/' + that.count;
            },
            next: function() {
                var that = this;
                if (that.idx < that.count) {
                    that.idx ++;
                    that.current ++;
                    that.pagin();
                } else {
                    that.isComplete = true;
                }

            },
            linkto: function() {
                var that = this;
                that.$router.push({
                    name: 'page7',
                    params: that.params
                })
            },
            back: function() {
                this.$router.replace({path:'/page9'});
            }
        }
    }
</script>