import { Next, ParameterizedContext } from 'koa';
import * as Koa from 'koa';

export interface Options {
  origin?: ((ctx: Koa.Context) => string) | ((ctx: Koa.Context) => PromiseLike<string>) | string;
  allowMethods?: string[];
  exposeHeaders?: string[];
  allowHeaders?: string[];
  maxAge?: number | string;
  credentials?: boolean;
}

export default (options: Options = {}) => {
  const defaultOptions: Options = {
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
    credentials: true,
    maxAge: 3600 // 1h
  };

  // set defaultOptions to options
  for (const key in defaultOptions) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaultOptions[key];
    }
  }

  return async (ctx: ParameterizedContext, next: Next) => {
    let origin;
    if (typeof options.origin === 'function') {
      origin = await options.origin(ctx);
    } else {
      origin = options.origin || ctx.get('Access-Control-Allow-Origin') || '*';
    }
    if (!origin) {
      return await next();
    }

    // Access-Control-Allow-Methods
    ctx.set('Access-Control-Allow-Methods', options.allowMethods.join(','));
    // Access-Control-Allow-Origin
    ctx.set('Access-Control-Allow-Origin', origin);

    // Access-Control-Max-Age
    if (options.maxAge) {
      ctx.set('Access-Control-Max-Age', String(options.maxAge));
    }
    if (options.credentials === true) {
      // if (origin === '*') {
      //   // `credentials` can't be true when the `origin` is set to `*`
      //   ctx.remove('Access-Control-Allow-Credentials');
      // } else {
      ctx.set('Access-Control-Allow-Credentials', 'true');
      // }
    }
    // Access-Control-Allow-Headers
    if (options.allowHeaders) {
      ctx.set('Access-Control-Allow-Headers', options.allowHeaders.join(','));
    } else if (ctx.get('Access-Control-Request-Headers')) {
      ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
    }
    // Request
    if (options.exposeHeaders) {
      ctx.set('Access-Control-Expose-Headers', options.exposeHeaders.join(','));
    }

    if (ctx.method === 'OPTIONS') {
      // if (!ctx.get('Access-Control-Request-Method')) {
      //   return await next();
      // }
      ctx.status = 204; // No Content
    } else {
      await next();
    }
  };
}