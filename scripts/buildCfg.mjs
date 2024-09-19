import fs from 'node:fs';
import envConfig from './cfg/env.json' assert { type: 'json' };


/** env配置 **/
envConfig['process.env.PORT'] = JSON.stringify(4891);



fs.writeFileSync('scripts/.env.json', JSON.stringify(envConfig, null, 2));
