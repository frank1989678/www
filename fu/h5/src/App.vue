<template>
  <div id="app">
    <v-footbar></v-footbar>
    <router-view/>
  </div>
</template>

<script>
import footbar from '@/components/footbar'
export default {
  name: 'App',
  components: {
    'v-footbar': footbar
  },
  data () {
    return {
      
    }
  }
}
</script>

