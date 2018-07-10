import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User } from '../classes/user';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserService {

  private userSource = new Subject<User>();
  public currentUser = new User();
  user$ = this.userSource.asObservable();

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  login(user: User): Observable<User> {
    return this.api.post<User>('/v1/user/signin', user).pipe(tap(
      u => {
        console.log('login ok', new Date().toString());
        this.currentUser = u;
        localStorage.setItem('user', JSON.stringify(u));
        this.userSource.next(u);
      },
      error => {
        console.log('login failed',  new Date().toString());
        this.currentUser = null;
        this.userSource.error(error);
      }
    ));
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser = null;
    this.userSource.error('logout');
    this.router.navigate(['/']);
  }

}
