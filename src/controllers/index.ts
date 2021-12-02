import type { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, RequestMapping } from '@/common/decorators';
import { Success } from '@/common/restful';
import IndexServer from '@/servers';

const indexServer = new IndexServer();

@Controller('')
class Index {
  @RequestMapping('/')
  async index(request: FastifyRequest, reply: FastifyReply) {
    request.log.info('Some info about the current request');
    indexServer.test();
    reply.send(Success('ok'));
  }
}
