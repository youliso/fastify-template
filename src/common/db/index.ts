import Cfg from '@/common/cfg';
import { MysqlDb } from './mysqldb';
import { RedisDb } from './redisdb';
// import {MongoDb} from "./mongodb";

const dbConfig = Cfg.get<{ [key: string]: any }>('db');

class Db {
  private static instance: Db;
  public mysqlDb: { [key: string]: MysqlDb } = {};
  public redisDb: { [key: string]: RedisDb } = {};
  // public mongoDb: { [key: string]: MongoDb } = {};

  static getInstance() {
    if (!Db.instance) Db.instance = new Db();
    return Db.instance;
  }

  constructor() {
    for (let i in dbConfig) {
      if (dbConfig.hasOwnProperty(i))
        switch (dbConfig[i].type) {
          case 'mysql':
            this.mysqlDb[i] = new MysqlDb(dbConfig[i].data);
            break;
          case 'redis':
            this.redisDb[i] = new RedisDb(dbConfig[i].data);
            break;
          // case 'mongo':
          //     this.mongoDb[i] = new MongoDb(dbConfig[i].data);
          //     break;
        }
    }
  }

  async add(table: string, data: unknown) {
    return await this.mysqlDb['main'].query('insert into ' + table + ' set ?', [data]);
  }

  async get(table: string, id: number) {
    if (id)
      return await this.mysqlDb['main'].single('select * from ' + table + ' where id = ?', [id]);
    else return await this.mysqlDb['main'].first('select * from ' + table);
  }

  async upd(table: string, data: unknown, id: number) {
    return await this.mysqlDb['main'].query('update ' + table + ' set ? where id = ?', [data, id]);
  }

  async del(table: string, id: number) {
    return await this.mysqlDb['main'].query('delete from ' + table + ' where id = ?', [id]);
  }
}

export default Db.getInstance();
