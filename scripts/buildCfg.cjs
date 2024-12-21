const envConfig = require('./cfg/env.json');

const buildConfig = async (archPath, archTarget) => {
  /** env配置 **/
  envConfig['process.env.PORT'] = JSON.stringify(4891);

  return {
    envConfig
  };
}


module.exports = {
  buildConfig
};
