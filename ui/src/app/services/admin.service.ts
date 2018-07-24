import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { ProjectStat } from "../classes/project";
import { Observable } from 'rxjs';
import { User } from "../classes/user";

@Injectable()
export class AdminService {

  constructor(private api: ApiService) { }


  getProjects(): Observable<ProjectStat[]> {
    return this.api.get<ProjectStat[]>('/v1/admin/projects');
  }

  stats(): Observable<any> {
    return this.api.get('/v1/admin/stats');
  }

  getUserStat(): Observable<any> {
    return this.api.get(`/v1/admin/users`);
  }

  deleteUser(u: User): Observable<any> {
    return this.api.delete(`/v1/user/${u.id}`);
  }
}
