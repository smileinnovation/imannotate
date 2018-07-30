import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { tap } from "rxjs/operators";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private api: ApiService,
    private user: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('interceptor', this.user.currentUser.token);
    if (this.user.currentUser && this.user.currentUser.token !== '') {
      req = req.clone({
        setHeaders: {
          'Authorization': this.user.currentUser.token,
        },
      });
    }
    return next.handle(req).pipe(tap(
      () => {},
      error => {
        if (error.error == "Token is expired") {
          this.user.logout();
        }
      })
    );
  }
}
