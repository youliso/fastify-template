import cfg from "@/common/cfg";
import { mkdir, stat } from "@/common/file";
import { MultipartFile } from "@fastify/multipart";
import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";

const OnePath = cfg.get<string>('app.multipart.path')!;
const prefix = cfg.get<string>('app.static.prefix')!;

const getSaveUrl = (type: string, filename: string) => {
  return `${prefix}${type}/${filename}`;
}

const getSavePath = async (type: string, filename: string) => {
  const path = join(OnePath, type);
  if (await stat(path) === 0) {
    const is = await mkdir(path);
    if (is == 0) {
      throw new Error('创建失败')
    }
  }
  return join(path, filename);
};

export const saveFile = async (type: string, data: MultipartFile) => {
  const savePath = await getSavePath(type, data.filename);
  await pipeline(data.file, createWriteStream(savePath));
  return getSaveUrl(type, data.filename);
}