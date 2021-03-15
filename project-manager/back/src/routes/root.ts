import {log_request} from '../misc';
import {Request, Response, Router} from 'express';

export const root_router = Router(); // Create custom router
const AUTHOR = 'Dmitri McGuckin';
const WEBSITE = 'https://dmitrimcguckin.com';
const VERSION = '1.0.0';
const LICENSE = 'GPLv3.0';

// GET API version
root_router.get('/', (req: Request, res: Response) => {
  log_request(req); // Log HTTP request

  res.setHeader('Content-Type', 'application/json');
  res.send({'version': VERSION,
            'website': WEBSITE,
            'license': LICENSE,
            'author': AUTHOR})
});
