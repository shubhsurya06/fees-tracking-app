import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth-service';
import { User } from '../../core/model/user-model';
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  router = inject(Router);
  authService = inject(AuthService);

  constructor() { }

  ngOnInit(): void {

  }

  /** 
   * user will login from here
  */
  login() {
    let req: User = {
      userName: 'suryainstitute12@yopmail.com',
      password: 'instituteAdmin@123'
    }

    this.authService.login(req).subscribe({
      next: (res: any) => {
        console.log('Login Success:', res);
        const token = res.token;
        this.authService.saveToken(token);
        this.redirectToMaster();
      },
      error: (err) => {
        alert('Error while login. Please try again!')
        console.log('Login Error:', err);
      }
    })
  }

  // after login success, redirect to master page
  redirectToMaster() {
    this.router.navigate(['master'])
  }
}
