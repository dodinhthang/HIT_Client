import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UserGuardService implements CanActivate {
  constructor(private router: Router) {}
  canActivate() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'user') {
      return true;
    } else {
      this.router.navigate(['login']);
    }
  }
}
