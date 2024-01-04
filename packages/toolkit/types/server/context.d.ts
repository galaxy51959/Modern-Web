import {
  IncomingMessage,
  ServerResponse,
  IncomingHttpHeaders,
  Server as HttpServer,
} from 'http';
import qs from 'querystring';
import type { SSRMode } from 'common';
import { Metrics, Logger, Reporter, ServerTiming } from './utils';

export interface ModernServerContext {
  req: IncomingMessage;

  res: ServerResponse & { locals?: Record<string, any> };

  params: Record<string, string>;

  logger: Logger;

  metrics: Metrics;

  reporter: Reporter;

  serverTiming: ServerTiming;

  setParams: (params: Record<string, string>) => void;

  getReqHeader: (key: string) => void;

  headers: IncomingHttpHeaders;

  method: string;

  url: string;

  host: string;

  protocol: string;

  origin: string;

  href: string;

  path: string;

  querystring: string;

  query: qs.ParsedUrlQuery;

  status: number;

  serverData: Record<string, any>;

  resHasHandled: () => boolean;

  error: (dig: string, e: Error | string = '') => void;

  setServerData: (key: string, value: any) => void;
}

export interface BaseResponseLike {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => void;
  locals: Record<string, any>;
}

export type BaseSSRServerContext<T extends 'node' | 'worker' = 'node'> = {
  request: {
    params: Record<string, string>;
    pathname: string;
    query: Record<string, string>;
    headers: IncomingHttpHeaders;
    host: string;
    [propsName: string]: any;
  };
  response: BaseResponseLike;
  redirection: { url?: string; status?: number };
  loadableStats: Record<string, any>;
  routeManifest?: Record<string, any>;
  template: string;
  entryName: string;
  logger: {
    error: (message: string, e: Error | string) => void;
    debug: (message: string, ...args: any[]) => void;
    info: (message: string, ...args: any[]) => void;
  };
  metrics: {
    emitTimer: (
      name: string,
      cost: number,
      tags: Record<string, unknown> = {},
    ) => void;
    emitCounter: (
      name: string,
      counter: number,
      tags: Record<string, unknown> = {},
    ) => void;
  };
  reporter: Reporter;
  serverTiming: ServerTiming;
  cacheConfig?: any;

  enableUnsafeCtx?: boolean;

  nonce?: string;

  req: T extends 'worker' ? Request : ModernServerContext['req'];

  res: T extends 'worker' ? BaseResponseLike : ModernServerContext['res'];

  mode?: SSRMode; // ssr type

  isSpider?: boolean; // Check if it's spider request
};

export interface ServerInitHookContext {
  app?: HttpServer;
  server: ModernServerInterface;
}

export interface ISAppContext {
  appDirectory: string;
  distDirectory: string;
  sharedDirectory: string;
  plugins: {
    server?: any;
    serverPkg?: any;
  }[];
  [key: string]: unknown;
}
