<template>
    <div class="page page4">
        <div class="btn-box one">
            <button type="button" class="ubtn ubtn-blue" v-on:click="chooseBusiness('1')">国产新车</button>
            <button type="button" class="ubtn ubtn-blue" v-on:click="chooseBusiness('2')">进口新车</button>
        </div>
        
        <div class="notice">
            <dl>
                <dt>温馨提示</dt>
                <dd>如果是校车、救护车或工程抢险车请提供上级部门出具的相关证明。</dd>
            </dl>
        </div>

        <div class="footer">
            <router-link tag='a' class="ico ico-home" to='/page1'>首页</router-link>
            <router-link tag='a' class="ico ico-back" to='/page41'>返回</router-link>
            <span class="ico ico-ok disabled">确定</span>
        </div>
    </div>
</template>
<script>
    export default{
        data() {
            return {
            }
        },
        methods: {
            chooseBusiness: function(val) {
                this.$router.replace({path:'/page6'});
            }
        }
    }
</script>