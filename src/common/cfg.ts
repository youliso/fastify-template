import { join } from 'path';
import { readFile } from '@/common/file';

type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

/**
 * Cfg
 */
export class Cfg {
  private static instance: Cfg;

  public sharedObject: { [key: string]: any } = {};

  static getInstance() {
    if (!Cfg.instance) Cfg.instance = new Cfg();
    return Cfg.instance;
  }

  constructor() {}

  async init() {
    try {
      const configs = JSON.parse(
        (await readFile(join('resources/cfg/index.json'), {
          encoding: 'utf-8'
        })) as string
      ) as string[];
      for (const config of configs) await this.use(config);
    } catch (e) {
      console.error('[cfg init]', e);
    }
  }

  /**
   * 挂载配置
   * @param name 配置文件名
   */
  async use(name: string) {
    try {
      const cfg = (await readFile(join(`resources/cfg/${name}.json`), {
        encoding: 'utf-8'
      })) as any;
      cfg && this.set(name, JSON.parse(cfg));
    } catch (e) {
      console.error(e);
    }
  }

  set(key: string, value: any) {
    this.sharedObject[key] = value;
  }

  get<Value>(key: string): Value | undefined {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.') && Object.prototype.hasOwnProperty.call(this.sharedObject, key)) {
      return this.sharedObject[key] as Value;
    }

    const levels = key.split('.');
    let cur = this.sharedObject;
    for (const level of levels) {
      if (Object.prototype.hasOwnProperty.call(cur, level)) {
        cur = cur[level] as unknown as Obj<Value>;
      } else {
        return;
      }
    }

    return cur as unknown as Value;
  }
}

export default Cfg.getInstance();
