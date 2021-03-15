import {Firestore, DocumentData, DocumentReference, WriteResult} from '@google-cloud/firestore';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
}

interface ProjectModel extends Project {
  uid: string;
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

  async getAllProjects(): Promise<ProjectModel[]> {
    const projects = await this.session.collection(this.collection).get();
    return projects.docs.map((doc: DocumentData) => {
      const data = doc.data();
      return {uid: doc.id,
              title: data.title,
              subtitle: data.subtitle,
              description: data.description,
              images: data.images};
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
    return {uid: doc.id,
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            images: data.images};
  }

  async addProject(project: Project): Promise<ProjectModel> {
    const resource = await this.session.collection(this.collection)
                                       .add(project);
    const doc = await resource.get();
    const data: DocumentData | undefined = doc.data();
    if(data === undefined){
      throw EvalError('Failed to re-retreive newly created project!');
    }
    return {uid: resource.id,
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            images: data.images};
  }

  async updateProject(project: ProjectModel): Promise<ProjectModel> {
    const resource = this.session.collection(this.collection).doc(project.uid);
    const result: WriteResult = await resource.update(project);
    if(result === undefined){
      throw EvalError('Failed to update project with id: ' + project.uid)
    }
    return await this.getProject(project.uid);
  }

  async deleteProject(uid: string): Promise<void> {
    await this.session.collection(this.collection).doc(uid).delete();
  }
};

// Create Firestore session
const PROJECT_ID = 'portfolio-d3'; // GCP Project name
const COLLECTION = 'projects' // Firestore collection name
const db = new FirestoreSession(PROJECT_ID, COLLECTION);

export {db, FirestoreSession, Project, ProjectModel};
