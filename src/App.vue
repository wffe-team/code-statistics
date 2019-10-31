<template>
  <div id="app">
    <div class="header">
      <h1>代码统计工具</h1>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header{
  border-bottom: 1px solid #000;
  margin-bottom: 20px;
  margin-top: 60px;
  h1 {
    line-height: 40px;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
