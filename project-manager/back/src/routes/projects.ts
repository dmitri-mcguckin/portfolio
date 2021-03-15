import {log_request, set_json} from '../misc';
import {Request, Response, Router} from 'express';
import {db, ProjectModel} from '../firestore-session';
import {validationResult} from 'express-validator';

export const projects_router = Router(); // Create custom router

// Get All Projects
projects_router.get('/',
                    (req: Request, res: Response) => {
  log_request(req); // Log HTTP request

  // Input validation
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
     return set_json(res, {'Accept': 'missing or invalid parameters'})
            .status(406)
            .json({'errors': errors.array()});
  }

  // Fulfill the request
  db.getAllProjects().then((projects: ProjectModel[]) => {
    return set_json(res)
           .status(200)
           .json(projects);
  }).catch((err) => {
    console.error(err);
    return set_json(res)
           .status(404)
           .json({'error': err.message});
  });
});
