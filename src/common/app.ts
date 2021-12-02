import type {
  FastifyServerOptions,
  FastifyPluginOptions,
  FastifyInstance,
  FastifyRequest
} from 'fastify';
import Fastify from 'fastify';
import Router from '@/common/router';
import { loggerWrite } from '@/common/log';

class App {
  private static instance: App;

  fastify: FastifyInstance;

  static getInstance() {
    if (!App.instance) App.instance = new App();
    return App.instance;
  }

  constructor() {}

  init(opt: FastifyServerOptions = {}) {
    this.fastify = Fastify(
      Object.assign(opt, {
        logger: {
          serializers: {
            req(request: FastifyRequest) {
              return {
                method: request.method,
                url: request.url,
                headers: request.headers,
                hostname: request.hostname,
                remoteAddress: request.ip,
                remotePort: request.socket.remotePort
              };
            }
          },
          stream: {
            write: loggerWrite
          }
        }
      })
    );
  }

  router() {
    Router(this.fastify);
  }

  register(
    fq: (fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error) => void) => void
  ) {
    // https://www.fastify.cn/docs/latest/Plugins/
    fq[Symbol.for('skip-override')] = true;
    this.fastify.register(fq);
  }

  listen(port: number) {
    if (!this.fastify) {
      console.error('fastify null');
      return;
    }
    this.fastify.listen(port, (err, address) => {
      if (err) throw err;
      console.log(`Server is now listening on ${address}`);
    });
  }
}

export default App.getInstance();
