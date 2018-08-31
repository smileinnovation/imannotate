import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { ApiService } from '@app/services/api.service';
import { Project, ProjectStat } from '@app/classes/project';
import { UserService } from '@app/services/user.service';
import { Annotation } from "@app/classes/annotation";
import { User } from "@app/classes/user";
import { ImageResult } from "@app/classes/imageresult";

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
      return this.api.put<Project>(`/v1/project/${p.id}`, p).pipe(tap(
        data => this.getProjectList()
      ));
    }

    // save
    return this.api.post<Project>('/v1/project', p).pipe(tap(
      data => this.getProjectList()
    ));
  }

  getProject(name: string): Observable<Project> {
    return this.api.get<Project>(`/v1/project/${name}`).pipe(tap(
      project => this.currentProject = project
    ));
  }

  getContributors(project: Project): Observable<Array<User>> {
    return this.api.get<Array<User>>(`/v1/project/${project.id}/contributors`);
  }

  addContributor(user: string, project: Project): Observable<string> {
    return this.api.post(`/v1/project/${project.id}/contributors/${user}`, null);
  }

  removeContributor(user: string, project: Project): Observable<any> {
    return this.api.delete(`/v1/project/${project.id}/contributors/${user}`);
  }

  getNextImage(): Observable<ImageResult> {
    return this.api.get<ImageResult>('/v1/project/' + this.currentProject.id + '/next');
  }

  // user id in the future
  saveAnnotation(project: Project, annotation: Annotation): Observable<Annotation> {
    return this.api.post<Annotation>(`/v1/project/${project.id}/annotate`, annotation);
  }

  downloadAnnotation(project: Project): Observable<any> {
    return this.api.download<any>(`/v1/project/${project.id}/annotations/csv`, {
      responseType: "blob",
    });
  }

  deleteProject(p: Project): Observable<any>{
    return this.api.delete(`/v1/project/${p.id}`);
  }

  getInfo(p: Project): Observable<ProjectStat> {
    return this.api.get<ProjectStat>(`/v1/project/${p.id}/info`);
  }

}
