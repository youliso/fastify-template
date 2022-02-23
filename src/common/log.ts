import { appendFile } from 'fs';
import { resolve, sep } from 'path';
import { access, mkdir } from '@/common/file';

/**
 * 日志处理
 */
export const logsPath = resolve('logs');
export async function loggerInit() {
  const isAccess = await access(logsPath);
  if (!isAccess) await mkdir(logsPath);
}
export async function loggerWrite(msg: string) {
  const date = new Date();
  const path = logsPath + `${sep}${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;
  appendFile(
    path,
    `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${msg}`,
    () => {}
  );
}
