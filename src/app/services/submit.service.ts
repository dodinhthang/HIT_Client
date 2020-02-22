import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
// import {createReadStream}from 'fs';
import 'rxjs';
import { config } from '../config';
// import { Promise } from '../../../node_modules/@types/q';

@Injectable()
export class SubmitService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  // private heroesUrl = config.Url + '/api/play';

  constructor(private http: Http) { }

  public async getResult(submissionId): Promise<any> {
    let Url = config.SubmitCode + '/domjudge/api/judgings?cid=2&submitid=' + submissionId;
    let urlSearchParams = new URLSearchParams();
    // urlSearchParams.append('studentId', studentId)
    let auth = {
      'user': 'admin',
      'pass': 'admin',
      'sendImmediately': true
    };

    return await this.http.post(Url, auth, { headers: this.headers })

  }

  /**
   * Submit
   */
  public async Submit(file, sortName): Promise<any> {
    let url = config.SubmitCode + '/domjudge/api/submissions';
    let auth = {
      'user': 'dothang',
      'pass': 'dothang',
      'sendImmediately': true
    };
    let formData = {
      shortname: sortName,
      langid: 'cpp',
      contest: 'demo',
      'code[]': file,
    };
    // const formData: FormData = new FormData();
    // formData.append({})
    try {
      this.http.post(url, {
        auth: auth, url: url, formData: formData
      },{headers:this.headers}).toPromise().then(result=>console.log(result)).catch(e=>console.log(e))

      // let time = 0;
      // let interval = setInterval(async () => {
      //   console.log(res)
      //   await this.getResult(res)
      //   let result = JSON.parse(await this.getResult(res));
      //   if (result.length != 0) {
      //     console.log(result)
      //     clearInterval(interval);
      //   } else {
      //     time++;
      //     console.log('waiting for ..... ', res, ' time:', time)
      //   }
      // }, 1000)
    }
    catch (err) {
      console.log('EX: ');
      console.log(err);
    }
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
