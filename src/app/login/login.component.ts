import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //Login
  hide = true;
  //Form Sign Up
  formSignUp: FormGroup;
  //Form Logini
  formLogin: FormGroup;
  md5;
  constructor(private auth: AuthService, private router: Router, private user: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.md5 = new Md5();
    //Khởi tạo FormBuilder
    this.formSignUp = this.fb.group({
      studentId: ['', Validators.required],
      pass: ['', Validators.minLength(6)],
      repass: ['', Validators.minLength(6)],
      birthDate: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.email]
    });

    this.formLogin = this.fb.group({
      studentId: ['', Validators.required],
      pass: ['', Validators.minLength(6)]
    });
    //Kiểm tra đăng nhập
    let token = localStorage.getItem('token');
    if (token) {
      this.user
        .checkLogin(token)
        .then(res => {
          if (res.code == 1) {
            let role = localStorage.getItem('role');
            if (role === 'admin') {
              this.router.navigate(['admin']);
            } else if (role === 'user') {
              this.router.navigate(['']);
            }
          } else {
            localStorage.removeItem('token');
            this.router.navigate(['login']);
          }
        })
        .catch(err => {
          localStorage.removeItem('token');
          this.router.navigate(['login']);
        });
    } else {
      this.router.navigate(['login']);
    }
  }
  Login() {
    let body = this.formLogin.value;
    this.auth
      .logIn(body.studentId, body.pass)
      .then(result => {
        if (result.code == 1) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('name', result.user.name);
          localStorage.setItem('studentId', result.user.studentId);
          localStorage.setItem('role', result.user.role);
          sessionStorage.setItem('session', this.md5.appendStr(result.user.role + result.user.studentId).end());
          if (result.user.role === 'admin') {
            this.router.navigate(['admin']);
          } else {
            if (result.user.role === 'judge') {
              this.router.navigate(['/judge']);
            } else {
              this.router.navigate(['/user']);
            }
          }
        } else {
          alert('Đăng nhập thất bại!');
        }
      })
      .catch(err => {
        alert('Đăng nhập thất bại!');
        this.router.navigate(['login']);
      });
  }
  SignUp() {
    let body = this.formSignUp.value;
    if (body.pass == body.repass) {
      this.user.SignUp(body.studentId, body.pass, body.name, body.phone, body.birthDate, body.email).then(result => {
        if (result.code == 1) {
          this.auth
            .logIn(body.studentId, body.pass)
            .then(user => {
              if (user.code == 1) {
                localStorage.setItem('token', user.token);
                localStorage.setItem('name', user.user.name);
                localStorage.setItem('studentId', user.user.studentId);
                localStorage.setItem('role', user.user.role);
                sessionStorage.setItem('session', this.md5.appendStr(user.user.role + user.user.studentId).end());
                if (user.user.role === 'admin') {
                  this.router.navigate(['admin']);
                } else {
                  alert('Đăng kí thành công!');
                  this.router.navigate(['']);
                }
              }
            })
            .catch(err => {
              this.router.navigate(['login']);
            });
        } else {
          alert('Đăng kí thất bại!');
        }
      });
    } else {
      alert('Mật khẩu không trùng.');
    }
  }
}
