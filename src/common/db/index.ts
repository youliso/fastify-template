import Cfg from '@/common/cfg';
import { Mysql } from './mysql';

const dbConfig = Cfg.get<{ [key: string]: any }>('db');

class Db {
  private static instance: Db;
  public mysqlDb: { [key: string]: Mysql } = {};

  static getInstance() {
    if (!Db.instance) Db.instance = new Db();
    return Db.instance;
  }

  constructor() {
    for (let i in dbConfig) {
      if (dbConfig.hasOwnProperty(i))
        switch (dbConfig[i].type) {
          case 'mysql':
            this.mysqlDb[i] = new Mysql(dbConfig[i].data);
            break;
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
