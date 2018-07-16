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

  public put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(this.apiLocation + endpoint, body, this.options);
  }

  public head(endpoint: string) {
    return this.http.head(this.apiLocation + endpoint, this.options);
  }

  public delete(endpoint: string) {
    return this.http.delete(this.apiLocation + endpoint, this.options);
  }

  public download<T>(endpoint: string, options: {}): Observable<T> {
    // merge options
    for (const key in this.options) {
      options[key] = this.options[key];
    }
    return this.http.get<T>(this.apiLocation + endpoint, options);
  }
}
