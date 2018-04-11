<template>
    <div class="page page7">
        <div class="tit">取号成功，请领取叫号单</div>
        <div class="cont">
            <p class="address">{{windows}}</p>
            <p>办理业务：{{name}}</p>
            <p>等待人数：{{waitNumber}}</p>
        </div>
        <div class="tips">
            取号单在终端机下方左侧凭条出口处
        </div>

        <div class="footer">
            <router-link tag='a' class="ico ico-home" to='/page1'>首页</router-link>
            <router-link tag='a' class="ico ico-back" to='/page1'>返回</router-link>
            <span class="ico ico-ok disabled">确定</span>
        </div>
    </div>
</template>
<script>
    export default{
        data() {
            return {
                windows: '',
                name: '',
                waitNumber: ''
            }
        },
        mounted() {
            this.getInfo();
        },
        methods: {
            getInfo: function() {
                var that = this;
                var params = {
                    id: that.$route.params['id'],
                    pid: that.$route.params['pid'],
                    name: that.$route.params['name'],
                    pname: that.$route.params['pname']
                }
                that.$axios.get('/api/ticket', params)
                  .then(function (res) {
                    if (res.data.success === true) {
                        that.windows = res.data.data.windows;
                        that.name = res.data.data.name;
                        that.waitNumber = res.data.data.waitNumber;
                    }
                  })
                  .catch(function (res) {
                  });
            }
        }
    }
</script>