import App from '@/common/app';
import Socket from '@/common/socket';
import { cfgInit } from '@/cfg';

await cfgInit();
App.init();
App.router();
App.register(Socket);
App.listen(3000);