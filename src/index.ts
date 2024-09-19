import Cfg from '@/common/cfg';
import App from '@/common/app';

const [, , appCfgPath] = process.argv;

appCfgPath && (await Cfg.use(appCfgPath, 'app'));

App.init().cors().multipart().useControl().listen();
