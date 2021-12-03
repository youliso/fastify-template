import type { RouteShorthandOptions } from 'fastify';

/**
 * Standard HTTP method strings
 */
export type HTTPMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS';

/**
 * 注册结构
 */
export interface Route extends RouteShorthandOptions {
  method?: HTTPMethods | HTTPMethods[];
  url?: string;
  handler?: Function;
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
export function RequestMapping(route: Route = {}) {
  return function (target: any, name: string) {
    route.url = route.url || `/${name.toLocaleLowerCase()}`;
    route.method = route.method || 'GET';
    route.preHandler = route.preHandler || [];
    route.handler = target[name];
    route.constructor = target.constructor;
    routes.push(route);
  };
}
