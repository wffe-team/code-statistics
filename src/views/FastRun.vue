<template>
  <div class="fastRun">
    <el-button type="primary" @click="importProject()" style="margin: 40px 0 60px 0;" round>导入本地项目</el-button>
    <el-table :data="projectList" :border="true" v-loading="listLoading" scope="scope" style="width: 100%;">
      <el-table-column property="projectName" label="项目名称" header-align="center"></el-table-column>
      <el-table-column property="projectPath" label="项目路径" align="center" header-align="center"></el-table-column>
      <el-table-column property="" label="pid" align="center" header-align="center">
        <template slot-scope="scope">
          <div>
            {{scope.row.pid?scope.row.pid:'-'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column property="state" label="状态" align="center" header-align="center">
        <template slot-scope="scope">
          <div>
            {{stateFormat(scope.row.state)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column property="" label="操作" width="170" align="center" header-align="center">
        <template slot-scope="scope">
          <div>
            <el-button type="text">删除</el-button>
            <el-button @click="runServer(scope.row.projectPath)" type="text">运行</el-button>
            <el-button type="text">打包</el-button>
            <el-button @click="stopLocalProject(scope.row.pid)" type="text">停止</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" title="导入本地项目" :visible.sync="isShowPopup" style="text-align: left;" width="800px">
      <div class="height-500 over-a">
        <el-form :model="localProjectForm" :rules="rules" ref="localProjectForm">
          <el-form-item label="项目名称" prop="projectName" label-width="100px">
            <el-input style="width:300px;" v-model.trim="localProjectForm.projectName" autocomplete="off" placeholder="请输入项目名称"></el-input>
          </el-form-item>
          <el-form-item label="项目路径" prop="projectPath" label-width="100px">
            <el-input style="width:300px;" v-model.trim="localProjectForm.projectPath" autocomplete="off" placeholder="请输入项目路径"></el-input>
            <el-button type="primary" style="margin-left: 20px;" @click="importPath()">导入</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button type="primary" @click="createProject('createTaskForm')" plain>确 定</el-button>
          <el-button @click="changeShowDialog(false)">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
// import Statistics from '@/components/Statistics.vue';
import Vue from 'vue';
import {ipcRenderer} from 'electron';
import {Table, TableColumn, Form, FormItem} from 'element-ui';

export default Vue.extend({
  name: 'fastRun',
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-form': Form,
    'el-form-item': FormItem
  },
  data() {
    return {
      projectList: [],
      listLoading: false,
      isShowPopup: false,
      $refs: {
        localProjectForm: Form
      },
      localProjectForm: {
        projectName: '',
        projectPath: ''
      },
      rules: {
        projectName: [{
          required: true,
          validator: async (rule: any, value: any, callback: any) => {
            if (value === '') {
              callback(new Error('请输入项目名称'));
              return false;
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }],
        projectPath: [{
          required: true,
          validator: async (rule: any, value: any, callback: any) => {
            if (value === '') {
              callback(new Error('请输入项目路径'));
              return false;
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }]
      }
    };
  },
  methods: {
    // 选择路径
    importPath() {
      ipcRenderer.send('openDialog');
    },
    // 导入本地项目
    importProject() {
      this.isShowPopup = true;
    },
    // 状态格式化
    stateFormat(state: string) {
      let stateName = '';
      switch (state) {
        case 'running':
          stateName = '正在运行';
          break;
        case 'sleeping':
          stateName = '等待运行';
          break;
        case 'waiting':
          stateName = '启动中';
          break;
        default:
          stateName = '等待运行';
      }
      return stateName;
    },
    // 修改弹窗状态
    changeShowDialog(mark: boolean) {
      this.isShowPopup = mark;
    },
    // 添加本地项目
    createProject() {
      (this.$refs.localProjectForm as any).validate((valid: any) => {
        if (valid) {
          ipcRenderer.send('writeLocalProject', JSON.stringify(this.localProjectForm));
          this.changeShowDialog(false);
        }
      });
    },
    // 本地运行
    runServer(path: string) {
      ipcRenderer.send('runServer', path);
    },
    // 停止本地运行
    stopLocalProject(pid: any) {
      ipcRenderer.send('stopLocalProject', pid);
    }
  },
  mounted() {
    ipcRenderer.send('readLocalProject');
    ipcRenderer.on('localProject', (event, project: string) => {
      console.log(project);
      this.projectList = JSON.parse(project).project;
      console.log(this.projectList);
    });
    ipcRenderer.on('selectedFolder', (event, arg: string) => {
      console.log(arg);
      this.localProjectForm.projectPath = arg;
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
</style>

