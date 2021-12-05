import App from '@/common/app';
import { loggerInit } from '@/common/file';
import { cfgInit } from '@/cfg';

await Promise.all([cfgInit(), loggerInit()]);
App.init().cors().static().socketIo().router().listen(3000, '::');
