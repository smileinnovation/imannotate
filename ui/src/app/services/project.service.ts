import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Project } from '../classes/project';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';
import { Annotation } from "../classes/annotation";

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
    return this.api.get<Project>('/v1/project/' + name).pipe(tap(
      project => this.currentProject = project
    ));
  }

  getNextImage(): Observable<string> {
    return this.api.get<string>('/v1/project/' + this.currentProject.name + '/next');
  }

  // user id in the future
  saveAnnotation(project: string, annotation: Annotation): Observable<Annotation> {
    project = encodeURIComponent(project);
    return this.api.post<Annotation>(`/v1/project/${project}/annotate`, annotation);
  }
}
