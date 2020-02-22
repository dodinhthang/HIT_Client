import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs';
import { config } from '../config';

@Injectable()
export class UserService {
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  private heroesUrl = config.Url + '/api/user';

  constructor(private http: Http) {}

  public checkLogin(token: string): Promise<any> {
    var url = this.heroesUrl + '/check';

    this.headers.set('x-access-token', token);
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(err => console.log(err));
  }
  public SignUp(studentId: string, pass: string, name: string, phone: string, birthDate: Date, email: string): Promise<any> {
    let Url = this.heroesUrl + '/add';

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('studentId', studentId);
    urlSearchParams.append('pass', pass);
    urlSearchParams.append('phone', phone);
    urlSearchParams.append('birthDate', birthDate.toDateString());
    urlSearchParams.append('name', name);
    urlSearchParams.append('email', email);

    return this.http
      .post(Url, urlSearchParams.toString(), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public Update(data): Promise<any> {
    let Url = this.heroesUrl + '/';
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('studentId', data.studentId);
    urlSearchParams.append('pass', data.pass);
    urlSearchParams.append('phone', data.phone);
    urlSearchParams.append('birthDate', data.birthDate);
    urlSearchParams.append('name', data.name);
    urlSearchParams.append('email', data.email);
    urlSearchParams.append('group', data.group);
    urlSearchParams.append('isLocked', data.isLocked);
    urlSearchParams.append('role', data.role);

    return this.http
      .put(Url, urlSearchParams.toString(), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public CheckSignUp(studentId: string) {
    let url = this.heroesUrl + '/checksignup/' + studentId;
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json)
      .catch(this.handleError);
  }
  public GetAdmins() {
    this.headers.set('x-access-token', localStorage.getItem('token'));
    let url = this.heroesUrl + '/admin';
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public GetUsers(page: number, limit: number, bol) {
    this.headers.set('x-access-token', localStorage.getItem('token'));
    let url = this.heroesUrl + '/?page=' + page + '&limit=' + limit + '&filter=' + bol;

    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public GetUserById(studentId: string) {
    let url = this.heroesUrl + '/' + studentId;
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public DeleteUser(studentId: string) {
    let url = this.heroesUrl + '/' + studentId;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public LockUser(studentId: string) {
    let url = this.heroesUrl + '/' + studentId;
    let urlSearchParams = new URLSearchParams();
    return this.http
      .put(url, urlSearchParams.toString(), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
