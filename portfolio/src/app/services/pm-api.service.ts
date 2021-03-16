import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
}

@Injectable({
  providedIn: 'root'
})

export class PmApiService {
  constructor(private http: HttpClient){}

  public async getAllProjects(): Promise<Project[]> {
    const res: any = await this.http.get('http://localhost:4000/projects', {observe: 'body'}).toPromise();
    console.log('API:', res);
    return res.map((p: any) => {
      const project: Project = {
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        images: p.images,
      };
      return project;
    });
  }
}
