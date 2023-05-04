<template>
   <v-app> 
    <v-main class="main">
      <router-view/>
    </v-main>
  </v-app>

</template>

<script >

export default {

name: "App",

components: {
 
},
data() {
  return {};
},
};
</script>
<style lang="scss" scoped>
@import './App.scss'
</style>