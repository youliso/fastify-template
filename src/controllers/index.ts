import type { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, RequestMapping } from '@/common/decorators';
import { Success } from '@/common/restful';
import IndexServer from '@/servers';

const indexServer = new IndexServer();

@Controller()
export class Index {
  @RequestMapping({ method: 'GET', url: '/' })
  async index(request: FastifyRequest, reply: FastifyReply) {
    indexServer.test();
    reply.send('hello fastify');
  }

  @RequestMapping()
  async test(request: FastifyRequest, reply: FastifyReply) {
    indexServer.test();
    reply.send(Success('ok'));
  }
}
