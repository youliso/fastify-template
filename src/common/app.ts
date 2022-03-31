import type { FastifyServerOptions, FastifyInstance, FastifyRequest } from 'fastify';
import { resolve } from 'path';
import Fastify from 'fastify';
import Cors from 'fastify-cors';
import Static from 'fastify-static';
import useController from '@/common/controller';
import SocketIo from '@/common/socket';
import Cfg from '@/common/cfg';
import { loggerWrite } from '@/common/log';

class App {
  private static instance: App;

  fastify: FastifyInstance | undefined;

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
    return this;
  }

  log() {
    if (!this.fastify) throw new Error('uninitialized fastify');
    return this.fastify.log;
  }

  cors() {
    if (!this.fastify) throw new Error('uninitialized fastify');
    const corsOpt = Cfg.get('app.cors') as { [key: string]: any };
    const domainWhite = Cfg.get('app.domainWhite') as string[];
    this.fastify.register(Cors, {
      origin: (origin, cb) => {
        if (typeof domainWhite === 'string') {
          if (domainWhite === '*' || domainWhite === origin) {
            cb(null, true);
            return;
          }
          cb(new Error('Not allowed'), false);
          return;
        }
        if (domainWhite[domainWhite.indexOf(origin)]) {
          cb(null, true);
          return;
        }
        cb(new Error('Not allowed'), false);
      },
      methods: corsOpt.methods,
      allowedHeaders: corsOpt.allowedHeaders,
      exposedHeaders: corsOpt.exposedHeaders
    });
    return this;
  }

  static() {
    if (!this.fastify) throw new Error('uninitialized fastify');
    this.fastify.register(Static, {
      root: resolve('resources/static'),
      prefix: '/static/'
    });
    return this;
  }

  socketIo() {
    if (!this.fastify) throw new Error('uninitialized fastify');
    // https://www.fastify.cn/docs/latest/Plugins/
    // @ts-ignore
    SocketIo[Symbol.for('skip-override')] = true;
    this.fastify.register(SocketIo);
    return this;
  }

  useControl() {
    if (!this.fastify) throw new Error('uninitialized fastify');
    useController(this.fastify);
    return this;
  }

  listen(port?: number, address: string = '0.0.0.0') {
    if (!this.fastify) {
      console.error('fastify null');
      return;
    }
    port = port || (Cfg.get('app.port') as number);
    this.fastify.listen(port, address, (err, address) => {
      if (err) throw err;
      console.log(`listening on ${port}`);
    });
  }
}

export default App.getInstance();
