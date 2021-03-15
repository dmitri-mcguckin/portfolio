import {basename} from 'path';
import {constants} from 'fs';
import {access, rm, writeFile} from 'fs/promises';
import {Storage, Bucket, File} from '@google-cloud/storage';

class BucketSession {
  projectId: string;
  bucketId: string;
  authFile: string;
  session: Storage;
  bucket: Bucket;

  constructor(projectId: string, bucketId: string) {
    this.projectId = projectId;
    this.bucketId = bucketId;
    this.authFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';

    this.session = new Storage({
      projectId: this.projectId,
      keyFilename: this.authFile
    });
    this.bucket = this.session.bucket(this.bucketId);
  }

  async uploadImage(path: string): Promise<File> {
    const res = await this.bucket.upload(path);
    const file = res[0];
    if(!file){
      throw Error('External GCP error: uploaded image but failed to find it!');
    }
    const metadata = await file.getMetadata();
    return metadata[0];
  }

  async downloadImage(path: string): Promise<void> {
    const file_name = basename(path);
    try {
      await this.bucket.file(file_name).download({destination: path});
    }
    catch {
      await rm(path, {force: true});
      throw Error('[BUCKET]: \'' + file_name + '\' does not exist!');
    }
  }

  async downloadImageMetadata(path: string): Promise<void> {
    const file_name = basename(path);
    const meta_path = path + '.json';
    try {
      const meta_res = await this.bucket.file(file_name).getMetadata();
      const metadata = meta_res[0];
      await writeFile(meta_path, JSON.stringify(metadata));
    }
    catch {
      await rm(meta_path, {force: true});
      throw Error('[BUCKET]: Metadata for \'' + file_name + '\' does not exist!');
    }
  }

  async deleteImage(path: string): Promise<void> {
    const file_name = basename(path);
    const meta_path = path + '.json';
    try {
      await rm(path, {force: true});
      await rm(meta_path, {force: true});
      await this.bucket.file(file_name).delete();
    }
    catch {
      throw Error('[BUCKET]: \'' + file_name + '\' does not exist!');
    }
  }
}

const PROJECT_ID = 'portfolio-d3';
const BUCKET_ID = 'portfolio-d3-images';
const bucket = new BucketSession(PROJECT_ID, BUCKET_ID);
export {bucket, BucketSession};
