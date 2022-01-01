import type { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, RequestMapping } from '@/common/decorators';
import { Success } from '@/common/restful';
import IndexServer from '@/servers';

const indexServer = new IndexServer();

@Controller()
export class Index {
  @RequestMapping()
  async index(request: FastifyRequest, reply: FastifyReply) {
    indexServer.test();
    reply.send(Success('ok'));
  }
}
