<template>
  <div class="statistics">
    <!-- <Statistics /> -->
    <div class="form">
      <div class="form-item">
        <label>文件夹路径:</label>
        <input type="text" name="path" v-model="form.path">
        <span class="button margin-l-20" @click="getFolder()">选择</span>
      </div>
      <div class="form-item">
        <label>要忽略哪些类型文件:</label>
        <input type="text" name="format" v-model="form.format">
      </div>
      <div class="form-item">
        <label>要忽略哪些文件:</label>
        <input type="text" name="file" v-model="form.file">
      </div>
      <div class="form-item">
        <label>要忽略哪些文件夹:</label>
        <input type="text" name="folder" v-model="form.folder">
      </div>
      <div class="form-item">
        <label>是否统计注释代码:</label>
        <input type="checkbox" style="vertical-align: middle;" name="isNotes" v-model="form.isNotes">
      </div>
    </div>
    <span class="button" @click="startStatistics()">开始统计</span>
    <div class="statisticsResult">
      统计结果： {{lineNum}} 行
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
// import Statistics from '@/components/Statistics.vue';
import Vue from 'vue';
import {ipcRenderer} from 'electron';

export default Vue.extend({
  name: 'statistics',
  data() {
    return {
      form: {
        path: '',
        format: '',
        file: '',
        folder: '',
        isNotes: true
      },
      lineNum: 0
    };
  },
  methods: {
    // 选择文件夹
    getFolder() {
      ipcRenderer.send('openDialog');
    },
    // 开始统计
    startStatistics() {
      ipcRenderer.send('startStatistics', JSON.stringify(this.form));
    }
  },
  mounted() {
    ipcRenderer.on('selectedFolder', (event, arg: string) => {
      console.log(arg);
      this.form.path = arg;
    });
    ipcRenderer.on('formError', (event, arg: string) => {
      alert(arg);
    });
    ipcRenderer.on('countResult', (event, arg: string) => {
      this.lineNum = Number(arg);
    });
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.margin-l-20{
  margin-left: 20px;
}
.statisticsResult{
  text-align: left;
  margin-top: 40px;
  margin-left: 60px;
}
.button{
  display: inline-block;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #13ce66;
  border-color: #13ce66;
  cursor: pointer;
  &:hover {
    background: #42d885;
    border-color: #42d885;
    color: #fff;
  }
}
.form{
  width: 600px;
  margin: 0 auto;
  .form-item {
    text-align: left;
    margin: 20px;
    input{
      height: 32px;
    }
    label{
      display: inline-block;
      width: 150px;
      text-align: right;
      margin-right: 10px;
    }
  }
}
</style>

