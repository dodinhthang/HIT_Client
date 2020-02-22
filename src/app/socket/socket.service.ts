import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import * as io from 'socket.io-client';
import { SocketIOClient } from 'socket.io-client';
import { config } from '../config';

@Injectable()
export class SocketService {
  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect(
      config.SocketIO,
      {
        transports: ['websocket', 'polling']
      }
    );
  }


  // Interview
  startInterview(studentId) {
    this.socket.emit('interview', { studentId: studentId, command: 1000 });
  }
  finishInterview(studentId, interviewResult) {
    this.socket.emit('interview', { studentId: studentId, command: 1, interviewResult: interviewResult });
  }
  cancelInterview(studentId, interviewResult) {
    console.log('here');
    this.socket.emit('interview', { studentId: studentId, command: 0, interviewResult: interviewResult });
  }
  onUpdateInterview(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('interview', (data: any) => observer.next(data));
    });
  }

  // login

  login(params: any) {
    this.socket.emit('login', params);
  }
  emitAnswer(params: any) {
    this.socket.emit('question', params);
  }

  onLogin(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('login', (data: any) => observer.next(data));
    });
  }

  onAuth(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('auth', (data: any) => observer.next(data));
    });
  }

  onQuestion(): Observable<any> {
    return Observable.create(observer => {
      this.socket.on('question', (item: any) => observer.next(item));
    });
  }
  onUser(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user', (data: any) => observer.next(data));
    });
  }

  onConnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('connect', () => observer.complete());
    });
  }

  onDisconnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('disconnect', () => observer.complete());
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

}
