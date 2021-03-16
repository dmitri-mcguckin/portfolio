import {constants} from 'fs';
import {bucket} from '../bucket-session';
import {File} from '@google-cloud/storage';
import fileUpload from 'express-fileupload';
import {Request, Response, Router} from 'express';
import {access, readFile, writeFile} from 'fs/promises';
import {param, header, validationResult} from 'express-validator';
import {log_request, set_json, set_custom, CACHE_DIR} from '../misc';

export const image_router = Router(); // Create custom router

// Middleware
image_router.use(fileUpload());

// Get Image by Name
image_router.get('/:name',
                 param('name').notEmpty().isString(),
                 async (req: Request, res: Response) => {
    log_request(req); // Log HTTP request

    // Input validation
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return set_json(res, {'Accept': 'no file name specified'})
               .status(406)
               .json({'errors': errors.array()});
    }

    // Fulfill the request
    const file_name = req.params.name;
    const local_path = CACHE_DIR + '/' + file_name;
    const metadata_path = local_path + '.json';


    // Guarentee that the image can be cached or end the response
    try { // Is the image in the cache?
      await access(local_path, constants.O_RDWR) === undefined;
    }
    catch { // The image is not in the cache, so fetch it
      console.log('Fetching', file_name, 'from GCP storage:');
      try {
        await bucket.downloadImage(local_path);
      } catch(err) {
        return set_json(res, {'Accept': 'image not found'})
               .status(404)
               .json({'error': err.message});
      }
    }

    // Guarentee that the metadata can be cached or end the response
    try { // Is the image in the cache?
      await access(metadata_path, constants.O_RDWR) === undefined;
    }
    catch { // The image is not in the cache, so fetch it
      console.log('Fetching', file_name, 'metadata from GCP storage:');
      try {
        await bucket.downloadImageMetadata(local_path);
      } catch(err) {
        return set_json(res, {'Accept': 'metadata not found'})
               .status(404)
               .json({'error': err.message});
      }
    }

    // Image and metadata are guarenteed to exist after here
    const raw_metadata = await readFile(metadata_path);
    const metadata = JSON.parse(raw_metadata.toString());
    console.log('Serving image:', local_path, 'With metadata:', metadata);
    return set_custom(res, metadata.contentType)
           .status(200)
           .sendFile(local_path);
});

// Create an Image
image_router.post('/:name',
                  param('name').notEmpty().isString(),
                  header('origin').notEmpty(),
                  (req: Request, res: Response) => {
    log_request(req); // Log HTTP request

    // Input validation
    const errors = validationResult(req);
    if(!errors.isEmpty() || !req.files) {
        return set_json(res, {'Accept': 'no files attached to request'})
               .status(406)
               .json({'errors': errors.array()});
    }

    // Fulfil the request
    const file: any = req.files.file;
    const local_path = CACHE_DIR + '/' + req.params.name;

    // Write the image to cache
    console.log('Downloading image to cache:', local_path);
    writeFile(local_path, file.data).then(() => {
      console.log('Wrote to cache:', local_path);
    }).catch((err) => {
      console.error(err);
      return set_json(res, {'Accept': 'the server failed to accept the image'})
      .status(500)
      .json({'error': err.message});
    });

    // Upload to GCP storage
    console.log('Uploading to GCP storage...');
    bucket.uploadImage(local_path).then((img: File) => {
      console.log('Successfully created image in GCP storage:', img.name);

      // Write the metadata to cache
      const metadata_path = local_path + '.json';
      writeFile(metadata_path, JSON.stringify(img)).then(() => {
        console.log('Wrote to cache:', metadata_path);
      }).catch((err) => {
        // Failed to write the metadata to file
        console.error(err);
        return set_json(res, {'Accept': 'the server failed to accept the image metadata'})
               .status(500)
               .json({'error': err.message});
      });

      // Sucessfully created remote and cached image
      return set_json(res)
             .status(201)
             .json({'images': [img.name]});
    }).catch((err) => {
      // Failed to upload the image to GCP storage
      console.error('Failed to upload to GCP storage:', err);
      return set_json(res, {'Accept': 'the server failed to upload the image'})
             .status(500)
             .json({'error': err.message});
    });
});

// Delete an Image by Name
image_router.delete('/:name',
                    param('name').notEmpty().isString(),
                    async (req: Request, res: Response) => {
    log_request(req); // Log HTTP request

    // Input validation
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return set_json(res, {'Accept': 'no image name specified'})
               .status(406)
               .json({'errors': errors.array()});
    }

    // Fulfil the request
    const local_path = CACHE_DIR + '/' + req.params.name;
    bucket.deleteImage(local_path).then(() => {
      console.log('Deleted image:', req.params.name);
      return set_json(res)
             .status(205)
             .json({'message': 'image deleted'});
    }).catch((err) => {
      console.error(err);
      return set_json(res, {'Accept': 'image not found'})
             .status(404)
             .json({'error': err.message});
    });
});
