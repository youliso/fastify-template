import { readFile } from '@/common/file';
import { join } from 'node:path';

type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

/**
 * Cfg
 */
export class Cfg {
  private static instance: Cfg;

  public sharedObject: { [key: string]: any } = {
    app: {
      host: '0.0.0.0',
      port: 3000,
      domainWhite: '*',
      cors: {
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Type', 'Authorization']
      },
      logger: false,
      multipart: {
        path: join(__dirname, 'upload'),
        opt: {
          limits: {
            fieldNameSize: 100, // Max field name size in bytes
            fieldSize: 100,     // Max field value size in bytes
            fields: 10,         // Max number of non-file fields
            fileSize: 1024 * 1024 * 1024 * 10,   // For multipart forms, the max file size in bytes
            files: 1,           // Max number of file fields
            headerPairs: 2000,  // Max number of header key=>value pairs
            parts: 1000         // For multipart forms, the max number of parts (fields + files)
          }
        }
      },
      static: {
        root: join(__dirname, 'upload'),
        prefix: '/static/',
      },
      socketIo: {
        path: '/io'
      }
    }
  };

  static getInstance() {
    if (!Cfg.instance) Cfg.instance = new Cfg();
    return Cfg.instance;
  }

  constructor() { }

  /**
   * 挂载配置
   * @param path 配置文件名
   */
  async use(path: string, name: string) {
    try {
      const cfg = (await readFile(path, {
        encoding: 'utf-8'
      })) as any;
      cfg && this.set(name, JSON.parse(cfg));
    } catch (e) {
      console.error(e);
    }
  }

  set<Value>(key: string, value: Value, exists: boolean = false): void {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.')) {
      if (Object.prototype.hasOwnProperty.call(this.sharedObject, key) && exists) {
        console.warn(`The key ${key} looks like already exists on obj.`);
      }
      this.sharedObject[key] = value;
    }

    const levels = key.split('.');
    const lastKey = levels.pop()!;

    let cur = this.sharedObject;
    for (const level of levels) {
      if (Object.prototype.hasOwnProperty.call(cur, level)) {
        cur = cur[level];
      } else {
        console.error(`Cannot set value because the key ${key} is not exists on obj.`);
        return;
      }
    }

    if (typeof cur !== 'object') {
      console.error(`Invalid key ${key} because the value of this key is not a object.`);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(cur, lastKey) && exists) {
      console.warn(`The key ${key} looks like already exists on obj.`);
    }
    cur[lastKey] = value;
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
