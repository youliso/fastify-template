import type { FastifyReply, FastifyRequest } from 'fastify';
import { Error } from '@/common/restful';
import app from '@/common/app';

export async function validationHandler(request: FastifyRequest, reply: FastifyReply) {
  if (request.validationError) {
    reply.send(Error(request.validationError.message));
    return;
  }
}

export async function logHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    app.log(
      'info',
      `[log ${request.url}] ${request.ip} ${request.query && JSON.stringify(request.query)} ${
        request.body && JSON.stringify(request.body)
      }`
    );
  } catch (error) {}
}
