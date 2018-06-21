import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {


  options = {}

  constructor(public http: HttpClient) {
    this.options = {
      withCredentials: true,
    }
  }

  apiLocation = environment.apiURL;

  public get<T>(endpoint: string): Observable<T>{
    return this.http.get<T>(this.apiLocation + endpoint, this.options)
  }

  public post<T>(endpoint: string, body: any): Observable<T>{
    return this.http.post<T>(this.apiLocation + endpoint, body, this.options)
  }

  public head(endpoint: string) {
    return this.http.head(this.apiLocation + endpoint, this.options)
  }

}
