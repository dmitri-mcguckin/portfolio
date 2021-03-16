import {log_request, set_json} from '../misc';
import {Request, Response, Router} from 'express';
import {db, ProjectModel} from '../firestore-session';
import {param, body, check, validationResult} from 'express-validator';

export const project_router = Router(); // Create custom router

// Get Project by UID
project_router.get('/:uid',
                   param('uid').notEmpty().isString().trim().escape(),
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
  db.getProject(req.params.id).then((project: ProjectModel) => {
    return set_json(res)
           .status(200)
           .json(project);
  }).catch((err) => {
    console.error(err);
    return set_json(res)
           .status(404)
           .json({'error': err.message});
  });
});

// Create a  Project
project_router.post('/',
                    body('title').notEmpty().isString().trim().escape(),
                    body('subtitle').notEmpty().isString().trim().escape(),
                    body('description').notEmpty().isString().trim().escape(),
                    body('images').isArray().default([]),
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
  const new_project = {
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.description,
    images: req.body.images,
  };

  console.debug('Attempting to make:', new_project);

  db.addProject(new_project).then((resource: ProjectModel) => {
    console.log('Created project:', resource);
    return set_json(res)
           .status(201)
           .json(resource);
    }).catch((err) => {
      console.error(err);
      return set_json(res, {'Accept': 'server failed to create resource'})
             .status(500)
             .json({'error': err.message})
    });
});

// Update a Project
project_router.patch('/:uid',
                     param('uid').notEmpty().isString().trim().escape(),
                     body('title').isString().trim().escape(),
                     body('subtitle').isString().trim().escape(),
                     body('description').isString().trim().escape(),
                     body('images').isArray().default([]),
                     (req: Request, res: Response) => {
  log_request(req); // Log HTTP request

  // Input validation
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return set_json(res, {'Accept': 'missing or invalid update parameters'})
           .status(406)
           .json({'errors': errors.array()});
  }

  // Fulfill the request
  const new_project = {
    uid: req.params.uid,
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.description,
    images: req.body.images,
  };

  db.updateProject(new_project).then((resource: ProjectModel) => {
    console.log('Updated project:', resource);
    return set_json(res)
           .status(205)
           .json({'message': 'project updated', 'project': resource});
  }).catch((err) => {
    console.error(err);
    return set_json(res, {'Accept': 'project not found'})
           .status(404)
           .json({'errors': err.message});
  });
});

// Delete a Project
project_router.delete('/:uid',
                      param('uid').notEmpty().isString().trim().escape(),
                      (req: Request, res: Response) => {
  log_request(req); // Log HTTP request

  // Input validation
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return set_json(res, {'Accept': 'no project uid provided'})
           .status(406)
           .json({'errors': errors.array()});
  }

  // Fulfill the request
  const project_id = req.params.uid;

   db.deleteProject(project_id).then(() => {
     console.log('Deleted project: #' + project_id);
     return set_json(res)
            .status(202)
            .json({'message': 'project deleted'});
   }).catch((err) => {
     console.error(err);
     return set_json(res, {'Accept': 'project not found'})
            .status(404)
            .json({'error': err.message});
   });
});
