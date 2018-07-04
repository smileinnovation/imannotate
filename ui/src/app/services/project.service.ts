import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Project } from '../classes/project';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class ProjectService {


  projects: Project[] = new Array<Project>();
  currentProject: Project;

  constructor(private api: ApiService, private userService: UserService) { }

  getProjectList(): Observable<Project[]> {
    const obs = this.api.get<Project[]>('/v1/projects');
    obs.subscribe(projects => this.projects = projects);
    return obs;
  }

  save(p: Project) {
    const obs = this.api.post<Project>('/v1/projects', p);
    obs.subscribe(project => {
      this.getProjectList();
    });
    return obs;
  }

  getProject(name: string): Observable<Project> {
    name = encodeURIComponent(name);
    const obs = this.api.get<Project>('/v1/project/' + name);
    obs.subscribe(project => this.currentProject = project);
    return obs;
  }

  getNextImage(): Observable<string> {
    return this.api.get<string>('/v1/project/' + this.currentProject.name + '/next');
  }
}
