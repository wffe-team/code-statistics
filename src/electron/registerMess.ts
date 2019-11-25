import { dialog, ipcMain } from 'electron';
import codeStatistics from './codeStatistics';
import fastRun from './fastRun';

function init(mainWindow: any) {
  /*
  代码统计相关消息start
  */
  // 绑定打开对话框事件
  ipcMain.on('openDialog', (event, arg) => {
    dialog.showOpenDialog((mainWindow as any), {
      // 将 properties 设置为["openFile"、"openDirectory"], 则将显示为目录选择器。
      properties: ['openFile', 'openDirectory']
    }).then((result: any) => {
      event.sender.send('selectedFolder', result.filePaths[0]);
    }).catch((err: any) => {
      console.log(err);
    });
  });
  // 开始统计代码
  ipcMain.on('startStatistics', (event, arg) => {
    const opt = JSON.parse(arg);
    const checkRes = codeStatistics.checkValue(opt);
    if (!checkRes.state) {
      event.sender.send('formError', checkRes.mess);
    }
    codeStatistics.getAllFiles(event, opt);
  });
  /*
  代码统计相关消息end
  */
  /*
  本地运行start
  */
  // 读取本地项目
  ipcMain.on('readLocalProject', (event, arg) => {
    const localProject = fastRun.readLocalProject(event);
    console.log(localProject);
  });
  ipcMain.on('importProject', (event, arg) => {
    dialog.showOpenDialog((mainWindow as any), {
      // 将 properties 设置为["openFile"、"openDirectory"], 则将显示为目录选择器。
      properties: ['openFile', 'openDirectory']
    }).then((result: any) => {
      event.sender.send('selectedFolder', result.filePaths[0]);
    }).catch((err: any) => {
      console.log(err);
    });
  });
  // 导入本地项目
  ipcMain.on('writeLocalProject', (event, arg) => {
    fastRun.writeLocalProject(event, arg);
  });
  // 运行本地项目
  ipcMain.on('runServer', (event, arg) => {
    fastRun.runLocalProject(event, arg);
  });
  // 构建本地项目
  ipcMain.on('runBuild', (event, arg) => {
    fastRun.buildLocalProject(event, arg);
  });
  // 停止本地项目
  ipcMain.on('stopLocalProject', (event, arg) => {
    fastRun.stopLocalProject(event, arg);
  });
  // 删除本地项目
  ipcMain.on('delLocalProject', (event, arg) => {
    fastRun.delLocalProject(event, arg);
  });
  /*
  本地运行end
  */
}

export default {
  init
};
