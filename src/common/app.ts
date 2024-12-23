import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import Cors from '@fastify/cors';
import Multipart from '@fastify/multipart';
import Static from '@fastify/static';
import useController from '@/common/controller';
import { stat } from '@/common/file';
import Cfg from '@/common/cfg';
import { Error as RError } from '@/common/restful';

class App {
  private static instance: App;

  fastify: FastifyInstance | undefined;

  static getInstance() {
    if (!App.instance) App.instance = new App();
    return App.instance;
  }

  constructor() { }

  init() {
    this.fastify = Fastify({
      logger: Cfg.get<any>('app.logger')
    });

    this.fastify.setErrorHandler(async (error, request, reply) => {
      process.env.NODE_ENV === 'development' && console.error(error);
      this.fastify?.log.error(error);
      reply.send(RError('servers error'));
    });

    this.fastify.setNotFoundHandler(async (request, reply) => {
      reply.send(RError('Not Found'));
    });

    //static
    const staticCfg = Cfg.get<{ root: string; prefix: string } & boolean>('app.static');
    staticCfg &&
      stat(staticCfg.root).then((is) => {
        is && this.fastify!.register(Static, staticCfg);
      });

    return this;
  }

  log(level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace', ...args: any[]) {
    if (!this.fastify) throw new Error('uninitialized fastify');
    this.fastify.log[level](args);
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
        if (origin && domainWhite[domainWhite.indexOf(origin)]) {
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

  multipart() {
    if (!this.fastify) throw new Error('uninitialized fastify');
    const multipartCfg = Cfg.get('app.multipart') as { [key: string]: any };
    this.fastify.register(Multipart, multipartCfg);
    return this;
  }

  useControl() {
    if (!this.fastify) throw new Error('uninitialized fastify');
    useController(this.fastify);
    return this;
  }

  listen(port?: number, host?: string) {
    if (!this.fastify) {
      console.error('fastify null');
      return;
    }
    port = port || (Cfg.get('app.port') as number);
    host = host || (Cfg.get('app.host') as string);
    this.fastify
      .listen({
        port,
        host
      })
      .then(() => console.log(`listening on ${host}:${port}`));
  }
}

export default App.getInstance();
