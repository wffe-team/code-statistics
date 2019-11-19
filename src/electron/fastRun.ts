const fs = require('fs');
const kill = require('tree-kill');

interface IFastRun {
  childProcessList: any[];
  readLocalProject: (event: any) => void;
  writeLocalProject: (event: any, filePath: string) => void;
  runLocalProject: (event: any, filePath: string) => void;
  stopLocalProject: (event: any, pid: any) => void;
  buildLocalProject: (filePath: string) => void;
  delLocalProject: (filePath: string) => void;
}
/*
本地项目状态state: running=>正在运行，sleeping=>等待运行，waiting=>启动中
*/
class FastRun implements IFastRun {
  public childProcessList = [];
  // 读取本地项目
  public readLocalProject(event: any) {
    if (!fs.existsSync(__dirname + '/../local')) {
      fs.mkdirSync(__dirname + '/../local');
    }
    if (!fs.existsSync(__dirname + '/../local/project.json')) {
      fs.writeFile(__dirname + '/../local/project.json', JSON.stringify({project: []}), (error: any) => {
        fs.readFile(__dirname + '/../local/project.json', (err: any, data: any) => {
          const project = data.toString(); // 将二进制的数据转换为字符串
          event.sender.send('localProject', project);
        });
      });
    } else {
      fs.readFile(__dirname + '/../local/project.json', (err: any, data: any) => {
        const project = data.toString(); // 将二进制的数据转换为字符串
        event.sender.send('localProject', project);
      });
    }
  }
  // 本地写文件
  public writeLocalFile(event: any, callback: (localFile: any) => any) {
    fs.readFile(__dirname + '/../local/project.json', (err: any, data: any) => {
      let localProject = data.toString(); // 将二进制的数据转换为字符串
      localProject = JSON.parse(localProject);
      localProject = callback(localProject);
      const projectStr = JSON.stringify(localProject);
      fs.writeFile(__dirname + '/../local/project.json', projectStr, (error: any) => {
        if (error) {
          console.error(error);
        }
        event.sender.send('localProject', JSON.stringify(localProject));
      });
    });
  }
  // 导入本地项目
  public writeLocalProject(event: any, project: any) {
    this.writeLocalFile(event, (localFile: any) => {
      project = JSON.parse(project);
      project.state = 'sleeping';
      localFile.project.push(project);
      return localFile;
    });
  }
  public childProcess(event: any, filePath: string) {
    const exec = require('child_process').exec;
    // 任何你期望执行的cmd命令，ls都可以
    const cmdStr = 'npm run serve';
    // 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
    const cmdPath = filePath;
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    const workerProcess: any = exec(cmdStr, {cwd: cmdPath});
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', (data: any) => {
      if (data.toString().indexOf('Network:') !== -1) {

        // 打开窗口
        console.log('openWindows');
        const localUrl = data.toString().split('Network: ')[1];
        console.log(localUrl);
        exec(`start chrome ${localUrl}`, () => {
          // 写入pid
          this.writeLocalFile(event, (localFile: any) => {
            localFile.project.forEach(((item: any) => {
              if (item.projectPath === filePath) {
                item.pid = workerProcess.pid;
                item.state = 'running';
              }
            }));
            return localFile;
          });
        });

        // event.sender.send('pid', JSON.stringify({pid:workerProcess.pid,path:cmdPath}));
      }
      console.log('stdout: ' + data);
    });
    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', (data: any) => {
      // console.log('stderr: ' + data);
    });
    // 退出之后的输出
    workerProcess.on('close', (code: any) => {
      console.log('out code：' + code);
    });
    (this.childProcessList as any).push(workerProcess);
  }
  // 运行本地项目
  public runLocalProject(event: any, filePath: string) {
    this.childProcess(event, filePath);
  }
  // 停止本地项目
  public stopLocalProject(event: any, pid: any) {
    kill(pid, 'SIGKILL', (err: any) => {
      console.log(err);
      this.writeLocalFile(event, (localFile: any) => {
        localFile.project.forEach(((item: any) => {
          if (item.pid === pid) {
            item.pid = undefined;
            item.state = 'sleeping';
          }
        }));
        return localFile;
      });
    });
  }
  public killAll() {
    fs.readFile(__dirname + '/../local/project.json', (err: any, data: any) => {
      let localProject = data.toString(); // 将二进制的数据转换为字符串
      localProject = JSON.parse(localProject);
      localProject.project.forEach(((item: any) => {
        if (item.pid) {
          kill(item.pid, 'SIGKILL', (error: any) => {
            console.log(error);
          });
        }
      }));
    });
  }
  // 打包本地项目
  public buildLocalProject(filePath: string) {
    console.log(1);
  }
  // 删除本地项目
  public delLocalProject(filePath: string) {
    console.log(1);
  }
}

export default new FastRun();
