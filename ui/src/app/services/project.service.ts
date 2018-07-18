import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Project } from '../classes/project';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';
import { Annotation } from "../classes/annotation";
import { User } from "../classes/user";
import { ImageResult } from "../classes/imageresult";

@Injectable()
export class ProjectService {

  projects: Project[] = new Array<Project>();
  currentProject: Project;

  constructor(private api: ApiService, private userService: UserService) { }

  getProjectList(): Observable<Project[]> {
    const obs = this.api.get<Project[]>('/v1/projects').pipe(tap(
      projects => this.projects = projects
    ));
    return obs;
  }

  save(p: Project, edit: boolean = false): Observable<Project> {
    console.log("Create project", p, "edit:", edit)
    if (edit){
      // edit
      return this.api.put<Project>('/v1/project', p).pipe(tap(
        data => this.getProjectList()
      ));
    }

    // save
    return this.api.post<Project>('/v1/project', p).pipe(tap(
      data => this.getProjectList()
    ));
  }

  getProject(name: string): Observable<Project> {
    name = encodeURIComponent(name);
    return this.api.get<Project>(`/v1/project/${name}`).pipe(tap(
      project => this.currentProject = project
    ));
  }

  getContributors(project: Project): Observable<Array<User>> {
    return this.api.get<Array<User>>(`/v1/project/${project.name}/contributors`);
  }

  addContributor(user: string, project: Project): Observable<string> {
    return this.api.post(`/v1/project/${project.name}/contributors/${user}`, null);
  }

  removeContributor(user: string, project: Project): Observable<any> {
    return this.api.delete(`/v1/project/${project.name}/contributors/${user}`);
  }

  getNextImage(): Observable<ImageResult> {
    return this.api.get<ImageResult>('/v1/project/' + this.currentProject.name + '/next');
  }

  // user id in the future
  saveAnnotation(project: string, annotation: Annotation): Observable<Annotation> {
    project = encodeURIComponent(project);
    return this.api.post<Annotation>(`/v1/project/${project}/annotate`, annotation);
  }

  downloadAnnotation(project: Project): Observable<any> {
    return this.api.download<any>(`/v1/project/${project.name}/annotations/csv`, {
      responseType: "blob",
    });
  }

}
