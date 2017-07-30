<template>
  <div id="app">
    <motion></motion>
  </div>
</template>

<script>
import Motion from './components/Motion'

export default {
  name: 'app',
  components: {
    Motion,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
