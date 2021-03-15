import {Firestore, DocumentData, DocumentReference, WriteResult} from '@google-cloud/firestore';

class Project {
  title: string;
  description: string;
  url: string;
  age: number;

  constructor(title: string, description: string, url: string, age: number) {
    this.title = title;
    this.description = description;
    this.url = url;
    this.age = age;
  }

  to_json(): Object {
    return {
      title: this.title,
      description: this.description,
      url: this.url,
      age: this.age,
    };
  }
}

class ProjectModel extends Project {
  uid: string;

  constructor(uid: string, title: string, description: string, url: string, age: number) {
    super(title, description, url, age);
    this.uid = uid;
  }

  to_json(): Object {
    return Object.assign({}, super.to_json(), {uid: this.uid});
  }
}

class FirestoreSession {
  projectId: string;
  collection: string;
  authFile: string;
  session: Firestore;

  constructor(projectId: string, collection: string) {
    this.projectId = projectId;
    this.collection = collection;
    this.authFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';

    this.session = new Firestore({
      projectId: this.projectId,
      keyFilename: this.authFile
    });
  }

  async getProjects(): Promise<ProjectModel[]> {
    const projects = await this.session.collection(this.collection).get();
    return projects.docs.map((doc: DocumentData) => {
      const data = doc.data();
      return new ProjectModel(doc.id, data.title, data.description, data.url, data.age);
    });
  }

  async getProject(uid: string): Promise<ProjectModel> {
    const docref: DocumentReference = this.session.collection(this.collection).doc(uid);
    if(docref === undefined){
      throw new EvalError('Project with uid: ' + uid + ' not found!');
    }
    const doc = await docref.get();
    if(doc === undefined){
      throw new EvalError('Empty Firebase document!');
    }
    const data: DocumentData | undefined = doc.data();
    if(data === undefined){
      throw EvalError('Project with uid: ' + uid + ' not found!')
    }
    return new ProjectModel(doc.id, data.title, data.description, data.url, data.age);
  }

  async addProject(project: Project): Promise<ProjectModel> {
    const resource = await this.session.collection(this.collection)
                                       .add(project.to_json());
    const doc = await resource.get();
    const data: DocumentData | undefined = doc.data();
    if(data === undefined){
      throw EvalError('Failed to re-retreive newly created project!');
    }
    return new ProjectModel(resource.id, data.title, data.description, data.url, data.age);
  }

  async updateProject(project: ProjectModel): Promise<ProjectModel> {
    const resource = this.session.collection(this.collection).doc(project.uid);
    const result: WriteResult = await resource.update({
      'title': project.title,
      'description': project.description,
      'url': project.url,
      'age': project.age,
    });
    if(result === undefined){
      throw EvalError('Failed to update project with id: ' + project.uid)
    }
    return await this.getProject(project.uid);
  }

  async deleteProject(uid: string): Promise<boolean> {
    const result = this.session.collection(this.collection).doc(uid).delete();
    return result !== undefined;
  }
};

// Create Firestore session
const PROJECT_ID = 'portfolio-d3'; // GCP Project name
const COLLECTION = 'projects' // Firestore collection name
const db = new FirestoreSession(PROJECT_ID, COLLECTION);

export {db, FirestoreSession, Project, ProjectModel};
