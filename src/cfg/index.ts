import { join } from 'path';
import Cfg from '@/common/cfg';

export async function cfgInit() {
  await Promise.all([
    Cfg.use(join('resources/cfg/index.json'), 'index', true),
    Cfg.use(join('resources/cfg/crypto.json'), 'crypto', true),
    Cfg.use(join('resources/cfg/socket.json'), 'socket', true)
  ]);
}
