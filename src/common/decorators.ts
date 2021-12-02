import type { RouteOptions } from 'fastify';

/**
 * Standard HTTP method strings
 */
export type HTTPMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS';

/**
 * 注册结构
 */
export interface Route extends RouteOptions {
  constructor?: any;
}

/**
 * 定义注册的路由数组
 */
export const routes: Route[] = [];

/**
 * 给controller添加装饰
 * @param {*} path
 */
export function Controller(path: string = '') {
  return function (target: any) {
    target.prefix = path;
  };
}

/**
 * 给controller类的方法添加装饰
 * @param params Controllers
 */
export function RequestMapping(
  url: string,
  method?: HTTPMethods | HTTPMethods[],
  preHandler?: any[]
) {
  return function (target: any, name: string) {
    routes.push({
      url: url || `/${name.toLocaleLowerCase()}`,
      method: method || 'GET',
      preHandler: preHandler || [],
      handler: target[name],
      constructor: target.constructor
    });
  };
}
