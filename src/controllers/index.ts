import type { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, RequestMapping } from '@/common/decorators';
import { Success } from '@/common/restful';
import IndexServer from '@/servers';

const indexServer = new IndexServer();

@Controller('')
class Index {
  @RequestMapping({ url: '/' })
  async index(request: FastifyRequest, reply: FastifyReply) {
    indexServer.test();
    reply.send(Success('ok'));
  }
}
