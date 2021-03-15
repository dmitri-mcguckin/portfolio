import cors from 'cors';
import express, {Request, Response} from 'express';
import fileUpload from 'express-fileupload';
import {root_router} from './routes/root';
import {project_router} from './routes/project';
import {projects_router} from './routes/projects';
import {image_router} from './routes/image';

// Application constants
const HOST = 'localhost';
const PORT = 4000;
const ADDR = 'http://' + HOST + ':' + PORT

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
app.listen(PORT, HOST, () => {
  console.log('Started server at:', ADDR);
});
