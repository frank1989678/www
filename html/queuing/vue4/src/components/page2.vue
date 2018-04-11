<template>
    <div class="page page2">
        <div class="tit">请进行现场拍照</div>

        <div class="camera">
            <div class="photo">
                <img v-bind:src="img" v-bind:class="{hide: img===''}" />
            </div>
            <div class="time">{{clock}}</div>
        </div>

        <div class="btn-box">
            <button type="button" class="ubtn ubtn-blue" v-on:click="reset">重拍拍照</button>
            <button type="button" class="ubtn ubtn-blue" v-on:click="camera">拍照</button>
        </div>

        <div class="notice">
            <dl>
                <dt>温馨提示</dt>
                <dd>1.请勿佩戴眼镜、帽子。</dd>
                <dd>2.保持正面人像居中。</dd>
                <dd>3.点击拍照按钮。</dd>
                <dd>4.请在规定时间内完成拍照。</dd>
            </dl>
        </div>

        <div class="footer">
            <router-link to='/' tag='a' class="ico ico-home">首页</router-link>
            <router-link to='/' tag='a' class="ico ico-back">返回</router-link>
            <template v-if="avatar">
                <router-link to='/page3' tag='a' class="ico ico-ok">确定</router-link>
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
                img: '',
                avatar: false,
                clock: 140
            }
        },
        mounted() {
            this.countdown();
        },
        methods: {
            countdown: function() {
                this.timer = setInterval(this.runtime, 1e3);
            },
            runtime: function() {
                if (this.clock > 1) {
                    this.clock -= 1;
                } else {
                    clearInterval(this.timer);
                    this.$router.replace({path:'/'});
                }
            },
            camera: function() {
                this.img = 'static/uploads/1.jpg';
                this.avatar = true;
            },
            reset: function() {
                this.img = '';
                this.avatar = false;
            }
        }
    }
</script>