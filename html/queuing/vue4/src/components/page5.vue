<template>
    <div class="page page4">
        <div class="tit">请选择您需要办理的业务名称</div>
        <div class="btn-box one">
            <button type="button" class="ubtn ubtn-blue">军警（换证）</button>
            <button type="button" class="ubtn ubtn-blue">境外（换证）</button>
        </div>
        
        <div class="notice">
            <dl>
                <dt>温馨提示</dt>
                <dd>以上业务无需取号，请直接到二楼直通车办理。</dd>
            </dl>
        </div>

        <div class="footer">
            <router-link tag='a' class="ico ico-home" to='/page1'>首页</router-link>
            <router-link tag='a' class="ico ico-back" to='/page3'>返回</router-link>
            <span class="ico ico-ok disabled">确定</span>
        </div>
    </div>
</template>