import fs from 'fs';
import cors from 'cors';
import express, {Request, Response} from 'express';
import fileUpload from 'express-fileupload';
import {root_router} from './routes/root';
import {project_router} from './routes/project';
import {projects_router} from './routes/projects';
import {image_router} from './routes/image';
import {CACHE_DIR} from './misc';

// Application constants
const HOST = 'localhost';
const PORT = 4000;
const ADDR = 'http://' + HOST + ':' + PORT

function create_cache() {
  fs.access(CACHE_DIR, fs.constants.R_OK, async (err) => {
    if(err) {
        console.log('no cache dir at:', CACHE_DIR);
        fs.mkdir(CACHE_DIR, (err) => {
          if(err){
            console.error('failed to create cache dir:', err);
            throw err;
          }
        });
    }
    else {
      console.log('cache dir at:', CACHE_DIR);
    }
  });
}

// Create application
const app: express.Application = express()

// Middleware
app.use(cors()); // Cross-Origin-Resource-Request
app.use(fileUpload());

// Add the routers
app.use('/', root_router);
app.use('/project', project_router);
app.use('/projects', projects_router);
app.use('/image', image_router);

// 404 Catch All
app.get('*', (_req: Request, res: Response) => {
  res.status(404);
  res.send({'message': '404: stream or resource not found!'});
})

// Start the app
create_cache()
app.listen(PORT, HOST, () => {
  console.log('Started server at:', ADDR);
});
