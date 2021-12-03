import { Pool, createPool, escape } from 'mysql2/promise';
import App from '@/common/app';

export class MysqlDb {
  dbClient: Pool;

  constructor(db: object) {
    this.dbClient = createPool(db);
  }

  //返回一个对象
  async first(sql: string, params?: object) {
    try {
      const connection = await this.dbClient.getConnection();
      await connection.ping();
      const rows = await connection.query(sql, params);
      connection.release();
      return rows[0];
    } catch (e) {
      App.log().error(e.toString());
      return null;
    }
  }

  //返回单个查询结果
  async single(sql: string, params?: object) {
    try {
      const connection = await this.dbClient.getConnection();
      await connection.ping();
      const rows = await connection.query(sql, params);
      connection.release();
      return rows[0][Object.keys(rows[0])[0]];
    } catch (e) {
      App.log().error(e.toString());
      return null;
    }
  }

  //执行代码，返回执行结果
  async query(sql: string, params?: object) {
    try {
      const connection = await this.dbClient.getConnection();
      await connection.ping();
      const rows = await connection.query(sql, params);
      connection.release();
      return rows;
    } catch (e) {
      App.log().error(e.toString());
      return null;
    }
  }

  //执行代码，返回执行结果
  async execute(sql: string, params?: object) {
    try {
      const connection = await this.dbClient.getConnection();
      await connection.ping();
      const rows = await connection.execute(sql, params);
      connection.release();
      return rows;
    } catch (e) {
      App.log().error(e.toString());
      return null;
    }
  }

  /**
   * 防止注入
   * @param {*} c
   **/
  escape(c: unknown) {
    return escape(c);
  }
}
