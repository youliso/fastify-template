import type { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, RequestMapping } from '@/common/decorators';
import { validationHandler } from '@/hooks';
import { Success } from '@/common/restful';
import { test } from '@/servers';

@Controller()
export class Index {
  @RequestMapping({ method: 'GET', url: '/' })
  async index(request: FastifyRequest, reply: FastifyReply) {
    test();
    reply.send('hello fastify');
  }

  @RequestMapping({
    method: 'GET',
    attachValidation: true,
    schema: {
      headers: {
        type: 'object',
        properties: {
          oauth: { type: 'string' }
        },
        required: ['oauth']
      },
      querystring: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string'
          },
          page: {
            type: 'number'
          },
          size: {
            type: 'number'
          }
        },
        required: ['page', 'size']
      }
    },
    preHandler: [validationHandler]
  })
  async query(request: FastifyRequest, reply: FastifyReply) {
    reply.send(Success('ok'));
  }

  @RequestMapping({
    method: 'POST',
    attachValidation: true,
    schema: {
      headers: {
        type: 'object',
        properties: {
          oauth: { type: 'string' }
        },
        required: ['oauth']
      },
      body: {
        type: 'object',
        properties: {
          info: {
            type: 'object',
            properties: {
              id: {
                type: 'number'
              },
              key: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              secret: {
                type: 'string'
              }
            },
            required: ['name']
          }
        },
        required: ['info']
      }
    },
    preHandler: [validationHandler]
  })
  async save(request: FastifyRequest, reply: FastifyReply) {
    reply.send(Success('ok'));
  }
}
