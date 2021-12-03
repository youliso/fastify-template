import App from '@/common/app';
import Socket from '@/common/socket';
import { cfgInit } from '@/cfg';

await cfgInit();
App.init().router().register(Socket).listen(3000);
