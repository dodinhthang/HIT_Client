import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp } from '@angular/http';

import 'rxjs';
import { config } from '../config';
import { Observable } from 'rxjs';

@Injectable()
export class ProblemService {
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  private heroesUrl = config.Url + '/api/problem';

  constructor(private http: Http) {}
  public checkLogin(token: string): Promise<any> {
    var url = this.heroesUrl + '/check';

    this.headers.set('x-access-token', token);
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(err => this.handleError);
  }

  public Update(data): Promise<any> {
    let Url = this.heroesUrl + '/' + data._id;
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('data', JSON.stringify(data));

    return this.http
      .put(Url, urlSearchParams.toString(), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public Add(data): Promise<any> {
    let Url = this.heroesUrl;
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('data', JSON.stringify(data));

    return this.http
      .post(Url, urlSearchParams.toString(), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  public GetQuestions(page: number, limit: number) {
    this.headers.set('x-access-token', localStorage.getItem('token'));
    let url = this.heroesUrl + '/?page=' + page + '&limit=' + limit;
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public GetQuestionById(id: string) {
    let url = this.heroesUrl + '/' + id;
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public DeleteQuestion(id: string) {
    let url = this.heroesUrl + '/' + id;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  // postFile(fileToUpload: File): Promise<any> {
  //   let url = this.heroesUrl + '/submit';
  //   console.log(fileToUpload);

  //   let formData = new FormData();
  //   console.log(formData);
  //   formData.append('file', fileToUpload, 'test.cpp');
  //   const options = {
  //     data: { file: formData }
  //   };

  //   console.log(formData.get('file'));
  //   // for (var j = 0; j < fileToUpload.length; j++) {
  //   //   formData.append('file[]', files[j], files[j].name);
  //   this.headers.delete('Content-Type');
  //   return this.http
  //     .post(url, formData, { headers: this.headers })
  //     .toPromise()
  //     .then(res => res.json());
  // }
  postFile(fileToUpload: File,problemName:string): Promise<any> {
    let url = this.heroesUrl + '/submit';

    let formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('problemName',problemName);

    this.headers.delete('Content-Type');
    let token = localStorage.getItem('token');
    this.headers.set('x-access-token', token);
    console.log(this.headers)

    return this.http
      .post(url, formData, { headers: this.headers }).toPromise().then(res => res.json())
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
