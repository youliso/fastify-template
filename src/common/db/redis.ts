import { createClient } from 'redis/dist/';
export type RedisClientType = ReturnType<typeof createClient>;

export class Redis {
  dbClient: RedisClientType;

  constructor(db: object) {
    this.dbClient = createClient(db);
    this.dbClient.on('error', (err) => {
      console.error(err);
      this.dbClient.end(true);
    });
  }

  /**
   * @param key 键
   * @param value 值
   * @param opt 参数
   */
  set(key: string, value: string) {
    this.dbClient.set(key, value);
  }

  // /**
  //  * @param dbNum 库号
  //  * @param key 键
  //  */
  // get(dbNum: number, key: string) {
  //   return new Promise((resolve, reject) => {
  //     this.dbClient.select(dbNum, (err) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       this.dbClient.get(key, (err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         }
  //         resolve(res);
  //       });
  //     });
  //   });
  // }

  // /**
  //  * @param dbNum 库号
  //  * @param key 键
  //  */
  // del(dbNum: number, key: string) {
  //   return new Promise((resolve, reject) => {
  //     this.dbClient.select(dbNum, (err) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       this.dbClient.del(key, (err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         }
  //         resolve(res);
  //       });
  //     });
  //   });
  // }

  // /**
  //  * @param dbNum 库号
  //  * @param key 键
  //  */
  // ttl(dbNum: number, key: string) {
  //   return new Promise((resolve, reject) => {
  //     this.dbClient.select(dbNum, (err) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       this.dbClient.ttl(key, (err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         }
  //         resolve(res);
  //       });
  //     });
  //   });
  // }

  // /**
  //  * @param dbNum 库号
  //  * @param key 键
  //  * @param seconds 时间(秒)
  //  */
  // expire(dbNum: number, key: string, seconds: number) {
  //   return new Promise((resolve, reject) => {
  //     this.dbClient.select(dbNum, (err) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       this.dbClient.expire(key, seconds, (err, res) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         }
  //         resolve(res);
  //       });
  //     });
  //   });
  // }
}
