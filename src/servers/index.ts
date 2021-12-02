import App from '@/common/app';

export default class IndexServer {
  test() {
    App.fastify.log.info('123');
  }
}
