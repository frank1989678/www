<!-- <template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template> -->

<template>
  <div>
    ![](./assets/logo.png)
    <h1>{{msg}}</h1>
    <ul>
      <router-link to="/index" tag="li"><a href="/index">Index</a></router-link>
      <router-link to="/hello" tag="li"><a href="/hello">Hello</a></router-link>
    </ul>
  </div>
</template>
