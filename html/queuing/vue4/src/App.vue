<template>
  <div>
    <h1>{{msg}}</h1>
    <ul>
      <router-link to='/page1' tag='li'><a href="/page1">Index</a></router-link>
      <router-link to='/page2' tag='li'><a href="/page2">Hello</a></router-link>
    </ul>
  </div>
</template>
<script>
    export default{
        data(){
            return {
                msg:"Welcome to Your Vue.js app"
            }
        }
    }
</script>
<style>
  div{text-align:center;}
  ul{font-size:18px}
  li{display:inline-block;}
</style>