import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs';
import { config } from '../config';

@Injectable()
export class QuestionService {
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  private heroesUrl = config.Url + '/api/question';

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
    urlSearchParams.append('content', data.content);
    urlSearchParams.append('image', data.image);
    urlSearchParams.append('video', data.video);
    urlSearchParams.append('isHtml', data.isHtml);
    urlSearchParams.append('correctAnswer', data.correctAnswer);
    urlSearchParams.append('score', data.score);
    urlSearchParams.append('answered1', data.options[0].answer);
    urlSearchParams.append('answered2', data.options[1].answer);
    urlSearchParams.append('answered3', data.options[2].answer);
    urlSearchParams.append('answered4', data.options[3].answer);
    return this.http
      .put(Url, urlSearchParams.toString(), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public Add(data): Promise<any> {
    let Url = this.heroesUrl;
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('content', data.content);
    urlSearchParams.append('correctAnswer', data.correctAnswer);
    urlSearchParams.append('score', data.score);
    urlSearchParams.append('answered1', data.options[0].answer);
    urlSearchParams.append('answered2', data.options[1].answer);
    urlSearchParams.append('answered3', data.options[2].answer);
    urlSearchParams.append('answered4', data.options[3].answer);
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

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
