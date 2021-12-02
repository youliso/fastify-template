import { createHmac, scryptSync, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

/**
 * Md5加密
 * @param text 加密内容
 * @param key 加密密钥
 */
export function encodeMd5(text: string, key: string) {
  const hmac = createHmac('md5', key);
  return hmac.update(text.toString()).digest('hex');
}

/**
 * cbc对称加密
 * @param text 加密内容
 * @param key 加密密钥
 * @param salt
 */
export function encodeAes(text: string, key: string, salt: string) {
  const keys = scryptSync(key, salt, 24);
  const iv = Buffer.alloc(16, 0); // 初始化向量。
  const cipher = createCipheriv('aes-192-cbc', keys, iv);
  let encrypted = cipher.update(text.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * 解密函数
 * @param text  需要解密的内容
 * @param key 加密密钥
 * @param salt
 */
export function decodeAse(text: string, key: string, salt: string) {
  const keys = scryptSync(key, salt, 24);
  const iv = Buffer.alloc(16, 0); // 初始化向量。
  const decipher = createDecipheriv('aes-192-cbc', keys, iv);
  let decrypted = decipher.update(text.toString(), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * 随机密码
 * */
export function randomSize(size: number) {
  let buf = randomBytes(size);
  return buf.toString('hex');
}
