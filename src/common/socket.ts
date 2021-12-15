import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Server as socketIo } from 'socket.io';
import Cfg from '@/common/cfg';

declare module 'fastify' {
  interface FastifyInstance {
    socketIo: socketIo;
  }
}

export default (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: (err?: Error) => void
) => {
  const corsOpt = Cfg.get('index.cors') as { [key: string]: any };
  const domainWhite = Cfg.get('index.domainWhite') as string[];
  fastify.decorate(
    'socketIo',
    new socketIo(fastify.server, {
      cors: {
        origin: (origin, callback) => {
          if (typeof domainWhite === 'string') {
            if (domainWhite === '*') {
              callback(null, true);
              return;
            }
            if (domainWhite === origin) {
              callback(null, true);
              return;
            }
            callback(new Error('Not allowed by CORS'));
            return;
          }
          if (domainWhite && origin && domainWhite.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: corsOpt.allowMethods,
        allowedHeaders: corsOpt.allowHeaders,
        exposedHeaders: corsOpt.exposeHeaders
      },
      path: Cfg.get('socket.path'),
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false
    })
  );
  fastify.addHook('onClose', (fastify, done) => {
    fastify.socketIo.close();
    done();
  });
  done();
};
