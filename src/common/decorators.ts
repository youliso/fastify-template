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
export function Controller(path?: string) {
  return function (target: any) {
    if (!path) target.prefix = '';
    else if (path.startsWith('/')) target.prefix = path;
    else target.prefix = `/${path}`;
  };
}

/**
 * 核心mapping
 */
function CoreMapping(route: Route = {}) {
  return function (target: any, name: string) {
    if (!route.url) route.url = `/${name}`;
    else if (route.url.startsWith('/')) route.url = route.url;
    else route.url = `/${route.url}`;
    route.preHandler = route.preHandler || [];
    route.handler = target[name];
    route.constructor = target.constructor;
    routes.push(route);
  };
}

/**
 * 给controller类的方法添加装饰
 * @param params Controllers
 */
export function RequestMapping(route: Route = { method: 'GET' }) {
  return CoreMapping(route);
}
