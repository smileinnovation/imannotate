import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Project } from "../classes/project";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ProjectService {


  projects: Project[] = new Array<Project>()

  constructor(private api: ApiService) {
    this.getProjectList()
  }

  getProjectList(): Observable<Project[]>{
    let obs = this.api.get<Project[]>("/projects/get")
    obs.subscribe(projects => this.projects = projects)
    return obs
  }

  save(p: Project){
    let obs = this.api.post<Project>("/project", p)
    obs.subscribe(project => {
      this.getProjectList()
    })
    return obs
  }
}
