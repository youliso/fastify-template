import App from '@/common/app';
import Cfg from '@/common/cfg';
import { loggerInit } from '@/common/log';

await Cfg.init();
await loggerInit();
App.init().cors().multipart().static().socketIo().useControl().listen();
