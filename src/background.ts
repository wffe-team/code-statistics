'use strict';

import { app, protocol, BrowserWindow } from 'electron';
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';
import { dialog, ipcMain } from 'electron';
const fs = require('fs');
const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: {
    nodeIntegration: true
  } });

  let linesNum = 0;
  // 检测路径是否正确
  const checkValue = (opt: any) => {
    if (!fs.existsSync(opt.path)) {
      return {
        state: false,
        mess: '文件夹路径错误！'
      };
    }
    return {
      state: true,
      mess: '数据正确！'
    };
  };
  // 读取路径下所有文件
  const getAllFiles = (event: any, opt: any) => {
    linesNum = 0;
    const allPath: any = [];
    const filePath = opt.path;
    const ignoreFiles = opt.file ? opt.file.split(',') : [];
    const ignorePaths = opt.folder ? opt.folder.split(',') : [];
    const ignoreFormats = opt.format ? opt.format.split(',') : [];
    const readFile = (path: string) => {
      fs.readdir(path, (err: any, files: any) => {
        for (let i = 0 ; i < files.length ; i++) {
          fs.stat(path + '\\' + files[i], (error: any, stats: any) => {
            // 如果是文件夹递归
            if (stats.isDirectory()) {
              if (ignorePaths.indexOf(files[i]) === -1) {
                readFile(path + '\\' + files[i]);
              }
            } else {
              // 如果是文件则根据规则过滤文件
              if (ignoreFiles.indexOf(files[i]) === -1) {
                const filesFormatList = files[i].split('.');
                const format = filesFormatList[filesFormatList.length - 1];
                const format2 = '.' + format;
                if (ignoreFormats.indexOf(format) === -1 && ignoreFormats.indexOf(format2) === -1) {
                  allPath.push(path + '\\' + files[i]);
                  countLines(event, path + '\\' + files[i], opt);
                }
              }
            }
          });
        }
      });
    };
    readFile(filePath);
  };
  // 计算文件内行数
  function countLines(event: any, path: string, opt: any) {
    const isNotes = opt.isNotes;
    let rep = fs.readFileSync(path);
    rep = rep.toString();
    let linesArr = rep.split('\n');
    let lines = [];
    if (isNotes) {
      lines = linesArr;
    } else {
      for (let i = 0; i < linesArr.length; i++) {
        if (linesArr[i].indexOf('//') !== 0) {
          lines.push(linesArr[i]);
        }
      }
    }
    linesNum += lines.length;
    event.sender.send('countResult', linesNum);
  }
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
    const checkRes = checkValue(opt);
    if (!checkRes.state) {
      event.sender.send('formError', checkRes.mess);
    }
    getAllFiles(event, opt);
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data: any) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
