import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
@Injectable()
export class AdminGuardService implements CanActivate {
  constructor(private router: Router) {}
  canActivate() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'admin') {
      return true;
    } else {
      this.router.navigate(['login']);
    }
  }
}
