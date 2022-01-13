import { appendFile } from 'fs';
import { resolve, sep } from 'path';
import { access, mkdir } from '@/common/file';
import { dateFormat } from '@/utils';

/**
 * 日志处理
 */
export const logsPath = resolve('logs');
export async function loggerInit() {
  const isAccess = await access(logsPath);
  if (!isAccess) await mkdir(logsPath);
}
export async function loggerWrite(msg: string) {
  const path = logsPath + `${sep}${dateFormat('yyyy-MM-dd')}.log`;
  appendFile(path, `[${dateFormat('yy-MM-dd hh:mm:ss')}] ${msg}`, () => {});
}
