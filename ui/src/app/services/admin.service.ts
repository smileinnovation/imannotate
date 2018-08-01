import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from "@app/services/api.service";
import { ProjectStat } from "@app/classes/project";
import { User } from "@app/classes/user";

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

  setAdmin(u: User): Observable<any> {
    return this.api.post(`/v1/admin/user/${u.id}`, null);
  }

  removeAdmin(u: User): Observable<any> {
    return this.api.delete(`/v1/admin/user/${u.id}`);
  }
}
