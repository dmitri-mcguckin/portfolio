import {Request, Response, Router} from 'express';
import {param, header, validationResult} from 'express-validator';
import {db, Project, ProjectModel} from '../firestore-session';

export const project_router = Router(); // Create custom router

function commonHeaders(res: Response) {
  res.setHeader('Content-Type', 'application/json');
}

// GET a project
project_router.get('/:id',
                   param('id').isString().isLength({min:6}).trim().escape(),
                   (req: Request, res: Response) => {
  console.log(req.method, 'request from:', req.ip + ', for', req.path);
  commonHeaders(res);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(406)
              .json({'message': 'Bad query!',  'errors': errors.array()});
  }

  db.getProject(req.params.id).then((project: ProjectModel) => {
    return res.status(200).json(project.to_json());
  }).catch(err => res.status(404).json({'message': err.message}));
});

// POST a project
project_router.post('/',
                    header('title').isString().isLength({min: 6}).trim().escape(),
                    header('description').isString().isLength({min: 1}).trim().escape(),
                    header('image_name').isString().isLength({min: 6}).trim().escape(),
                    (req: Request, res: Response) => {
  console.log(req.method, 'request from:', req.ip + ', for', req.path);
  commonHeaders(res);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(406)
              .json({'message': 'Bad parameters!',  'errors': errors.array()});
  }

  const title: string = req.get('title') || '';
  const description: string = req.get('description') || '';
  const url: string = req.get('url') || '';
  const age: number = parseInt(req.get('age') || '') || -1;
  const new_project = new Project(title, description, url, age);

  db.addProject(new_project).then((resource: ProjectModel) => {
    console.log('Created project:', resource);
    return res.status(201)
              .json({'message': 'Project created!', 'project': resource.to_json()});
  }).catch(err => res.status(500).json({'message': err.message}));
});

// PATCH a project
project_router.patch('/:id',
                     param('id').isString().isLength({min:6}).trim().escape(),
                     header('title').isString().isLength({min: 6}).trim().escape(),
                     header('description').isString().isLength({min: 1}).trim().escape(),
                     header('url').isString().isURL().trim().escape(),
                     header('age').isNumeric().trim().escape(),
                     (req: Request, res: Response) => {
  console.log(req.method, 'request from:', req.ip + ', for', req.path);
  commonHeaders(res);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(406)
              .json({'message': 'Bad parameters!',  'errors': errors.array()});
  }

  const title: string | undefined = req.get('title') || '';
  const description: string | undefined = req.get('description') || '';
  const url: string = req.get('url') || '';
  const age: number = parseInt(req.get('age') || '') || -1;
  const new_project = new ProjectModel(req.params.id, title, description, url, age);

  db.updateProject(new_project).then((resource: ProjectModel) => {
    console.log('Updated project:', resource);
    return res.status(202)
              .json({'message': 'Project updated!', 'project': resource.to_json()});
  }).catch(err => res.status(500).json({'message': err.message}));
});

// DELETE a project
project_router.delete('/:id',
                      param('id').isString().isLength({min:6}).trim().escape(),
                      (req: Request, res: Response) => {
   console.log(req.method, 'request from:', req.ip + ', for', req.path);
   commonHeaders(res);
   const errors = validationResult(req);
   if(!errors.isEmpty()){
     return res.status(406)
               .json({'message': 'Bad parameters!',  'errors': errors.array()});
   }

   db.deleteProject(req.params.id).then((is_deleted) => {
     if(is_deleted){
       return res.status(202).json({'message': 'Project deleted!'});
     }
     else {
       return res.status(500).json({'message': 'There was a problem deleting the project!'});
     }
   });
});
