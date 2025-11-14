import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { IUser } from '../../core/model/user-model';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UserService } from '../../core/services/user/user-service';
import { APP_CONSTANT } from '../../core/constant/appConstant';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  userService = inject(UserService);
  router = inject(Router);
  authService = inject(AuthService);
  loginLoader = signal(false);
  submitted = signal(false);
  showPassword = false;

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  ngOnInit(): void {

  }

  /** 
   * user will login from here
  */
  login() {
    this.submitted.set(true);

    if (this.loginForm.invalid) return;

    this.loginLoader.set(true);
    let obj: IUser = {
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.password
    }

    this.authService.login(obj).subscribe({
      next: (res: any) => {
        this.resetOnLogin(true);
        console.log(res.message);
        let token = (res as any).token;
        this.authService.saveToken(token, res.data);
        this.redirectToMaster();
      },
      error: (error: any) => {
        console.log('Login Error:', error.error.message);
        if (error.error.message) {
          alert(error.error.message);
        } else {
          alert('Error while login. Please try again!')
        }
        this.resetOnLogin(false);
      }
    })
  }

  // reset loginForm, loader, submitted values after login clicked
  resetOnLogin(isformReset: boolean) {
    isformReset && this.loginForm.reset();
    this.loginLoader.set(false);
    this.submitted.set(false);
  }

  // after login success, redirect to master page
  redirectToMaster() {
    if (this.userService.loggedInUser().role == APP_CONSTANT.USER_ROLES.INSTITUTE_ADMIN) {
      this.router.navigateByUrl('/dashboard')  
      return;
    }
    this.router.navigate(['master'])
  }
}
