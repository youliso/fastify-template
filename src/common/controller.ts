import type { FastifyInstance, RouteOptions } from 'fastify';
import { routes } from '@/common/decorators';

import '@/controllers/mod';

/**
 * 注册路由
 */
export default (fastify: FastifyInstance) => {
  routes.forEach((route) => {
    // 获取每个路由的前缀
    const prefix = route.constructor.prefix;
    if (prefix) route.url = `${prefix}${route.url}`;
    console.log(`[route|${route.method}]`, route.url);
    fastify.route(route as RouteOptions);
  });
};
