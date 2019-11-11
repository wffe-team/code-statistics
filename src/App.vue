<template>
  <div id="app">
  <!-- <div class="header">
    万方前端工具
  </div> -->
    <div class="container">
      <div class="aside">
        <el-menu
          :default-active="menuIndex"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          @select="handleSelect"
          style="width: 160px; text-align: left;"
          active-text-color="#ffd04b">
          <el-menu-item index="statistics">
            <i class="el-icon-s-data"></i>
            <span slot="title">代码行数统计</span>
          </el-menu-item>
          <el-menu-item index="networkProxy">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">请求代理</span>
          </el-menu-item>
          <el-menu-item index="FEPublish">
            <i class="el-icon-lightning"></i>
            <span slot="title">前端发布</span>
          </el-menu-item>
          <el-menu-item index="fileCompare">
            <i class="el-icon-search"></i>
            <span slot="title">文件对比</span>
          </el-menu-item>
          <el-menu-item index="fastRun">
            <i class="el-icon-cpu"></i>
            <span slot="title">本地运行</span>
          </el-menu-item>
          <el-menu-item index="screenCap">
            <i class="el-icon-video-camera-solid"></i>
            <span slot="title">录屏</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="main">
        <router-view/>
      </div>        
    </div>
    <!-- <div class="header">
      <h1>代码统计工具2</h1>
    </div>
    <router-view/> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'app',
  data() {
    return {
      isCollapse: false,
      menuIndex: 'statistics'
    };
  },
  methods: {
    // 菜单导航
    handleSelect(url: any): void {
      this.$router.push({
        path: '/' + url
      });
    }
  },
  mounted() {
    console.log('app');
  }
});
</script>

<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.container {
  height: 100%;
  display:flex;
  .aside{
    background-color: rgb(84, 92, 100);
  }
  .main{
    padding: 40px;
  }
}
.header{
  flex:1;
  height: 80px;
  line-height: 80px;
  font-size: 32px;
}
.main {
  flex:1;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
// .header{
//   border-bottom: 1px solid #000;
//   margin-bottom: 20px;
//   margin-top: 60px;
//   h1 {
//     line-height: 40px;
//   }
// }

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
