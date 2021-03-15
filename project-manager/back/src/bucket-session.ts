import {Storage, Bucket, UploadResponse, GetFileMetadataResponse} from '@google-cloud/storage';

// 10800
const STALE_TIME = 60; // Seconds for a signed url to live

class TemporaryImageLink {
  name: string;
  url: string;
  age: number;
  metadata: any;

  constructor(name: string, url: string, age: number, metadata: any) {
    this.name = name;
    this.url = url;
    this.age = age;
    this.metadata = metadata;
  }

  is_stale(now: number) {
    return (this.age - now) >= 0;
  }
}

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

  async getImage(name: string): Promise<TemporaryImageLink>{
    const age = new Date().getTime() + STALE_TIME;
    const file = this.bucket.file(name);
    const url = await file.getSignedUrl({action: 'read', expires: age});
    const metadata = await this.getImageMetadata(name);
    return new TemporaryImageLink(file.name, url.toString(), age, metadata);
  }

  async getImageMetadata(name: string): Promise<any> {
    const file = this.bucket.file(name);
    const data = await file.getMetadata();
    return data[0];
  }

  async uploadImage(path: string): Promise<TemporaryImageLink> {
    const age = new Date().getTime() + STALE_TIME;
    const res: UploadResponse = await this.bucket.upload(path);
    const file = res[0];
    file.getSignedUrl({action: 'read', expires: age}).then(async (url) => {
      const metadata = await this.getImageMetadata(file.name);
      return new TemporaryImageLink(file.name, url.toString(), age, metadata);
    }).catch((err) => {
      console.error(err);
    });
    return new TemporaryImageLink('', '', -1, {});
  }

  async downloadImage(path: string) {
    this.bucket.file(path).download({destination: path});
  }
}

const PROJECT_ID = 'portfolio-d3';
const BUCKET_ID = 'portfolio-d3-images';
const bucket = new BucketSession(PROJECT_ID, BUCKET_ID);
export {bucket, BucketSession, TemporaryImageLink};
