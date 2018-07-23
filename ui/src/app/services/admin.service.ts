import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Project } from "../classes/project";
import { Observable } from 'rxjs';

@Injectable()
export class AdminService {

  constructor(private api: ApiService) { }


  getProjects(): Observable<Project[]> {
    return this.api.get<Project[]>('/v1/admin/projects')
  }
}
