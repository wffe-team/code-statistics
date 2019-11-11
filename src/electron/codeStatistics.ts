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

class CodeStatistics implements ICodeStatistics {
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
    this.linesNum = 0;
    const allPath: any = [];
    const filePath = opt.path;
    const ignoreFiles = opt.file ? opt.file.split(',') : [];
    const ignorePaths = opt.folder ? opt.folder.split(',') : [];
    const ignoreFormats = opt.format ? opt.format.split(',') : [];
    const readFile = (path: string) => {
      fs.readdir(path, (err: any, files: any) => {
        for (const item of files) {
          fs.stat(path + '\\' + item, (error: any, stats: any) => {
            // 如果是文件夹递归
            if (stats.isDirectory()) {
              if (ignorePaths.indexOf(item) === -1) {
                readFile(path + '\\' + item);
              }
            } else {
              // 如果是文件则根据规则过滤文件
              if (ignoreFiles.indexOf(item) === -1) {
                const filesFormatList = item.split('.');
                const format = filesFormatList[filesFormatList.length - 1];
                const format2 = '.' + format;
                if (ignoreFormats.indexOf(format) === -1 && ignoreFormats.indexOf(format2) === -1) {
                  allPath.push(path + '\\' + item);
                  this.countLines(event, path + '\\' + item, opt);
                }
              }
            }
          });
        }
      });
    };
    readFile(filePath);
  }
  public countLines(event: any, path: string, opt: any) {
    const isNotes = opt.isNotes;
    let rep = fs.readFileSync(path);
    rep = rep.toString();
    const linesArr = rep.split('\n');
    let lines = [];
    if (isNotes) {
      lines = linesArr;
    } else {
      for (const item of linesArr) {
        if (item.indexOf('//') !== 0) {
          lines.push(item);
        }
      }
    }
    this.linesNum += lines.length;
    event.sender.send('countResult', this.linesNum);
  }
}

export default new CodeStatistics();
