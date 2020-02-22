import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket';
import { Router } from '@angular/router';
import { PlayService } from '../services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  startBtnClicked = false;
  constructor(private socket: SocketService, private router: Router, private play: PlayService) {}

  ngOnInit() {
    if (this.router.url === '/user/competitive') {
      this.startBtnClicked = true;
    }
  }
  logOut() {
    const token = localStorage.getItem('token');

    if (token) {
      if (this.socket) {
        this.socket.onDisconnect().subscribe(result => {
        });
      }
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
  }

  startTest() {
    this.startBtnClicked = true;
  }
}
