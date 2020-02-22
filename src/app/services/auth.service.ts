import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs';
import { config } from '../config';

@Injectable()
export class AuthService {
    private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    private heroesUrl = config.Url + '/api/auth';
  
    constructor(private http: Http) { }
  
    public logIn(acc: string, pass: string): Promise<any> {
  
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('studentId', acc);
      urlSearchParams.append('pass', pass);
      
      return this.http
      .post(this.heroesUrl, urlSearchParams.toString(), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
    }
  
    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); 
      return Promise.reject(error.message || error);
    }
}
