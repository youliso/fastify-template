import type { FastifyServerOptions, FastifyInstance, FastifyRequest } from 'fastify';
import { resolve } from 'path';
import Fastify from 'fastify';
import Cors from 'fastify-cors';
import Static from 'fastify-static';
import Router from '@/common/router';
import SocketIo from '@/common/socket';
import Cfg from '@/common/cfg';
import { loggerWrite } from '@/common/file';

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
    return this;
  }

  log() {
    return this.fastify.log;
  }

  cors() {
    const corsOpt = Cfg.get<{ [key: string]: any }>('index.cors');
    const domainWhite = Cfg.get<string[]>('index.domainWhite');
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
    this.fastify.register(Static, {
      root: resolve('resources/static'),
      prefix: '/static/'
    });
    return this;
  }

  socketIo() {
    // https://www.fastify.cn/docs/latest/Plugins/
    SocketIo[Symbol.for('skip-override')] = true;
    this.fastify.register(SocketIo);
    return this;
  }

  router() {
    Router(this.fastify);
    return this;
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
