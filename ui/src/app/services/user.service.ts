import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from "../classes/user";
import { Observable } from "rxjs/Observable";
import { ProjectService } from "./project.service";
import { Project } from "../classes/project";

@Injectable()
export class UserService {

  user$: Observable<User>

  constructor(
    private api: ApiService,
    private projectService: ProjectService) {
    console.log("get user")
    this.user$ = this.current()
  }

  login(user: User){
    return this.api.post<User>("/signin", user)
  }

  signup(user: User){
    return this.api.post<User>("/signup", user)
  }

  current() {
    return this.api.get<User>("/user/me")
  }

}
