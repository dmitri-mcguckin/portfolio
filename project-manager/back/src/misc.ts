import {Request, Response} from 'express';

export function set_json(res: Response, options: any = {}): Response {
  res.setHeader('Content-Type', 'application/json');
  Object.keys(options).forEach((key: string) => {
    const value = options[key];
    res.setHeader(key, value);
  });
  return res;
}

export function set_custom(res: Response,
                           content_type: string,
                           options: any = {}): Response {
  res.setHeader('Content-Type', content_type);
  Object.keys(options).forEach((key: string) => {
    const value = options[key];
    res.setHeader(key, value);
  });
  return res;
}

export function log_request(req: Request) {
  console.debug('[' + req.method, 'REQUEST]: (' + req.ip + ') ->', req.baseUrl + req.path);
  console.debug('Headers:', req.headers);
  console.debug('Body:', req.body);
}

export const CACHE_DIR = process.env.HOME + '/.cache/project-manager';
