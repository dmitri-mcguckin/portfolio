import fs from 'fs';
import {bucket, TemporaryImageLink} from '../bucket-session';
import {Request, Response, Router} from 'express';
import {param, validationResult} from 'express-validator';
import {resolve} from 'path';

const CACHE_DIR = '~/.project-manager'
export const image_router = Router(); // Create custom router

// GET all images
image_router.get('/',
                 (_req: Request, res: Response) => {
    return res.status(404).json({'message': 'Not available!'});
});

// GET an image by name
image_router.get('/:name',
                 param('name').isString().isLength({min:6}),
                 (req: Request, res: Response) => {
    console.log(req.method, 'request from:', req.ip + ', for', req.path);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.setHeader('Content-Type', 'application/json');
      return res.status(406).json({'message': 'Bad parameters!', 'errors': errors.array()});
    }

    const local_path = req.params.name;
    fs.access(local_path, fs.constants.O_RDONLY, async (err) => {
      if(err){
        console.log('Fetching from Firestore:', local_path);
        bucket.downloadImage(local_path).then(() => {

        }).catch((err) => {
          console.log(err);
          res.setHeader('Content-Type', 'application/json');
          return res.status(404).json({'message': 'Image not found!'});
        });
      }

      bucket.getImageMetadata(local_path).then((metadata) => {
        const abs_path = resolve(local_path);
        const content_type = metadata.contentType;
        res.setHeader('Content-Type', content_type);
        return res.status(201).sendFile(abs_path);
      }).catch((err) => {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({'message': 'Image not found!'});
      });
    });
});

// POST an image
image_router.post('/',
                  (req: Request, res: Response) => {
    console.log(req.method, 'request from:', req.ip + ', for', req.path);
    res.setHeader('Content-Type', 'application/json');
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(406).json({'message': 'Bad parameters!', 'errors': errors.array()});
    }
    else if(!req.files) {
      return res.status(406).json({'message': 'No files uploaded!'});
    }
    const file: any = req.files.file;
    const download_path = file.name

    fs.writeFile(download_path, file.data, err => console.error(err));

    bucket.uploadImage(download_path).then((img: TemporaryImageLink) => {
      bucket.getImageMetadata(img.name).then((data) => {
        return res.status(201).json(data[0]);
      }).catch((err) => {
        return res.status(500).json({'message': 'There was a problem fetching metadata!', 'error': err});
      });
    }).catch((err) => {
      console.log(err);
      return res.status(500).json({'message': 'Failed to upload image to GCP storage!', 'error': err});
    }).finally(() => {
      // fs.rm(download_path, err => console.error(err));
    });
});
