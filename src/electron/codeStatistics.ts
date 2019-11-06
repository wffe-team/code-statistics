const fs = require('fs');

interface IMess {
  state: boolean,
  mess: string
}

interface ICodeStatistics {
  linesNum: number;
  checkValue: (opt: any) => IMess;
  getAllFiles: (event: any, opt: any) => void;
  countLines: (event: any, path: string, opt: any) => void;
}

class CodeStatistics implements ICodeStatistics{
  public linesNum = 0;
  // 检测路径是否正确
  public checkValue(opt: any) {
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
  }
  // 读取路径下所有文件
  public getAllFiles(event: any, opt: any) {
    (this as any).linesNum = 0;
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
                  (this as any).countLines(event, path + '\\' + files[i], opt);
                }
              }
            }
          });
        }
      });
    };
    readFile(filePath);
  }
  countLines(event: any, path: string, opt: any) {
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
    (this as any).linesNum += lines.length;
    event.sender.send('countResult', (this as any).linesNum);
  }
}

export default new CodeStatistics();