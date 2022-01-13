import App from '@/common/app';
import { loggerInit } from '@/common/log';
import { cfgInit } from '@/cfg';

await Promise.all([cfgInit(), loggerInit()]);
App.init().cors().static().socketIo().router().listen();
