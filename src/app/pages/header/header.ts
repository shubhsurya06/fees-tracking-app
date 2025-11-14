import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth-service';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user/user-service';
import { IUser } from '../../core/model/user-model';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  userSrv = inject(UserService);
  id: string = '0';
  loggedUserData!: IUser;

  constructor() {
    this.loggedUserData = this.userSrv.loggedInUser();
    debugger;
    // Listen to router events to get the current route parameters
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '0';
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
