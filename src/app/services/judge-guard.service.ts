import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class JudgeGuardService implements CanActivate {
  constructor(private router: Router) {}
  canActivate() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'judge') {
      return true;
    } else {
      this.router.navigate(['login']);
    }
  }
}
