import {Request, Response, Router} from 'express';
import {db, ProjectModel} from '../firestore-session';

export const projects_router = Router(); // Create custom router

// GET all projects
projects_router.get('/', (req: Request, res: Response) => {
  console.log(req.method, 'request from:', req.ip + ', for', req.path);
  res.setHeader('Content-Type', 'application/json');

  db.getProjects().then((projects: ProjectModel[]) => {
    res.send(projects.map(p => p.to_json()));
  }).catch((err: Error) => {
    console.log(err);
    res.status(500);
    res.send({'message': err.message});
  });
});
