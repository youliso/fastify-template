import type { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, RequestMapping, GetMapping, PostMapping } from '@/common/decorators';
import { Success } from '@/common/restful';
import IndexServer from '@/servers';

const indexServer = new IndexServer();

@Controller('')
export class Index {
  @RequestMapping()
  @GetMapping('test')
  @PostMapping('test')
  async index(request: FastifyRequest, reply: FastifyReply) {
    indexServer.test();
    reply.send(Success('ok'));
  }
}
