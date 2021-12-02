import type { FastifyRequest, FastifyReply } from 'fastify';
import Db from '@/common/db';
import { isNull } from '@/utils';
import { encodeMd5, randomSize } from '@/common/crypto';
import Log from '@/common/log';

/**
 * 通过用户id添加token
 * @param id
 * @param key
 */
export async function tokenAdd(id: number, key: string) {
  try {
    let token = encodeMd5(id.toString() + randomSize(10), key);
    await Db.redisDb['sub'].set(0, token, id.toString(), 7200);
    return token;
  } catch (e) {
    Log.error(e);
    return null;
  }
}

/**
 * 查询token
 * @param token
 */
export async function tokenGet(token: string) {
  try {
    return await Db.redisDb['sub'].get(0, token);
  } catch (e) {
    Log.error(e);
    return null;
  }
}

/**
 * 查询token是否过期
 * @param token
 */
export async function tokenTtl(token: string) {
  try {
    return (await Db.redisDb['sub'].ttl(0, token)) as number;
  } catch (e) {
    Log.error(e);
    return -2;
  }
}

/**
 * 更新token剩余时间
 * @param token
 * @param seconds
 */
export async function tokenExpire(token: string, seconds: number) {
  try {
    return (await Db.redisDb['sub'].expire(0, token, seconds)) as number;
  } catch (e) {
    Log.error(e);
    return -2;
  }
}

export async function tokenUse(
  request: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void
) {
  let token = request.headers['authorization'];
  if (isNull(token)) {
    reply.send('没有token');
    done();
    return;
  }
  let outTime = await tokenTtl(token);
  if (outTime <= 0) {
    reply.send('没有token，或已过期');
    done();
    return;
  }
  if (outTime <= 1800) await tokenExpire(token, 7200);
  request.headers['Authorization'] = token;
  request['userInfo'] = { id: Number(await tokenGet(token)) };
  done();
}
