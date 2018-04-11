<template>
    <div class="page page1">
        <div class="t1"><span class="time">{{datetime}}</span>欢迎光临车管所</div>
        <div class="t2">自助取号，请刷二代身份证</div>
        <div class="card">
            <span class="gif"><img src="static/images/card.gif" width="344" height="308" /></span>
            <span class="tips">身份证阅读器在终端机下方右侧</span>
        </div>

        <div class="footer">
            <span class="ico ico-home">首页</span>
            <span class="ico ico-back">返回</span>
            <template v-if="isComplete">
                <router-link to='/page2' tag='a' class="ico ico-ok">确定</router-link>
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
                datetime: ''
            }
        },
        mounted() {
            this.showTime();
            setTimeout(this.readCard, 2e3);
        },
        methods: {
            getDateTime: function() {
                var t = new Date;
                var yyyy = t.getFullYear();
                var MM = t.getMonth() + 1;
                var dd = t.getDate();
                var hh = t.getHours();
                var mm = t.getMinutes();
                var ss = t.getSeconds();
                this.datetime = ([yyyy, '年', MM, '月', dd, '日', hh, ':', mm, ':', ss]).map(function(n) {
                    return n < 10 ? '0' + n : n
                }).join('');
            },
            showTime: function() {
                this.getDateTime();
                setInterval(this.getDateTime, 1e3);
            },
            readCard: function() {
                this.isComplete = true;
            }
        }
    }
</script>