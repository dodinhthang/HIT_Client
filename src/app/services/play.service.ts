import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs';
import { config } from '../config';

@Injectable()
export class PlayService {
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  private heroesUrl = config.Url + '/api/play';

  constructor(private http: Http) { }

  public GetQuestion(studentId: string): Promise<any> {
    let Url = this.heroesUrl ;
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('studentId', studentId);

    return this.http
      .post(Url, urlSearchParams.toString(), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
