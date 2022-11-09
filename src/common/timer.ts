import { Job, scheduleJob } from 'node-schedule';
export interface taskOpt {
  key: string;
  func: (is: boolean, that?: Timer) => Promise<number | string>;
}

class Timer {
  private static instance: Timer;
  public taskList: { [key: string]: (is: boolean, that?: Timer) => Promise<number | string> } = {};
  public Timeouts: { [key: string]: NodeJS.Timeout } = {};
  public scheduleJobs: { [key: string]: Job } = {};

  static getInstance() {
    if (!Timer.instance) Timer.instance = new Timer();
    return Timer.instance;
  }

  constructor() {
    /** 示例 **/
    // this.taskList['test1'] = async (is, that) => {
    //     if (is) return 1000; //毫秒、秒、分、时
    //     try {
    //         console.log('test1');
    //     } catch (e) {
    //         Log.error(e);
    //     }
    // };
    // this.taskList['test2'] = async (is, that) => {
    //     if (is) return '* * * * * *'; //秒、分、时、日、月、周几
    //     try {
    //         console.log('test2');
    //     } catch (e) {
    //         Log.error(e);
    //     }
    // };
  }

  /**
   * 启动
   * 默认启动taskList内方法
   * */
  async start() {
    this.Timeouts = {};
    this.scheduleJobs = {};
    for (let i in this.taskList) {
      if (this.taskList[i]) await this.add({ key: i, func: this.taskList[i] }, true);
    }
  }

  /**
   * 添加方法到定时器队列
   * 如果添加的key已存在将无效
   * @param task
   * @param is 首次启动时需传入 true
   * */
  async add(task: taskOpt, is?: boolean) {
    if (!is && this.taskList[task.key]) return;
    let timeout = await task.func(true);
    if (typeof timeout === 'number') {
      this.Timeouts[task.key] = setInterval(async () => {
        await task.func(false, this);
      }, timeout);
    } else if (typeof timeout === 'string') {
      this.scheduleJobs[task.key] = scheduleJob(timeout, async () => {
        await task.func(false, this);
      });
    }
  }

  /**
   * 关闭
   * @param key{string}
   * @param type{string} n Interval | s schedule
   * */
  cancel(key?: string, type?: string) {
    if (key) {
      if (type === 'n') {
        clearInterval(this.Timeouts[key]);
        delete this.Timeouts[key];
      }
      if (type === 's') {
        this.scheduleJobs[key].cancel();
        delete this.scheduleJobs[key];
      }
      return;
    }
    for (let i in this.Timeouts) {
      if (i) clearInterval(this.Timeouts[i]);
    }
    for (let i in this.scheduleJobs) {
      if (i) this.scheduleJobs[i].cancel();
    }
    this.Timeouts = {};
    this.scheduleJobs = {};
  }

  /**
   * 重启
   * */
  async reload() {
    this.cancel();
    await this.start();
  }
}

export default Timer.getInstance();
