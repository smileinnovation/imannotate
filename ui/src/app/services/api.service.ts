import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../classes/user';



@Injectable()
export class ApiService {

  options = {};

  constructor(public http: HttpClient) {
    this.options = {
      withCredentials: true,
    };
  }

  apiLocation = environment.apiURL;

  public get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.apiLocation + endpoint, this.options);
  }

  public post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.apiLocation + endpoint, body, this.options);
  }

  public head(endpoint: string) {
    return this.http.head(this.apiLocation + endpoint, this.options);
  }

}
