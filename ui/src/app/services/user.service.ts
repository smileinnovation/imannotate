import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '@app/services/api.service';
import { User } from '@app/classes/user';

@Injectable()
export class UserService {

  private userSource = new Subject<User>();
  public currentUser = new User();
  public avatar = "";
  public isAdmin = false;
  user$ = this.userSource.asObservable();

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  login(user: User): Observable<User> {
    return this.api.post<User>('/v1/signin', user).pipe(tap(
      u => {
        console.log('login ok', new Date().toString());
        this.setCurrentUser(u)
        localStorage.setItem('user', JSON.stringify(u));
      },
      error => {
        console.log('login failed',  new Date().toString());
        this.currentUser = null;
        this.isAdmin = false;
        this.userSource.error(error);
      }
    ));
  }

  signup(user: User): Observable<User> {
    return this.api.post<User>('/v1/signup', user).pipe(tap(
      u => {
        console.log("user created", u);
      },
      error => {
        console.log("there were a problem", error)
      }
    ));
  }

  update(user: User): Observable<any> {
    return this.api.put<User>(`/v1/user/${user.id}`, user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser = null;
    this.userSource.error('logout');
    this.router.navigate(['/signin']);
  }

  search(username: string): Observable<Array<User>> {
    return this.api.get<Array<User>>(`/v1/search/user?q=${username}`)
  }

  getUser(id: string): Observable<User> {
    return this.api.get<User>(`/v1/user/${id}`);
  }

  setCurrentUser(user: User) {
    this.currentUser = user
    this.api.head("/v1/isadmin").subscribe(
      () => this.isAdmin = true,
      () => this.isAdmin = false
    );
    this.userSource.next(user);
    this.getAvatar().subscribe(img => this.avatar = img);
  }

  getAvatar(): Observable<string>{
    return this.api.get(`/v1/avatar/${this.currentUser.id}`);
  }
}
