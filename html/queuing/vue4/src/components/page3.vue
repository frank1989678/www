<template>
    <div class="page page3">
        <div class="tit">请选择您需要办理的业务类型</div>
        <div class="btn-box">
            <label class="btn-area">
                <router-link to='/page4' tag='a' class="btn btn1"></router-link>
                机动车业务
            </label>
            <label class="btn-area">
                <router-link to='/page5' tag='a' class="btn btn2"></router-link>
                驾驶证业务
            </label>
        </div>

        <div class="footer">
            <router-link tag='a' class="ico ico-home" to='/page1'>首页</router-link>
            <router-link tag='a' class="ico ico-back" to='/page2'>返回</router-link>
            <span class="ico ico-ok disabled">确定</span>
        </div>
    </div>
</template>