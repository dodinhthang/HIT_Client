import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SocketService } from '../socket/socket.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(private router: Router, private socket: SocketService) {}

  ngOnInit() {}
  logOut() {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.socket) {
        this.socket.disconnect();
        this.socket.onDisconnect().subscribe(result => {});
      }
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
  }
}
