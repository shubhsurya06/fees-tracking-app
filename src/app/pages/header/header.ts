import { Component, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth-service';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user/user-service';
import { NgClass } from '@angular/common';
import { IUser } from '../../core/model/user-model';
import { APP_CONSTANT } from '../../core/constant/appConstant';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements AfterViewInit{
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  userService = inject(UserService);

  @ViewChild('navbar') navbar!: ElementRef;
  navbarHeight = 0;

  id: string = '0';
  loggedUserData!: IUser;

  constructor() {
    this.loggedUserData = this.userService.loggedInUser();
    // Listen to router events to get the current route parameters
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '0';
    });

    if (!this.userService.loggedInUser()) {
      this.userService.getLoggedInUser()
    }
  }

  ngAfterViewInit(): void {
    APP_CONSTANT.SCREEN_HEIGHTS.NAVBAR_HEIGHT = this.navbar.nativeElement.offsetHeight;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
