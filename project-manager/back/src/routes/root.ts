import {Request, Response, Router} from 'express';

export const root_router = Router(); // Create custom router

// GET root
root_router.get('/', (req: Request, res: Response) => {
  console.log(req.method, 'request from:', req.ip + ', for', req.path);
  res.setHeader('Content-Type', 'application/json');
  res.send({'message': 'Project Manager API v1.0.0'})
});
