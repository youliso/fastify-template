import App from '@/common/app';
import { cfgInit } from '@/cfg';

await cfgInit();
App.init().cors().static().socketIo().router().listen(3000);
