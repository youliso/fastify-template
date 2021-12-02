import {createClient, RedisClient} from 'redis';
import Log from "@/common/log";

export class RedisDb {
    dbClient: RedisClient;

    constructor(db: object) {
        this.dbClient = createClient(db);
        this.dbClient.on('error', err => {
            Log.error(err);
            this.dbClient.end(true);
        });
    }

    /**
     * @param dbNum 库号
     * @param key 键
     * @param value 值
     * @param expire 过期时间（单位：秒，可为空，为空则不过期）
     */
    set(dbNum: number, key: string, value: string, expire: number) {
        return new Promise((resolve, reject) => {
            this.dbClient.select(dbNum, (err) => {
                if (err) {
                    reject(err)
                    return;
                }
                this.dbClient.set(key, value, (err, res) => {
                    if (err) {
                        console.log('redis插入失败：' + err);
                        reject(err);
                        return;
                    }
                    if (!isNaN(expire) && expire > 0) {
                        this.dbClient.expire(key, expire);
                    }
                    resolve(res);
                })

            })
        })
    }

    /**
     * @param dbNum 库号
     * @param key 键
     */
    get(dbNum: number, key: string) {
        return new Promise((resolve, reject) => {
            this.dbClient.select(dbNum, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.dbClient.get(key, (err, res) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(res);
                })
            })
        })
    }

    /**
     * @param dbNum 库号
     * @param key 键
     */
    del(dbNum: number, key: string) {
        return new Promise((resolve, reject) => {
            this.dbClient.select(dbNum, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.dbClient.del(key, (err, res) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(res);
                })
            })
        })
    }

    /**
     * @param dbNum 库号
     * @param key 键
     */
    ttl(dbNum: number, key: string) {
        return new Promise((resolve, reject) => {
            this.dbClient.select(dbNum, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.dbClient.ttl(key, (err, res) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(res);
                })
            })
        })
    }

    /**
     * @param dbNum 库号
     * @param key 键
     * @param seconds 时间(秒)
     */
    expire(dbNum: number, key: string, seconds: number) {
        return new Promise((resolve, reject) => {
            this.dbClient.select(dbNum, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.dbClient.expire(key, seconds, (err, res) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(res);
                })
            })
        })
    }

}
