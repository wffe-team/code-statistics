import { dialog, ipcMain } from 'electron';
import codeStatistics from './codeStatistics';
 
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
  代码统计相关消息start
  */
}
 
export default {
  init
}